"use strict";

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up(queryInterface, Sequelize) {


    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "revUrl1",
      },
      {
        reviewId: 2,
        url: "revUrl2",
      },
      {
        reviewId: 3,
        url: "revUrl3",
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

    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
