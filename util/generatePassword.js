const randomstring = require('randomstring');

module.exports = function newPassword() {
    const password = randomstring.generate(50);
    return password
}