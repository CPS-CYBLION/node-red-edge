const sharedData = require("../share/shared-data")

module.exports = function allowImportMiddleware(req, res, next) {
    if (sharedData.allowImport && req?.body?.oneTimePassword === sharedData.oneTimePassword) {
        next()
    } else {
        res.status(401).send('import is not allow')
    }
}