'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'ReviewImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
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

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://picsum.photos/id/242/200/300', 'https://picsum.photos/id/243/200/300', 'https://picsum.photos/id/244/200/300', 'https://picsum.photos/id/245/200/300', 'https://picsum.photos/id/246/200/300'] }
    }, {});
  }
};
