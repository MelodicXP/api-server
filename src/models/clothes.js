'use strict';

// Define name of table 'clothes' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('clothes', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM,
      values: ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true, // allowNull true, brand is optional
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true, // allowNull true, material is optional
    },
  });
};