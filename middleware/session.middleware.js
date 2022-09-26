const { SESSION_KEY } = require('../config/express')
const session = require('express-session');

module.exports = session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // change when use TLS
})