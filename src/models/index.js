'use strict';

require('dotenv').config();

// Import library of sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Import model definitions
const food = require('./food');
const clothes = require('./clothes');

// Use database url from .env, if running test (dev) use use sqlite, else use port normally
// If sqlite::memory does not work, use sqlite:memory
const DATABASE_URL = process.env.DATABASE_URL === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Create database single instance of Sequelize
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialect: 'postgres', // e.g., 'postgres', 'mysql', 'sqlite'
});

// Create models (based on food.js and clothes.js shcema)
// Takes in two parameters like shemas (sequelizeDatabase, DataTypes)
const foodModel = food(sequelizeDatabase, DataTypes);
const clothesModel = clothes(sequelizeDatabase, DataTypes);

// Export sequelizeDatabase instance and foodModel to be used elsewhere
module.exports = {
  sequelizeDatabase,
  foodModel,
  clothesModel,
};