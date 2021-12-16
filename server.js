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
        { expiresIn: 30 }
    );

    res.status(201).send ({ userName, token });
});

App.post('/api/welcome', auth, (req, res) => {
    return res.status(200).send('Welcome 🙌');
});