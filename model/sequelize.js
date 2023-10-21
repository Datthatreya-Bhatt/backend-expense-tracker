const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER_NAME,  process.env.SQL_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });

  module.exports = sequelize;