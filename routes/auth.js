const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const userWithEmail = await User.findOne({ where: { email } }).catch(err => {
        console.log('Error: ', err);
    });

    if (!userWithEmail || userWithEmail.password !== password) {
        return res.json({ message: 'Email or password does not match' });
    }

    const jwtToken = jwt.sign({
        id: userWithEmail.id,
        email: userWithEmail.email
    },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION });
    res.json({ message: 'Welcome back!', token: jwtToken });
});


router.post('/signin/new_token', (req, res) => {
    res.send('[signin/new_token] is working');
});


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const alreadyExists = await User.findOne({ where: { email } }).catch(err => {
        console.log("Error: ", err);

    });

    if (alreadyExists) {
        return res.json({ message: 'User with this email already exists' });
    }

    const newUser = new User({ email, password });

    const savedUser = await newUser.save().catch(err => {
        res.json({ error: 'Cannot register user at the moment' });
    });

    if (savedUser) {
        res.json({ message: 'Thanks for registration' });
    } else {
        res.json({ error: 'Cannot register user at the moment' });
    }
});

router.get('/info', (req, res) => {
    res.send({ blacklist: blacklist });
    // res.send('[info] is working');
});

router.get('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);


    res.send({message: 'logged out'})

});

module.exports = router;