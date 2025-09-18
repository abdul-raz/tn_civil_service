'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Associate Notification to NotificationType
      Notification.belongsTo(models.NotificationType, {
        foreignKey: 'categoryTypeId',
        as: 'categoryType',
      });
    }
  }
  Notification.init(
    {
      pdfPath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'NotificationTypes', // name of target table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active', // or 'inactive'
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications', // optional: table name explicitly
      timestamps: true, // optional: add createdAt & updatedAt
    }
  );
  return Notification;
};
