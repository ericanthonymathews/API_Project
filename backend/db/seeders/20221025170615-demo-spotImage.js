'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'SpotImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://picsum.photos/id/237/200/300',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://picsum.photos/id/238/200/300',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://picsum.photos/id/239/200/300',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://picsum.photos/id/240/200/300',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://picsum.photos/id/241/200/300',
        preview: true
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/238/200/300', 'https://picsum.photos/id/239/200/300', 'https://picsum.photos/id/240/200/300', 'https://picsum.photos/id/241/200/300'] }
    }, {});
  }
};
