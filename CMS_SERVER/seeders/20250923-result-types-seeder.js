'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ResultTypes', [
      { name: 'Admission Breakup' },
      { name: 'Admission List' },
      { name: 'Cutoff' },
      { name: 'Rank List' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ResultTypes', null, {});
  },
};
