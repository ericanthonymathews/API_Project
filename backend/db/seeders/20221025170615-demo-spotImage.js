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
    return queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://picsum.photos/id/237/200/300',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://picsum.photos/id/238/200/300',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://picsum.photos/id/239/200/300',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://picsum.photos/id/240/200/300',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://picsum.photos/id/241/200/300',
        preview: true
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
    return queryInterface.bulkDelete('SpotImages', {
      url: { [Op.in]: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/238/200/300', 'https://picsum.photos/id/239/200/300', 'https://picsum.photos/id/240/200/300', 'https://picsum.photos/id/241/200/300'] }
    }, {});
  }
};
