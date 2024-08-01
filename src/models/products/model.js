'use strict';

// Define name of table 'Products' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('Products', {
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    category: {
      type: DataTypes.STRING,
      required: true,
    },
    description: {
      type: DataTypes.STRING,
      required: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      required: true,
    },
    inventory: {
      type: DataTypes.INTEGER,
      required: true,
    },
  });
};