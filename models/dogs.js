/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dogs.init(
    {
      name: DataTypes.STRING,
      breed: DataTypes.STRING,
      outgoing: DataTypes.BOOLEAN,
      fav_activity: DataTypes.STRING,
      owner_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "dogs"
    }
  );
  return dogs;
};
