const axios = require('axios').default;
const url = 'http://localhost:8000/import'
const fs = require('fs')
const path = require('path')

const parmsBase64 = fs.readFileSync(path.join(__dirname, '..', 'parms.txt'), 'ascii');
const publicKeyBase64 = fs.readFileSync(path.join(__dirname, '..', 'pk.txt'), 'ascii');

axios.post(url, {
    parmsBase64: parmsBase64,
    publicKeyBase64, publicKeyBase64
}).then(res => (
    console.log(res.data)
))