require('dotenv').config();
const Sequelize = require('sequelize');

// db connection via Sequelize ORM
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;



