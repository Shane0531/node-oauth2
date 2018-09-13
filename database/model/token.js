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
    },
    expire_date: {
      type: Sequelize.DATE
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const AccessToken = db.models.access_tokens;

exports.AccessToken = AccessToken;
