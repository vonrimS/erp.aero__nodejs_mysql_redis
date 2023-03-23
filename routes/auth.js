const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const client = require('../blacklist');
const checkBlacklist = require('../middleware/check-blacklist')


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
    const authHeader = req.headers.authorization;
    console.log(authHeader, '++++');
    // res.send({ blacklist: blacklist });
    res.send('[info] is working');
});

router.get('/logout', (req, res) => {
    // Clear all data from cache
    client.flushall();
    // Get current token from input request headers
    const token = req.headers.authorization.split(' ')[1];
    // Add current token to cached blacklist with expiration not longer than token TTL
    client.set('token', token, 'PX', process.env.JWT_EXPIRATION, (err, result) => {
        if (err){
            console.log(err);
        } else {
            res.send({message: 'User logged out. Current token is no longer valid'})
        }
    });
});

module.exports = router;