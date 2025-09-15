'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('NotificationTypes', [
      { name: 'Admission Information' },
      { name: 'Scholarship Information' },
      { name: 'Tenders' },
      { name: 'Others' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NotificationTypes', null, {});
  },
};
