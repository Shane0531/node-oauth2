const Sequelize = require("sequelize");
const { db } = require("../db");

const accessTokenModel = db.define(
  "access_token",
  {
    idx: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_idx: {
      type: Sequelize.INTEGER
    },
    token: {
      type: Sequelize.STRING
    },
    expiry_date: {
      type: Sequelize.DATE
    },
    client: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const AccessToken = db.models.user_token;

exports.AccessToken = AccessToken;
