const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./database');

const express = require('express');

const App = express();

App.use(express.json());

App.listen(1000, () => console.log('Server Started at 1000'));

// App.get('/api/users', (req, res) => {
//     console.log('In API');
//     return res.status(200).send(db.users);
// });

App.post('/api/register', async (req, res) => {
    const { userName, password } = req.body;

    if(!userName || !password) return res.status(400).send('Invalid Inputs');

    if(!db || !db.users || !db.users.length) return res.status(500).send('ERROR');

    if(db.users.some(user => user.userName === userName)) return res.status(200).send('Already Registered');

    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log(encryptedPassword);

    const token = jwt.sign(
        { userName },
        'DNRJDed44Dcc*ff',
        { expiresIn: "2h" }
    );
  
    res.status(201).json({ userName, token });
});

App.post('/login', (req, res) => {
    
});

