'use strict';

// Define name of table 'authors' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numBooksPublished: {
      type: DataTypes.INTEGER,
      allowNull: true, // This could be null indicating unknown or unpublished authors
    },
    
  });
};
