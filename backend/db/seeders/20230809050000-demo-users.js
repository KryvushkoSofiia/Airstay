'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    // await User.bulkCreate([
    //   {
    //     email: 'demo@user.io',
    //     username: 'Demo-lition',
    //     firstName: 'Demo',
    //     lastName: 'User',
    //     hashedPassword: bcrypt.hashSync('password'),
    //   },
    //   {
    //     email: 'user1@user.io',
    //     username: 'FakeUser1',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     hashedPassword: bcrypt.hashSync('password2'),
    //   },
    //   {
    //     email: 'user2@user.io',
    //     username: 'FakeUser2',
    //     firstName: 'Jane',
    //     lastName: 'Smith',
    //     hashedPassword: bcrypt.hashSync('password3'),
    //   }
    // ], { validate: true });
    try {
      const users = [];
      for (let i = 1; i <= 20; i++) {
        const fakeUser = {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          hashedPassword: bcrypt.hashSync('password'),
        };
        console.log(fakeUser);
        users.push(fakeUser);
      }
      await User.bulkCreate(users, { validate: true });
      console.log('Seeding completed successfully.');
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
