const { SESSION_KEY } = require('../config/express')
const session = require('express-session');
const FileStore = require('session-file-store')(session);

module.exports = session({
    store: new FileStore({
        path: './.sessions',
        retries: 3,
    }),
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // change when use TLS
})