'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ProcessDocumentTypes', [
      { name: 'Admission List' },
      { name: 'Rank List' },
      { name: 'Cutoff' },
      { name: 'Admission Breakup' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ProcessDocumentTypes', null, {});
  },
};
