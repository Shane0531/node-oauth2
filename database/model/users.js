const Sequelize = require("sequelize");
const { db } = require("../db");

const UsersModel = db.define(
  "user",
  {
    idx: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING
    },
    passwd: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    real_name: {
      type: Sequelize.STRING
    },
    locale: {
      type: Sequelize.STRING
    },
    picture: {
      type: Sequelize.STRING
    },
    write_date: {
      type: Sequelize.DATE
    },
    birthday: {
      type: Sequelize.DATE
    },
    gender: {
      type: Sequelize.STRING
    },
    country_code: {
      type: Sequelize.STRING
    },
    converted_email: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const Users = db.models.user;
const TermsLevel = 1;

exports.Users = Users;
exports.TermsLevel = TermsLevel;
