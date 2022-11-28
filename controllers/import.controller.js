const shareData = require("../share/shared-data");
const { COUNT_TIME_IN_MIN } = require("../config/import");
const hostname = require("os").hostname();

const { startCountDown, endCountDown } = require("../util/countDown");
const generateQRcode = require("../util/generateQRcode");
const newPassword = require("../util/generatePassword");
const getIPAddress = require("../util/getIPAddress");
const PORT = require("../config/express").PORT;

const RED = require("node-red");

const getPage = (req, res) => {
    res.render("import", {
        allowImport: shareData.allowImport,
    });
};

const allowImport = async (req, res) => {
    if (!shareData.allowImport) {
        shareData.oneTimePassword = newPassword();

        const qrcodeDataJSON = {
            hostname: hostname,
            hostIP: getIPAddress(),
            endPoint: "/api/import/addPublicKeyAndDeviceID",
            oneTimePassword: shareData.oneTimePassword,
            port: `${PORT}`,
        };

        shareData.qrcode = await generateQRcode(qrcodeDataJSON);
        shareData.allowImport = true;

        const countObj = startCountDown(COUNT_TIME_IN_MIN);
        shareData.countDownInterval = countObj.countDownInterval;
        shareData.endTime = countObj.endTime;

        res.json({
            allowImport: shareData.allowImport,
            endTime: shareData.endTime,
            qrcode: shareData.qrcode,
        });
    } else {
        res.json({
            allowImport: shareData.allowImport,
            endTime: shareData.endTime,
            qrcode: shareData.qrcode,
        });
    }
};

const denyImport = (req, res) => {
    shareData.allowImport = false;
    endCountDown(shareData.countDownInterval);
    res.json({
        allowImport: shareData.allowImport,
    });
};

const addContextAndPk = async (req, res) => {
    try {
        const { parmsBase64, publicKeyBase64 } = req.body;

        const flows = await RED.runtime.flows.getFlows({});

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const contextName = "Imported Context " + timestamp;
        const publicKeyName = "Imported PublicKey " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "context",
            name: contextName,
            polyModulus: "8192",
            coeffModulus: '{"value": [60, 40, 40, 60]}',
            scale: "40",
            sealNode: "",
            importData: parmsBase64,
            isUpload: true,
        });

        flows.flows.push({
            id: RED.util.generateId(),
            type: "publicKey",
            name: publicKeyName,
            originContextNode: "",
            importData: publicKeyBase64,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            contextNodeName: contextName,
            publicKeyNodeName: publicKeyName,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

const addContext = async (req, res) => {
    try {
        const { parmsBase64 } = req.body;
        const flows = await RED.runtime.flows.getFlows({});

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const contextName = "Imported Context " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "context",
            name: contextName,
            polyModulus: "8192",
            coeffModulus: '{"value": [60, 40, 40, 60]}',
            scale: "40",
            sealNode: "",
            importData: parmsBase64,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            contextNodeName: contextName,
        });
    } catch (err) {
        console.err(err);
        res.status(400).send(err);
    }
};

const addPublicKey = async (req, res) => {
    try {
        const { publicKeyBase64 } = req.body;
        const flows = await RED.runtime.flows.getFlows({});

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const publicKeyName = "Imported PublicKey " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "publicKey",
            name: publicKeyName,
            originContextNode: "",
            publicKeyBase64: publicKeyBase64,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            publicKeyNodeName: publicKeyName,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

const addSecretKey = async (req, res) => {
    try {
        const { secretKeyBase64 } = req.body;
        const flows = await RED.runtime.flows.getFlows({});

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const secretKeyName = "Imported SecretKey " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "secretKey",
            name: secretKeyName,
            originContextNode: "",
            importData: secretKeyBase64,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            secretKeyNodeName: secretKeyName,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

const addRelinKey = async (req, res) => {
    try {
        const { relinKeyBase64 } = req.body;
        const flows = await RED.runtime.flows.getFlows({});

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const relinKeyName = "Imported RelinKey " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "relinKey",
            name: relinKeyName,
            originContextNode: "",
            importData: relinKeyBase64,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            relinKeyNodeName: relinKeyName,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

const addPublicKeyAndDeviceID = async (req, res) => {
    try {
        const { publicKey, netpieDevice } = req.body;

        const flows = await RED.runtime.flows.getFlows({});

        flows.flows.push({
            id: RED.util.generateId(),
            type: "mqtt-broker",
            name: "fhe.netpie.io",
            broker: "mqtt.netpie.io",
            port: "1883",
            clientid: netpieDevice.client_id,
            autoConnect: true,
            usetls: false,
            protocolVersion: "4",
            keepalive: "60",
            cleansession: true,
            birthTopic: "",
            birthQos: "0",
            birthPayload: "",
            birthMsg: {},
            closeTopic: "",
            closeQos: "0",
            closePayload: "",
            closeMsg: {},
            willTopic: "",
            willQos: "0",
            willPayload: "",
            willMsg: {},
            sessionExpiry: "",
            credentials: {
                user: netpieDevice.token,
                password: netpieDevice.secret,
            },
        });

        const timestamp = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");

        const publicKeyName = "Imported PublicKey " + timestamp;

        flows.flows.push({
            id: RED.util.generateId(),
            type: "publicKey",
            name: publicKeyName,
            originContextNode: "",
            importData: publicKey,
            isUpload: true,
        });

        RED.runtime.flows.setFlows({
            flows: flows,
            deploymentType: "full",
        });

        res.status(200).json({
            publicKeyNodeName: publicKeyName,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

module.exports = {
    // getPage,
    allowImport,
    denyImport,
    addContextAndPk,
    addContext,
    addPublicKey,
    addSecretKey,
    addRelinKey,
    getPage,
    addPublicKeyAndDeviceID,
};
