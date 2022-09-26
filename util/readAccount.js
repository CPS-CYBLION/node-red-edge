const fs = require('fs');
const path = require('path');

module.exports = () => {
    const data = fs.readFileSync(path.join(path.dirname(__dirname), '/share/accounts.json'), "utf8")
    const json = JSON.parse(data);
    return json
}