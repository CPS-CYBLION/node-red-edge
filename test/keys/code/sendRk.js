const axios = require('axios').default;
const url = 'http://localhost:8000/import/relinKey'
const fs = require('fs')
const path = require('path')

const relinKeyBase64 = fs.readFileSync(path.join(__dirname, '..', 'rk.txt'), 'ascii');

axios.post(url, {
    relinKeyBase64: relinKeyBase64,
    oneTimePassword: 'uu2fq3gMYtb172gg0y8NYAzbGvurCpcf0j4nmtr1uZzz96gnEO'
}).then(res => (
    console.log(res.data)
))