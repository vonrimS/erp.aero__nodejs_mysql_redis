const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require('../models/user');
const client = require('../blacklist');
const jwt = require('jsonwebtoken');


// passport.use(new StrategyJwt(jwtOptions, (jwtPayload, done) => {
//     redisClient.get(jwtPayload.jti, (err, reply) => {
//       if (err) return done(err);

//       if (reply) {
//         return done(null, false, { message: 'Token revoked' });
//       } else {
//         return done(null, jwtPayload.sub);
//       }
//     });
//   }));




passport.use(
    new StrategyJwt({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, done) => {
        return User.findOne({ where: { id: jwtPayload.id } })
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    })
);