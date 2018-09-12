const Sequelize = require("sequelize");
const { db } = require("../db");

const accessTokenModel = db.define(
  "access_tokens",
  {
    access_token: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const accessToken = db.models.access_token;

exports.accessToken = accessToken;
