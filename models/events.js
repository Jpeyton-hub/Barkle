/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  events.init(
    {
      name: DataTypes.STRING,
      date: DataTypes.STRING,
      time: DataTypes.STRING,
      event_description: DataTypes.STRING,
      location_id: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      dogs_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "events"
    }
  );
  return events;
};
