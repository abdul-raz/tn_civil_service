'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProcessDocumentType = sequelize.define('ProcessDocumentType', {
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
    tableName: 'ProcessDocumentTypes',
    timestamps: false,
  });

  return ProcessDocumentType;
};
