const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const auth = require('./auth');
const db = require('./database');

const App = express();

App.use(express.json());

App.listen(1000, () => console.log('Server Started at 1000'));

App.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;

    if(!userName || !password) return res.status(400).send('Invalid Inputs');

    if(!db || !db.users || !db.users.length) return res.status(500).send('ERROR');

    const user = db.users.find(user => user.userName === userName);

    if(!user) return res.status(200).send('Unegistered');

    const userValid = await bcrypt.compare(password, user.password);

    if(!userValid) res.status(400).send('Invalid');
    
    const token = jwt.sign(
        { userName },
        'DNRJDed44Dcc*ff',
        { expiresIn: '2h' }
    );

    res.status(201).send ({ userName, token });
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
    return res.status(200).send('Welcome 🙌');
});

App.get('/api/users', (req, res) => {
    return res.status(200).send(db.getAllUsers());
});

App.get('/api/users/:username', (req, res) => {
    const users = db.getAllUsers() ?? [];
    return res.status(200).send(users.filter(user => user.userName === req.params.username));
});