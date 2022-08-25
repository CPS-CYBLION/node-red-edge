const importController = require('../controllers/importController.js');
const allowImportMiddle = require('../middleware/allowImportMiddleware.js');
const router = require('express').Router()

router.get('/', importController.getPage);
router.get('/allow', importController.allowImport);
router.get('/deny', importController.denyImport);
router.post('/contextAndPublicKey', allowImportMiddle, importController.addContextAndPk);
router.post('/context', allowImportMiddle, importController.addContext);
router.post('/publicKey', allowImportMiddle, importController.addPublicKey);
router.post('/secretKey', allowImportMiddle, importController.addSecretKey);
router.post('/relinKey', allowImportMiddle, importController.addRelinKey);

module.exports = router