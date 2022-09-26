const fs = require('fs');
const path = require('path');

module.exports = (accounts) => {
    const jsonString = JSON.stringify(accounts)
    fs.writeFileSync(path.join(path.dirname(__dirname), '/share/accounts.json'), jsonString)
    return
}