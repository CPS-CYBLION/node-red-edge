const authController = require('../controllers/auth.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

const apiRouter = require('express').Router()
const httpRouter = require('express').Router()

httpRouter.get('/login', authController.getPage);

apiRouter.post('/login', authController.login)
// apiRouter.post('/register', authController.register)
apiRouter.get('/logout', authMiddleware, authController.logout)

module.exports = { httpRouter, apiRouter }