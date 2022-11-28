const importController = require("../controllers/import.controller.js");
const authMiddleware = require("../middleware/auth.middleware");
const allowImportMiddle = require("../middleware/allowImport.middleware.js");
const apiRouter = require("express").Router();
const httpRouter = require("express").Router();

httpRouter.get("/", authMiddleware, importController.getPage);

apiRouter.get("/allow", authMiddleware, importController.allowImport);
apiRouter.get("/deny", authMiddleware, importController.denyImport);
apiRouter.post(
    "/contextAndPublicKey",
    allowImportMiddle,
    importController.addContextAndPk
);

apiRouter.get("/test", (res, req) => {
    req.send("fuck you");
});

apiRouter.post("/context", allowImportMiddle, importController.addContext);
apiRouter.post("/publicKey", allowImportMiddle, importController.addPublicKey);
apiRouter.post("/secretKey", allowImportMiddle, importController.addSecretKey);
apiRouter.post("/relinKey", allowImportMiddle, importController.addRelinKey);
apiRouter.post(
    "/addPublicKeyAndDeviceID",
    allowImportMiddle,
    importController.addPublicKeyAndDeviceID
);

module.exports = { httpRouter, apiRouter };
