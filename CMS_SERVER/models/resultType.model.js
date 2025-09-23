'use strict';

module.exports = (sequelize, DataTypes) => {
  const ResultType = sequelize.define('ResultType', {
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
    tableName: 'ResultTypes',
    timestamps: false,
  });

  return ResultType;
};
