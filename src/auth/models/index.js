'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./users.js');

const POSTGRES_URI =
  process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(POSTGRES_URI);

// Hooks
// sequelize allows us to interact with the user model before adding data to the database using the beforeCreate hook. 


module.exports = {
  db: sequelizeDatabase,
  users: userSchema(sequelizeDatabase, DataTypes),
};