const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');

const httpRouter = require('express').Router()
const apiRouter = require('express').Router()

httpRouter.get('/', authMiddleware, userController.getPage)

apiRouter.get('/', authMiddleware, userController.getUsers)
// apiRouter.post('/', authMiddleware, userController.newUser)
apiRouter.post('/username', authMiddleware, userController.editUsername)
apiRouter.post('/password', authMiddleware, userController.editPassword)

module.exports = { apiRouter, httpRouter }