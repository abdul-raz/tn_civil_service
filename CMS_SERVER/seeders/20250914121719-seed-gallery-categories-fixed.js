'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('GalleryCategories', [
      { name: 'Category 1' },
      { name: 'Category 2' },
      { name: 'Category 3' },
      { name: 'Category 4' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('GalleryCategories', null, {});
  },
};
