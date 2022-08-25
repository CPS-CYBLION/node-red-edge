const express = require('express');
const http = require('http');
const RED = require('node-red');
const path = require('path');

const PORT = require('./config/express-config').PORT;
const redSetting = require('./config/red-config');

const importRouter = require('./routes/importRouter.js')

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }))

// node red
RED.init(server, redSetting);
app.use(redSetting.httpAdminRoot, RED.httpAdmin);
app.use(redSetting.httpNodeRoot, RED.httpNode);

// import router
app.use('/import', importRouter)

server.listen(PORT, () => {
    console.log('cipherflow running on port', PORT)
})

// Start the runtime
RED.start();
