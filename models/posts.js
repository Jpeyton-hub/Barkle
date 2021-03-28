/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posts.init(
    {
      poster_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      likes: { type: DataTypes.INTEGER, defaultValue: 0 }
    },
    {
      sequelize,
      modelName: "posts"
    }
  );
  return posts;
};
