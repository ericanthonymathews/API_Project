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
    return queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 3,
        review: 'Loved the place. Had a cozy atmosphere.',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'LIKED the place. Looking for something more.',
        stars: 3
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Could see myself living here. Had a blast',
        stars: 4
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Did not sleep. The bed. OMG who lives here?',
        stars: 0
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Eh... this place had no electricity.',
        stars: 2
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
    return queryInterface.bulkDelete('Reviews', {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
