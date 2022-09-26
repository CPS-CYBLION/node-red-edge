const bcrypt = require('bcrypt');
const readAccount = require('../util/readAccount');
const writeAccount = require('../util/writeAccount');
const { SALT_ROUNDS } = require('../config/express');

const getPage = (req, res) => {
    res.render('users', {

    })
}

const getUsers = (req, res) => {
    const accounts = readAccount();
    accounts.forEach(account => {
        delete account.password
    })

    res.status(200).json(accounts);
}

const newUser = async (req, res) => {
    const { username, password } = req.body
    if (!(username && password)) {
        res.status(400).send('all input is required');
        return
    }

    // if (req.userData.username !== 'admin') {
    //     res.status(400).send("only admin can create new account");
    //     return
    // }

    const accounts = readAccount();

    const account = accounts.find((account => {
        return account.username === username
    }))

    if (account) {
        res.status(400).send(`already have account name ${username}`);
        return
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newAccount = { username: username, password: hashPassword }
    accounts.push(newAccount);

    writeAccount(accounts);

    res.status(201).json({
        username: username,
        password: password,
        users: accounts
    });
}

const editPassword = async (req, res) => {
    const { editUsername, newPassword } = req.body
    if (!(editUsername && newPassword)) {
        res.status(400).send('all input is required');
        return
    }

    // if (req.userData.username !== editUsername && req.userData.username !== 'admin') {
    //     res.status(400).send("can't edit another account username");
    //     return
    // }



    const accounts = readAccount();
    const account = accounts.find((account => {
        return account.username === editUsername
    }))
    if (!account) {
        res.status(400).send(`no account name ${editUsername}`);
        return
    }

    const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    account.password = hashPassword;
    writeAccount(accounts);

    res.status(200).json({ editUsername: editUsername, newPassword: newPassword });
}

const editUsername = (req, res) => {
    const { editUsername, newUsername } = req.body
    if (!(editUsername && newUsername)) {
        res.status(400).send('all input is required');
        return
    }

    // if (req.userData.username !== editUsername && req.userData.username !== 'admin') {
    //     res.status(400).send("can't edit another account username");
    //     return
    // }

    const accounts = readAccount();

    const account = accounts.find((account => {
        return account.username === editUsername
    }))

    if (!account) {
        res.status(400).send(`no account name ${editUsername}`);
        return
    }

    account.username = newUsername;
    writeAccount(accounts);
    req.session.user.username = newUsername;

    res.status(200).json({
        newUsername: account.username,
        oldUsername: editUsername,
    });
}

module.exports = {
    editPassword, editUsername, newUser, getUsers, getPage
}