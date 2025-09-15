'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('VideoCategories', [
      { name: 'General Studies' },
      { name: 'Science & Tech' },
      { name: 'Polity & Governance' },
      { name: 'Economics' },
      { name: 'History & Culture' },
      { name: 'Geography' },
      { name: 'Ethics' },
      { name: 'International Relations' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('VideoCategories', null, {});
  },
};
