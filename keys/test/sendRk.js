const axios = require('axios').default;
const url = 'http://localhost:8000/import/relinKey'
const fs = require('fs')
const path = require('path')

const relinKeyBase64 = fs.readFileSync(path.join(__dirname, '..', 'rk.txt'), 'ascii');

axios.post(url, {
    relinKeyBase64: relinKeyBase64,
}).then(res => (
    console.log(res.data)
))