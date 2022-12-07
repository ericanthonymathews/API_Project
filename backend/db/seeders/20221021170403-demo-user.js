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
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'Sum-buddy', 'Superman'] }
    }, {});
  }
};
