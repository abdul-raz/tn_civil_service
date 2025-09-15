'use strict';

module.exports = (sequelize, DataTypes) => {
  const Year = sequelize.define('Year', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Years',
    timestamps: false,
  });

  return Year;
};
