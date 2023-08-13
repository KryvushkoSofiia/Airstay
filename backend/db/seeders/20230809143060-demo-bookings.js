"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}


module.exports = {
  async up(queryInterface, Sequelize) {


    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: "2015-10-09",
        endDate: "2019-09-08",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2020-10-03",
        endDate: "2023-03-12",
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2000-02-03",
        endDate: "2016-10-11",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
