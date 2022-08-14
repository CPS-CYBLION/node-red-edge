const http = require('http');
const express = require('express');
const RED = require('node-red');
const bonjour = require('bonjour')();
const path = require('path');
const randomstring = require("randomstring");
let hostname = require("os").hostname();
const parseKey = require('./parseKey');

hostname = hostname.split('.')[0];

// Create an Express app
const app = express();
const server = http.createServer(app);

app.use('/', express.static('public'));

// node-red
const settings = {
	httpAdminRoot: '/red',
	httpNodeRoot: '/api',
	userDir: './.nodered/',
	functionGlobalContext: {}, // enables global context
};

RED.init(server, settings);

app.use(settings.httpAdminRoot, RED.httpAdmin);

app.use(settings.httpNodeRoot, RED.httpNode);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/startMDNS', (req, res) => {
	const serviceName = `${hostname}-cipherflow-${randomstring.generate(4)}`;
	bonjour.publish({ name: serviceName, type: 'http', port: 8000 })
	setTimeout(() => {
		bonjour.unpublishAll()
	}, 300000)
	// 5 minute
	res.status(200).send(serviceName);
})

app.get('/stopMDNS', (req, res) => {
	bonjour.unpublishAll(() => {
		res.status(200).send('ok');
	})
})

app.get('/import', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/page/import.html'));
})

app.post('/import', async (req, res) => {
	try {
		const { parmsBase64, publicKeyBase64 } = req.body

		const flows = await RED.runtime.flows.getFlows({});

		const timestamp = new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')

		const contextName = 'Imported Context ' + timestamp;
		const publicKeyName = 'Imported PublicKey ' + timestamp;

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'context',
			name: contextName,
			polyModulus: '8192',
			coeffModulus: '{"value": [60, 40, 40, 60]}',
			scale: '40',
			sealNode: '',
			importData: parmsBase64,
			isUpload: true,
		});

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'publicKey',
			name: publicKeyName,
			originContextNode: '',
			importData: publicKeyBase64,
			isUpload: true,
		});

		RED.runtime.flows.setFlows({
			flows: flows,
			deploymentType: 'full',
		});

		res.status(200).json(
			{
				contextNodeName: contextName,
				publicKeyNodeName: publicKeyName
			}
		)

	} catch (err) {
		console.error(err)
		res.status(400).send(err)
	}

})


app.post('/import/context', async (req, res) => {
	try {
		const { parmsBase64 } = req.body
		const flows = await RED.runtime.flows.getFlows({});

		const timestamp = new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')

		const contextName = 'Imported Context ' + timestamp;

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'context',
			name: contextName,
			polyModulus: '8192',
			coeffModulus: '{"value": [60, 40, 40, 60]}',
			scale: '40',
			sealNode: '',
			importData: parmsBase64,
			isUpload: true,
		});


		RED.runtime.flows.setFlows({
			flows: flows,
			deploymentType: 'full',
		});

		res.status(200).json(
			{
				contextNodeName: contextName,
			}
		)

	} catch (err) {
		console.err(err)
		res.status(400).send(err)
	}
})


app.post('/import/publicKey', async (req, res) => {
	try {
		const { publicKeyBase64 } = req.body
		const flows = await RED.runtime.flows.getFlows({});

		const timestamp = new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')

		const publicKeyName = 'Imported PublicKey ' + timestamp;

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'publicKey',
			name: publicKeyName,
			originContextNode: '',
			publicKeyBase64: publicKeyBase64,
			isUpload: true,
		});

		RED.runtime.flows.setFlows({
			flows: flows,
			deploymentType: 'full',
		});

		res.status(200).json(
			{
				publicKeyNodeName: publicKeyName
			}
		)

	} catch (err) {
		console.error(err)
		res.status(400).send(err)
	}
})


app.post('/import/secretKey', async (req, res) => {
	try {
		const { secretKeyBase64 } = req.body
		const flows = await RED.runtime.flows.getFlows({});

		const timestamp = new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')

		const secretKeyName = 'Imported SecretKey ' + timestamp;

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'secretKey',
			name: secretKeyName,
			originContextNode: '',
			importData: secretKeyBase64,
			isUpload: true,
		});

		RED.runtime.flows.setFlows({
			flows: flows,
			deploymentType: 'full',
		});

		res.status(200).json(
			{
				secretKeyNodeName: secretKeyName
			}
		)

	} catch (err) {
		console.error(err)
		res.status(400).send(err)
	}
})

app.post('/import/relinKey', async (req, res) => {
	try {
		const { relinKeyBase64 } = req.body
		const flows = await RED.runtime.flows.getFlows({});

		const timestamp = new Date().toISOString().
			replace(/T/, ' ').
			replace(/\..+/, '')

		const relinKeyName = 'Imported RelinKey ' + timestamp;

		flows.flows.push({
			id: RED.util.generateId(),
			type: 'relinKey',
			name: relinKeyName,
			originContextNode: '',
			importData: relinKeyBase64,
			isUpload: true,
		});

		RED.runtime.flows.setFlows({
			flows: flows,
			deploymentType: 'full',
		});

		res.status(200).json(
			{
				relinKeyNodeName: relinKeyName
			}
		)

	} catch (err) {
		console.error(err)
		res.status(400).send(err)
	}
})

app.get('/getFlows', (req, res) => {
	RED.runtime.flows.getFlows({}).then(data => {
		res.json(data);
	});
});

app.post('/addFlow', async (req, res) => {
	const flows = await RED.runtime.flows.getFlows({});

	const newConfigID = RED.util.generateId();

	flows.flows.push({
		id: newConfigID,
		type: 'context',
		name: 'seal-context2',
		polyModulus: '8192',
		coeffModulus: '{"value": [60, 40, 40, 60]}',
		scale: '40',
		sealNode: '',
		importData: '',
		isUpload: false,
	});

	flows.flows.push({
		id: RED.util.generateId(),
		type: 'publicKey',
		name: 'publicKey2',
		originContextNode: newConfigID,
		publicKeyBase64: '',
		isUpload: false,
	});

	const newFlows = await RED.runtime.flows.setFlows({
		flows: flows,
		deploymentType: 'full',
	});

	res.json(newFlows);
});

server.listen(8000, () => {
	'cipherflow_edge running on port 8000';
});

// Start the runtime
RED.start();
