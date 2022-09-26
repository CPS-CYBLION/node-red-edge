const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config/express.js');


module.exports = function auth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


// below is auth with jwt token
// module.exports = function auth(req, res, next) {
//     let token = req.body.token || req.query.token || req.headers['x-access-token'];

//     if (req.headers['authorization']) {
//         const bearer = req.headers['authorization'].split(' ');
//         token = bearer[1];
//     }

//     if (!token) {
//         return res.status(403).send('A token is required for authentication');
//     }
//     try {
//         const decoded = jwt.verify(token, TOKEN_KEY);
//         req.userData = decoded;
//         req.userData.token = token;
//     } catch (err) {
//         return res.status(401).send('Invalid Token');
//     }
//     return next();
// }
