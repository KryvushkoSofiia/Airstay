"use strict";

const { Spot } = require("../models");
const { faker } = require('@faker-js/faker');

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {


    // await Spot.bulkCreate([
    //   {
    //     ownerId: 1,
    //     address: "456 Pine Street",
    //     city: "Greenfield",
    //     state: "Montana",
    //     country: "USA",
    //     lat: 45.6789,
    //     lng: -110.1234,
    //     name: "Nature Retreat",
    //     description: "Escape to the tranquility of nature",
    //     price: 75,
    //   },
    //   {
    //     ownerId: 2,
    //     address: "789 Summit Avenue",
    //     city: "Mountainville",
    //     state: "Colorado",
    //     country: "USA",
    //     lat: 39.8765,
    //     lng: -105.4321,
    //     name: "Mountain View Cabin",
    //     description: "Cozy cabin with breathtaking mountain views",
    //     price: 120,
    //   },
    //   {
    //     ownerId: 3,
    //     address: "101 Seaside Drive",
    //     city: "Beachville",
    //     state: "Florida",
    //     country: "USA",
    //     lat: 25.1234,
    //     lng: -80.5678,
    //     name: "Beachfront Paradise",
    //     description: "Relax and unwind by the beautiful sandy shores",
    //     price: 100,
    //   },
    // ]);

    const spots = [];
    for (let i = 0; i < 20; i++) {
      const fakeSpot = {
        ownerId: faker.number.int({ min: 1, max: 20 }),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        name: faker.location.cityName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 50, max: 500 }), 
      };
      console.log(fakeSpot);
      spots.push(fakeSpot);
    }
    await Spot.bulkCreate(spots);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
