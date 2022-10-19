const bcrypt = require('bcrypt');
const readAccount = require('../util/readAccount');
const writeAccount = require('../util/writeAccount');
const { SALT_ROUNDS } = require('../config/express');
const validator = require('validator');

function validatePassword(password) {
    if (!validator.isAlphanumeric(password)) {
        return { error: true, message: "password can't only contain [a-z, A-Z, 0-9]" }
    }

    if (!validator.isLength(password, {
        min: 5, max: 20
    })) {
        return { error: true, message: "password length between 5 - 20" }
    }

    return { error: false }
}

function validateUsername(username) {
    if (!validator.isAlphanumeric(username)) {
        return { error: true, message: "username can't only contain [a-z, A-Z, 0-9]" }
    }

    if (!validator.isLength(username, {
        min: 5, max: 10
    })) {
        return { error: true, message: "username length between 5 - 10" }
    }

    return { error: false }
}

const getUsers = (req, res) => {
    const accounts = readAccount();
    accounts.forEach(account => {
        delete account.password
    })

    res.status(200).json(accounts);
}

const getPage = (req, res) => {
    const username = req.session.user.username

    res.render('users', {
        username: username
    })
}

const editPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
        res.status(400).send('all input is required');
        return
    }

    const validateResult = validatePassword(newPassword)
    if (validateResult.error) {
        res.status(400).send(validateResult.message)
        return
    }

    const accounts = readAccount();
    const account = accounts[0];

    if (!account) {
        res.status(500).send(`no account`);
        return
    }

    if (! await bcrypt.compare(oldPassword, account.password)) {
        res.status(400).send('old password didn\'t match')
        return
    }

    const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    account.password = hashPassword;
    writeAccount(accounts);

    res.status(200).json({ username: account.username, newPassword: newPassword });
}

const editUsername = (req, res) => {
    const { newUsername } = req.body
    if (!(newUsername)) {
        res.status(400).send('all input is required');
        return
    }

    const validateResult = validateUsername(newUsername);
    if (validateResult.error) {
        res.status(400).send(validateResult.message)
        return
    }

    const accounts = readAccount();

    const account = accounts[0];
    const oldUsername = account.username;

    if (!account) {
        res.status(400).send(`no account`);
        return
    }

    account.username = newUsername;
    writeAccount(accounts);
    req.session.user.username = newUsername;

    res.status(200).json({
        newUsername: account.username,
        oldUsername: oldUsername,
    });
}

module.exports = {
    editPassword, editUsername, getUsers, getPage
}