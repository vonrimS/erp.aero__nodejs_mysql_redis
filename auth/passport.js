const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require('../models/user');
const client = require('../blacklist');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


passport.use(
    new StrategyJwt({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, done) => {
        console.log(jwtPayload);
        return User.findOne({ where: { email: jwtPayload.email } })
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    })
);