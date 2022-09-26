const authMiddleware = require('../middleware/auth.middleware');
const homeController = require('../controllers/home.controller');

const httpRouter = require('express').Router();

httpRouter.get('/', authMiddleware, homeController.getPage);