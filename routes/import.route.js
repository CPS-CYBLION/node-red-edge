const importController = require('../controllers/import.controller.js');
const allowImportMiddle = require('../middleware/allowImport.middleware.js');
const apiRouter = require('express').Router()
const httpRouter = require('express').Router()

httpRouter.get('/', importController.getPage)

apiRouter.get('/allow', importController.allowImport);
apiRouter.get('/deny', importController.denyImport);
apiRouter.post('/contextAndPublicKey', allowImportMiddle, importController.addContextAndPk);
apiRouter.post('/context', allowImportMiddle, importController.addContext);
apiRouter.post('/publicKey', allowImportMiddle, importController.addPublicKey);
apiRouter.post('/secretKey', allowImportMiddle, importController.addSecretKey);
apiRouter.post('/relinKey', allowImportMiddle, importController.addRelinKey);

module.exports = { httpRouter, apiRouter }