'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'John',
        lastName: 'Doe',
        hashedPassword: bcrypt.hashSync('password2'),
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Jane',
        lastName: 'Smith',
        hashedPassword: bcrypt.hashSync('password3'),
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
