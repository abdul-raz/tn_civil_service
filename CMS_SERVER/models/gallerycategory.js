'use strict';

module.exports = (sequelize, DataTypes) => {
  const GalleryCategory = sequelize.define('GalleryCategory', {
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
    tableName: 'GalleryCategories',
    timestamps: false,
  });

  return GalleryCategory;
};
