/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("dogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      breed: {
        type: Sequelize.STRING
      },
      outgoing: {
        type: Sequelize.BOOLEAN
      },
      fav_activity: {
        type: Sequelize.STRING
      },
      dog_pic: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("dogs");
  }
};
