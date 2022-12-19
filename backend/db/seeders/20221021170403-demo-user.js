'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const bcrypt = require("bcryptjs");

options.tableName = 'Users';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Eric',
        lastName: 'Mathews'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Yennie',
        lastName: 'Yi'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Kevin',
        lastName: 'Mathews'
      },
      {
        email: 'iama@user.io',
        username: 'Sum-buddy',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: 'John',
        lastName: 'Doh'
      },
      {
        email: 'normalguy@thedailyplanet.biz',
        username: 'Superman',
        hashedPassword: bcrypt.hashSync('password8'),
        firstName: 'Clark',
        lastName: 'Kent'
      },
      {
        email: 'iama@gmail.com',
        username: 'Gabbagabba',
        hashedPassword: bcrypt.hashSync('password6e1'),
        firstName: 'James',
        lastName: 'Galallad'
      },
      {
        email: 'iama@thief.com',
        username: 'Bjergsen',
        hashedPassword: bcrypt.hashSync('password6e1'),
        firstName: 'Soren',
        lastName: 'Bjerg'
      },
      {
        email: 'botorfeed@gmail.com',
        username: 'Doublelift',
        hashedPassword: bcrypt.hashSync('spamfaster'),
        firstName: 'Yilang',
        lastName: 'Peng'
      },
      {
        email: 'iamamartist@gmail.com',
        username: 'Artist-for-hire',
        hashedPassword: bcrypt.hashSync('password6elephant'),
        firstName: 'Jeremy',
        lastName: 'Smithers'
      },
      {
        email: 'hellofriend@gmail.com',
        username: 'MrNiceGuy',
        hashedPassword: bcrypt.hashSync('everythingiscool'),
        firstName: 'Astin',
        lastName: 'Folds'
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'Sum-buddy', 'Superman', 'Gabbagabba', 'Bjergsen', 'Doublelift', 'Artist-for-hire', 'MrNiceGuy'] }
    }, {});
  }
};
