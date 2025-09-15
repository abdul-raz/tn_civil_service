'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ExamTypes', [
      { name: 'AICSCC' },
      { name: 'UPSC' },
      { name: 'Test Series' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ExamTypes', null, {});
  },
};
