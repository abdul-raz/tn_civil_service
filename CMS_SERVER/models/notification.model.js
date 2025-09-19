'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Associate Notification with NotificationType
      Notification.belongsTo(models.NotificationType, {
        foreignKey: 'categoryTypeId',
        as: 'categoryType',
      });
    }
  }

  Notification.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // make nullable as per your requirement
      },
      pdfPath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'NotificationTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      timestamps: true,
    }
  );

  return Notification;
};
