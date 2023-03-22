const express = require('express');
const router = express.Router();

const User = require('../models/user');

// TODO:


router.post('/signin', (req, res)=> {
    res.send('[signin] is working');
})

router.post('/signin/new_token', (req, res)=> {
    res.send('[signin/new_token] is working');
})

router.post('/signup', (req, res)=> {
    res.send('[signup] is working');
})

router.get('/info', (req, res)=> {
    res.send('[info] is working');
})

router.get('/logout', (req, res)=> {
    res.send('[logout] is working');
})

module.exports = router;