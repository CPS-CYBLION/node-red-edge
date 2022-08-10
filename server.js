const http = require('http');
const express = require('express');
const RED = require('node-red');
const axios = require('axios').default;

// Create an Express app
const app = express();

// Add a simple route for static content served from 'public'
app.use('/', express.static('public'));

// Create a server
const server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
const settings = {
	httpAdminRoot: '/red',
	httpNodeRoot: '/api',
	userDir: './.nodered/',
	functionGlobalContext: {}, // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

app.get('/getFlows', (req, res) => {
	RED.runtime.flows.getFlows({}).then(data => {
		res.json(data);
	});
});

app.get('/addFlow', async (req, res) => {
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

	// res.json(flows);

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
