'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Years', [
      { name: '2023-2024' },
      { name: '2022-2023' },
      { name: '2021-2022' },
      { name: '2020-2021' },
      { name: '2019-2020' },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Years', null, {});
  },
};
