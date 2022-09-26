require('dotenv').config

module.exports = {
    httpAdminRoot: process.env.RED_ADMIN_ROOT || '/red',
    httpNodeRoot: process.env.RED_NODE_ROOT || '/red-api',
    userDir: process.env.RED_USER_DIR || './.nodered/',

    // redSetting.adminAuth = {
    //     type: "credentials",
    //     tokens: function (token) {
    //         return new Promise(function (resolve, reject) {
    //             try {
    //                 const decoded = jwt.verify(token, TOKEN_KEY);
    //                 const user = { username: decoded.username, token: token, permissions: '*' };
    //                 resolve(user)

    //             } catch (err) {
    //                 resolve(null);
    //             }
    //         });
    //     },
    // }
}