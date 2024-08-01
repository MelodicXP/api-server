'use strict';

require('dotenv').config();

// Import library of sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Import model definitions, to use functions that create the models
const Author = require('./author');
const Book = require('./book');
const categoriesModel = require('./categories/model');
const productsModel = require('./products/model');
const Collection = require('./collection');

// Use database url from .env, if running test (dev) use use sqlite, else use port normally
// If sqlite::memory does not work, use sqlite:memory
const DATABASE_URL = process.env.DATABASE_URL === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Initialize single instance of Sequelize with database configuration
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // remove this bottom portion to work locally, line 22 - 27
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You might need this line if you're using a self-signed certificate
    },
  },
});

// Initialize models (based on author and book shcema, calls functions to make the models)
// Takes in two parameters like shcemas (sequelizeDatabase, DataTypes)
const authorModel = Author(sequelizeDatabase, DataTypes);
const bookModel = Book(sequelizeDatabase, DataTypes);
const categories = categoriesModel(sequelizeDatabase, DataTypes);
const products = productsModel(sequelizeDatabase, DataTypes);

// Make associations
authorModel.hasMany(bookModel, {
  foreignKey: 'authorId',
  sourceKey: 'id',
});
bookModel.belongsTo(authorModel, {
  foreignKey: 'authorId',
  targetKey: 'id',
});

// Create a new COLLECTION class for each model
const authorCollection = new Collection(authorModel);
const bookCollection = new Collection(bookModel);
const categoryCollection = new Collection(categories);
const productsCollection = new Collection(products);

// Export sequelizeDatabase instance and models wrapped in Collection instances
module.exports = {
  sequelizeDatabase,
  authorCollection,
  bookCollection,
  categoryCollection,
  productsCollection,
};