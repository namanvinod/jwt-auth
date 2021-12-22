const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config({ path: `${__dirname}\\env\\app${process.env.NODE_ENV ?`.${process.env.NODE_ENV.trim()}`: ''}.env` }); 

const auth = require('./auth');
const db = require('./database');

const App = express();

App.use(express.json());

App.listen(process.env.PORT, () => console.log(`Server Started at ${process.env.PORT}, in ${process.env.NODE_ENV} environment`));

App.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;

    if(!userName || !password) return res.status(400).send('Invalid Inputs');

    if(!db) {
        console.log('No DB Found');
        return res.status(500).send('ERROR');
    }

    const users = getAllUsers();

    if(!users || !users.length) {
        console.log('No Users Found');
        return res.status(500).send('ERROR');
    }

    const user = users.find(user => user.userName === userName);
    if(!user) return res.status(200).send('Unregistered User');

    const userValid = await bcrypt.compare(password, user.password);

    if(!userValid) res.status(400).send('Invalid User Credentials');
    
    const token = jwt.sign(
        { userName },
        'DNRJDed44Dcc*ff',
        { expiresIn: '2h' }
    );

    res.status(200).send ({ userName, token });
});

App.post('/api/register', async (req, res) => {
    const { userName, password } = req.body;

    if(!userName || !password) return res.status(400).send('Invalid Inputs');

    if(!db || !db.users || !db.users.length) return res.status(500).send('ERROR');

    const user = db.users.find(user => user.userName === userName);

    if(user) return res.status(200).send('Already Registered');

    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log(encryptedPassword);

    db.addUsers([{ userName, password: encryptedPassword, isActive: true }]);

    const token = jwt.sign(
        { userName },
        'DNRJDed44Dcc*ff',
        { expiresIn: "2h" }
    );

    res.status(201).json({ userName, token });
});

App.post('/api/welcome', auth, (req, res) => {
    return res.status(200).send('Welcome!');
});

App.get('/api/users', (req, res) => {
    return res.status(200).send(db.getAllUsers());
});

App.get('/api/users/:username', (req, res) => {
    const users = getAllUsers();
    return res.status(200).send(users.filter(user => user.userName === req.params.username));
});

const getAllUsers = () => db.getAllUsers() ?? [];