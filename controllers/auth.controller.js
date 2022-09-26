const bcrypt = require('bcrypt');
const readAccount = require('../util/readAccount');

const getPage = (req, res) => {
    res.render('login')
}

const login = async (req, res) => {
    const accounts = readAccount();

    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send('All input is required');
            return;
        }



        const user = accounts.find((account => {
            return account.username === username
        }))

        if (typeof user === undefined) {
            res.status(401).send('Invalid Credentials');
            return
        }

        if (user && (await bcrypt.compare(password, user.password))) {

            console.log('wtf');

            req.session.user = { username: user.username }

            res.redirect(302, '/');
            return
        }

        res.status(401).send('Invalid Credentials');
    } catch (err) {
        console.error(err);
        res.status(400).send('Login Fail');
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.redirect
        } else {
            console.error(err)
            res.statue(500).send('Logout Fail');
        }
    })
}

// below is auth controller with jwt 
// const register = async (req, res) => {
//     const accounts = readAccount();

//     try {
//         const { username, password } = req.body;
//         if (!(username && password)) {
//             res.status(400).send('All input is required');
//             return
//         };

//         const oldUser = accounts.users.username
//         if (typeof oldUser === undefined) {
//             res.status(409).send('User Already Exist. Please Login');
//             return
//         };

//         const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
//         const newUser = { username: username, password: hashPassword }
//         accounts.push(newUser)
//         writeAccount(accounts);

//         const token = jwt.sign({ username }, TOKEN_KEY, {
//             expiresIn: '2h',
//         });

//         newUser.token = token
//         res.status(201).json(newUser);
//     } catch (err) {
//         console.error(err);
//         res.status(400).send('Register New Account Fail');
//     }
// };


// const login = async (req, res) => {
//     const accounts = readAccount();

//     try {
//         const { username, password } = req.body;
//         if (!(username && password)) {
//             res.status(400).send('All input is required');
//             return;
//         }



//         const user = accounts.find((account => {
//             return account.username === username
//         }))

//         if (typeof user === undefined) {
//             res.status(401).send('Invalid Credentials');
//             return
//         }

//         if (user && (await bcrypt.compare(password, user.password))) {
//             const token = jwt.sign({ username }, TOKEN_KEY, {
//                 expiresIn: '2h',
//             });

//             res.status(200).json({
//                 username: user.username,
//                 token: token
//             });
//             return
//         }

//         res.status(401).send('Invalid Credentials');
//     } catch (err) {
//         console.error(err);
//         res.status(400).send('Login Fail');
//     }
// };

// const logout = async (req, res) => {
//     res.status(200).json({ status: 'ok' })
// }

module.exports = { login, logout, getPage }