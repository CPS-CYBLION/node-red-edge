const qrcode = require('qrcode');

module.exports = async function generateQRcode(JSONData) {
    const qrcodeData = JSON.stringify(JSONData);
    const qrcodePic = await qrcode.toDataURL(qrcodeData)
    return qrcodePic;
}