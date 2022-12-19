'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
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
        userId: 3,
        review: 'Could see myself living here. Had a blast',
        stars: 4
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Did not sleep. The bed. OMG who lives here?',
        stars: 1
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

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
