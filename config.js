// const mysql = require('mysql2');
const Sequelize = require('sequelize');

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

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


module.exports = sequelize;

// const pool = mysql.createPool({
//     host: 'localhost',
//     port: 3307,
//     user: 'user',
//     password: 'password',
//     database: 'erp.aero.db',
//     connectionLimit: 20
// })

// export default pool;

