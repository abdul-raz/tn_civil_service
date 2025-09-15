'use strict';

module.exports = (sequelize, DataTypes) => {
  const ExamType = sequelize.define('ExamType', {
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
    tableName: 'ExamTypes',
    timestamps: false,
  });

  return ExamType;
};
