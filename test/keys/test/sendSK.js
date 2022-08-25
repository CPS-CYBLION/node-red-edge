const axios = require('axios').default;
const url = 'http://localhost:8000/import/secretKey'
const fs = require('fs')
const path = require('path')

const secretKeyBase64 = fs.readFileSync(path.join(__dirname, '..', 'sk.txt'), 'ascii');

axios.post(url, {
    secretKeyBase64: secretKeyBase64
}).then(res => (
    console.log(res.data)
))