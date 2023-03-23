require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const sequelize = require('./config');

//routes
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');
const passport = require('passport');

// const client = require('./auth/blacklist');
const checkBlacklist = require('./middleware/check-blacklist')

require('./auth/passport');

const app = express();
const port = process.env.PORT;

// CORS allowed actions
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'some vulnerable info ....)))))' });
});
// app.get('/test', checkBlacklist, passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({ message: 'some vulnerable info ....)))))' });
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', authRouter);
app.use('/file', fileRouter);


sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Service API was started on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log('Unable to sync database: ', err);
    });
