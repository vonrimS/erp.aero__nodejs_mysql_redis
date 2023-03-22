const express = require('express');
const mysql = require('mysql2');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

//routes
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');

const app = express();
const port = 3000;

// CORS allowed for any domain
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const Response = require('./domain/response');

// db connection via Sequelize ORM
const sequelize = new Sequelize(
    'erp.aero.db',
    'user',
    'password', {
    dialect: 'mysql',
    dialectOptions: {
        port: 3307,
        host: 'localhost',
    }
});

// db authentication
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const blog_table = sequelize.define(
    'blog_table',
    {
        title: Sequelize.STRING,
        desc: Sequelize.TEXT
    },
    { tableName: 'blog_table' }
);

blog_table.sync({ force: 'true' });


// const con = mysql.createConnection({
//     host: 'localhost',
//     database: 'erp.aero.db',
//     port: '3307',
//     user: 'user',
//     password: 'password'
//     // user: 'user',
//     // password: 'password'
// });



// con.query(`select * from users` , (error, res, fields) => {
//     console.log(error);
//     console.log(res);
//     console.log(fields);
// });

// con.connect((err) => {
//     if (err) throw err;
//     console.log('db connected');
//     // var sql = "CREATE TABLE users (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
//     // con.query(sql, (err, res) => {
//     //     if (err) throw err;
//     //     console.log('table created');
//     // })
// });


// // mysql connection string
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '210487k@T2021',
//     database: ''
// });



app.get('/test', (req, res) => {
    res.send(new Response(200, 'OK', 'User test api'));
});

// routes
app.use('/', authRouter);
app.use('/file', fileRouter);

app.listen(port, () => {
    console.log(`Service API was started on port: ${port}`);
});