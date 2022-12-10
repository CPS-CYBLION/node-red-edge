require("dotenv").config;
const path = require("path");

module.exports = {
    httpAdminRoot: process.env.RED_ADMIN_ROOT || "/red",
    httpNodeRoot: process.env.RED_NODE_ROOT || "/red-api",
    userDir:
        process.env.RED_USER_DIR || path.join(__dirname, "../", "./.node-red"),
    uiPort: process.env.PORT || 1880,

    flowFile: "flows.json",
    flowFirePretty: true,
    apiMaxLength: "100mb",
    diagnostics: {
        enabled: true,
        ui: true,
    },
    runtimeState: {
        enabled: false,
        ui: false,
    },
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false,
        },
    },
    editorTheme: {
        projects: {
            enabled: false,
            workflow: {
                mode: "manual",
            },
        },
        codeEditor: {
            lib: "monaco",
        },
    },
    functionExternalModules: true,
    debugMaxLength: 1000,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,

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
};
