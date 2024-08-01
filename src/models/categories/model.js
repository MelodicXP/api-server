'use strict';

// Define name of table 'Categories' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('Categories', {
    name: {
      type: DataTypes.STRING,
      required: true,
    },
  });
};