const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const client = require('../blacklist');
const checkBlacklist = require('../middleware/check-blacklist');


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const alreadyExists = await User.findOne({ where: { email } }).catch(err => {
        console.log("Error: ", err);
    });

    if (alreadyExists) {
        return res.json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create access token (with expiration)
    const jwtToken = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Create refresh token
    const refreshToken = await jwt.sign(
        { email },
        process.env.REFRESH_JWT_SECRET
    );

    // newUser object with hashed password
    const newUser = await new User({
        email,
        // password
        password: hashedPassword,
        refreshToken: refreshToken
    });

    const savedUser = await newUser.save().catch(err => {
        res.json({ error: 'Cannot register user at the moment' });
    });

    if (savedUser) {
        res.json({ message: 'Thanks for registration', token: jwtToken, refreshToken: refreshToken });
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const userWithEmail = await User.findOne({ where: { email } }).catch(err => {
        console.log('Error: ', err);
    });

    // User with mentioned email was not found in db
    if (!userWithEmail) {
        return res.json({ message: 'Email or password does not match' });
    }

    // User found, have to check hashed password against password provided by user
    const passwordMatch = await bcrypt.compare(password, userWithEmail.password);

    // Password does not match
    if (!passwordMatch) {
        return res.json({ message: 'Email or password does not match' });
    }

    // Password is ok, return new jwt token
    const jwtToken = jwt.sign({
        id: userWithEmail.id,
        email: userWithEmail.email
    },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION });
    res.json({ message: 'Welcome back!', token: jwtToken });

});

// Assuming that refresh token stored securely on client side from initial signup response
router.post('/signin/new_token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token attached, sorry.' });
    }
    const userWithRefreshToken = await User.findOne({ where: { refreshToken } }).catch(err => {
        console.log('Error: ', err);
    });

    // If no user with similar refresh token in db found
    if (!userWithRefreshToken) {
        return res.json({ message: 'Wrong refresh token' });
    }

    // User found, reissuing access token
    const jwtToken = jwt.sign({
        email: userWithRefreshToken.email
    },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION });

    res.json({ message: 'Welcome back!', token: jwtToken });
});



router.get('/info', checkBlacklist, passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
        } else {
            const { email, iat, exp } = decoded;
            res.status(200).json({ email });
        }
    });
});


router.get('/logout', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
        } else {
            const { email, iat, exp } = decoded;
            // Add current token to cached blacklist with expiration not longer than token TTL
            client.set(email, token, 'PX', process.env.JWT_EXPIRATION, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({ message: 'User logged out. Current token is no longer valid' });
                }
            });
        }
    });
});

module.exports = router;