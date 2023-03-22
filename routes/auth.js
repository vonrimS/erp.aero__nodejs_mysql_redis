const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');


router.post('/signin', (req, res) => {

});

router.post('/signin/new_token', (req, res) => {
    res.send('[signin/new_token] is working');
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    User.create({
        email, password
    })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: 'Error creating user' });
        });
});

router.get('/info', (req, res) => {
    res.send('[info] is working');
});

router.get('/logout', (req, res) => {
    res.send('[logout] is working');
});

module.exports = router;