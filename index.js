const express = require('express');
const mysql = require('mysql2');


// mysql connection string
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '210487k@T2021',
    database: ''
})


const app = express();

app.get('/test', (req, res) => {
    res.send('Our API is working');
});

// CORS allowed for any domain
app.use((req, res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    next();
})

// TODO: use routes

app.listen(3000, () => {
    console.log('Service api was started');
});