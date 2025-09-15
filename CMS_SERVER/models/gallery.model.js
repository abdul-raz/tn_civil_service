'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: { // or videoUrl if applicable
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'GalleryCategories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',  // or 'CASCADE', depending on your logic
    },
  }, {
    tableName: 'Galleries', // or GalleryItems etc.
    timestamps: true,
  });

  Gallery.associate = function(models) {
    Gallery.belongsTo(models.GalleryCategory, {
      foreignKey: 'categoryId',
      as: 'category',
    });
  };

  return Gallery;
};
