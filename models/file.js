const DataTypes = require('sequelize');
const sequelize = require('../config');


const File = sequelize.define('file', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateUploaded: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fileContent: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
});

module.exports = File;
