'use strict';

// Define name of table 'authors' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.ENUM,
      values: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Other'],
      allowNull: false,
    },
    numBooksPublished: {
      type: DataTypes.INTEGER,
      allowNull: true, // This could be null indicating unknown or unpublished authors
    },
  });
};
