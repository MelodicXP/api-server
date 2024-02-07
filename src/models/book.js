'use strict';

// Define name of table 'books' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.ENUM,
      values: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Historical', 'Other'],
      allowNull: false,
    },
    publishYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add author ID here ( see screenshot ) tie together?
  });
};
