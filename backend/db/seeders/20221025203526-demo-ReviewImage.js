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
    return queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,
        url: 'https://picsum.photos/id/242/200/300'
      },
      {
        reviewId: 2,
        url: 'https://picsum.photos/id/243/200/300'
      },
      {
        reviewId: 2,
        url: 'https://picsum.photos/id/244/200/300'
      },
      {
        reviewId: 3,
        url: 'https://picsum.photos/id/245/200/300'
      },
      {
        reviewId: 4,
        url: 'https://picsum.photos/id/246/200/300'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('ReviewImages', {
      url: { [Op.in]: ['https://picsum.photos/id/242/200/300', 'https://picsum.photos/id/243/200/300', 'https://picsum.photos/id/244/200/300', 'https://picsum.photos/id/245/200/300', 'https://picsum.photos/id/246/200/300'] }
    }, {});
  }
};
