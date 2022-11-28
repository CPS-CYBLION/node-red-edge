const sharedData = require("../share/shared-data");

module.exports = function allowImportMiddleware(req, res, next) {
    console.log(req.body);
    console.log(sharedData);
    console.log(sharedData.allowImport);
    console.log(sharedData.oneTimePassword);
    console.log(req?.body?.oneTimePassword);
    console.log(req.body.netpieDevice);
    if (
        sharedData.allowImport &&
        req?.body?.oneTimePassword === sharedData.oneTimePassword
    ) {
        next();
    } else {
        res.status(401).send("import is not allow");
    }
};
