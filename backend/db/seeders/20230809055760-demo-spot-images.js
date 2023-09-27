"use strict";

const { SpotImage } = require("../models");
const { faker } = require('@faker-js/faker');

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {

    // await SpotImage.bulkCreate([
    //   {
    //     spotId: 1,
    //     url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    //     preview: true,
    //   },
    //   {
    //     spotId: 2,
    //     url: "https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    //     preview: true,
    //   },
    //   {
    //     spotId: 3,
    //     url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    //     preview: true,
    //   }
    // ]);
    const spotImages = [];
    const numImagesPerSpot = 5;

    //to store only unique urls
    const uniqueImageUrls = new Set();

    for (let spotId = 1; spotId <= 20; spotId++) {
      for (let i = 0; i < numImagesPerSpot; i++) {
        let imageUrl;

        do {
          imageUrl = faker.image.url();
        } while (uniqueImageUrls.has(imageUrl));

        uniqueImageUrls.add(imageUrl);

        const fakeImage = {
          spotId: spotId,
          url: imageUrl,
          preview: i === 0,
        };
        spotImages.push(fakeImage);
      }
    }

    await SpotImage.bulkCreate(spotImages);
  },
  async down(queryInterface, Sequelize) {

    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: {
          [Op.in]: [1, 2, 3]
        },
      }, {}
    );
  },
};
