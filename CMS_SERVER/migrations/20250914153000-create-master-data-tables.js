'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Create ExamTypes table
    await queryInterface.createTable('ExamTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });

    // Create Years table
    await queryInterface.createTable('Years', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });

    // Create ProcessDocumentTypes table
    await queryInterface.createTable('ProcessDocumentTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });
      
    // Create GalleryCategories table
    await queryInterface.createTable('GalleryCategories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });

    // Create NotificationTypes table
    await queryInterface.createTable('NotificationTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });

    // Create VideoCategories table (for videos)
    await queryInterface.createTable('VideoCategories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('VideoCategories');
    await queryInterface.dropTable('NotificationTypes');
    await queryInterface.dropTable('GalleryCategories');
    await queryInterface.dropTable('ProcessDocumentTypes');
    await queryInterface.dropTable('Years');
    await queryInterface.dropTable('ExamTypes');
  },
};
