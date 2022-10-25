'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 2,
        startDate: '12-22-2023',
        endDate: '12-23-2023',
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '12-24-2023',
        endDate: '12-25-2023',
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '01-22-2023',
        endDate: '02-23-2023',
      },
      {
        spotId: 3,
        userId: 5,
        startDate: '12-22-2023',
        endDate: '12-23-2023',
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '12-22-2023',
        endDate: '12-23-2023',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
