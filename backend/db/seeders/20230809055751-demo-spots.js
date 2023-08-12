"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {


    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "456 Pine Street",
        city: "Greenfield",
        state: "Montana",
        country: "USA",
        lat: 45.6789,
        lng: -110.1234,
        name: "Nature Retreat",
        description: "Escape to the tranquility of nature",
        price: 75,
      },
      {
        ownerId: 2,
        address: "789 Summit Avenue",
        city: "Mountainville",
        state: "Colorado",
        country: "USA",
        lat: 39.8765,
        lng: -105.4321,
        name: "Mountain View Cabin",
        description: "Cozy cabin with breathtaking mountain views",
        price: 120,
      },
      {
        ownerId: 3,
        address: "101 Seaside Drive",
        city: "Beachville",
        state: "Florida",
        country: "USA",
        lat: 25.1234,
        lng: -80.5678,
        name: "Beachfront Paradise",
        description: "Relax and unwind by the beautiful sandy shores",
        price: 100,
      },
    ]);
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
