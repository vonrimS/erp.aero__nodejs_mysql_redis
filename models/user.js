const Sequelize = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;

// const user_table = sequelize.define(
//   'user_table',
//   {
//       title: DataTypes.STRING,
//       desc: DataTypes.TEXT
//   },
//   { tableName: 'user_table' }
// );

// User.sync({ force: 'true' });


// return User;






// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   const User = sequelize.define('User', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   });

//   return User;
// };

