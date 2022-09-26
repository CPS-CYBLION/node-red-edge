const express = require('express');
const http = require('http');
const RED = require('node-red');
const path = require('path');
const PORT = require('./config/express').PORT;
const redSetting = require('./config/red');

const sessionMiddleware = require('./middleware/session.middleware');
const authMiddleware = require('./middleware/auth.middleware');

const importRouter = require('./routes/import.route.js');
const authRouter = require('./routes/auth.route.js');
const userRouter = require('./routes/user.route.js');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }))


RED.init(server, redSetting);
app.use(redSetting.httpAdminRoot, authMiddleware, RED.httpAdmin);
app.use(redSetting.httpNodeRoot, authMiddleware, RED.httpNode);


app.get('/', (req, res) => {
    res.render('index')
})

// api
app.use('/api/auth', authRouter.apiRouter)
app.use('/api/users', userRouter.apiRouter)
app.use('/api/import', importRouter.apiRouter)

// http
app.use('/auth', authRouter.httpRouter)
app.use('/import', importRouter.httpRouter)
app.use('/users', userRouter.httpRouter)

server.listen(PORT, () => {
    console.log('cipherflow running on port', PORT)
})

// Start the runtime
RED.start();
