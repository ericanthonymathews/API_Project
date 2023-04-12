"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "SpotImages";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://images.squarespace-cdn.com/content/v1/57e042818419c20173050626/1634585628312-WH6KK9OT6EEDU48ATWDC/3732-matador-dr-dallas-tx-75220-High-Res-4.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://images.squarespace-cdn.com/content/v1/55a62abee4b00c5f241d8b09/1627557771845-8QA9IIFWWJT40HXV1UNR/06_Collaroy+Plateau+-+Display+Granny+Flat+-+Bungalow+Homes+-+HighRes.jpg?format=1500w",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzB6ColMfiMLDc3FCTeOesOcEfgrxwxpdt1Q&usqp=CAU",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://images.squarespace-cdn.com/content/v1/5fbd910c250cdc3fee6aa0e6/1611071156505-G8GP1GNNCLW94PVVB4IR/plans_gallery_1000B_DSC1082_High_Res.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://www.browsedestin.com/uploads/destin-beachfront-homes.jpg",
          preview: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "https://picsum.photos/id/237/200/300",
            "https://picsum.photos/id/238/200/300",
            "https://picsum.photos/id/239/200/300",
            "https://picsum.photos/id/240/200/300",
            "https://picsum.photos/id/241/200/300",
          ],
        },
      },
      {}
    );
  },
};
