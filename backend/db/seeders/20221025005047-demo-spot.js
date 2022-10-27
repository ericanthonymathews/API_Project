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
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '2126 S. Primrose Ave',
        city: 'Alhambra',
        state: 'California',
        country: 'United States',
        name: 'Spanish Retreat',
        description: 'A cozy home with everything to nurture a family',
        lat: 34.068352,
        lng: -118.148430,
        price: 200.00
      },
      {
        ownerId: 3,
        address: '4 Privet Dr.',
        city: 'Little Whinging',
        state: 'Surrey',
        country: 'England',
        name: 'A cookie cutter home for muggles',
        description: 'There is no magic to speak of here.',
        lat: 24.068352,
        lng: 118.148430,
        price: 250.00
      },
      {
        ownerId: 2,
        address: '344 Clinton St.',
        city: 'Metropolis',
        state: 'New York',
        country: 'United States',
        name: 'Super Lookout',
        description: 'Great view with a balcony for any frequent fliers.',
        lat: 34.068352,
        lng: -98.148430,
        price: 100.00
      },
      {
        ownerId: 2,
        address: '344 11th St.',
        city: 'Brooklyn',
        state: 'New York',
        country: 'United States',
        name: 'The Other Side',
        description: 'Tall ceilings, great views, good community.',
        lat: 34.068352,
        lng: -98.148430,
        price: 100.00
      },
      {
        ownerId: 1,
        address: '123 Sumplace Rd.',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        name: 'The Bank',
        description: 'Indestructible, zombie-proof, everything else.',
        lat: 34.068352,
        lng: -98.148430,
        price: 500.00
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      address: { [Op.in]: ['2126 S. Primrose Ave', '4 Privet Dr.', '344 Clinton St.', '344 11th St.', '123 Sumplace Rd.'] }
    }, {});
  }
};
