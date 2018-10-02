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
    grade: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    locale: {
      type: Sequelize.STRING
    },
    picture: {
      type: Sequelize.STRING
    },
    auto_login: {
      type: Sequelize.STRING
    },
    activated_date: {
      type: Sequelize.DATE
    },
    login_date: {
      type: Sequelize.DATE
    },
    write_date: {
      type: Sequelize.DATE
    },
    old_idx: {
      type: Sequelize.INTEGER
    },
    email_subscribe: {
      type: Sequelize.TINYINT
    },
    last_latitude: {
      type: Sequelize.STRING
    },
    last_longitude: {
      type: Sequelize.STRING
    },
    last_country_code: {
      type: Sequelize.STRING
    },
    last_ip: {
      type: Sequelize.STRING
    },
    selected_badge_idx: {
      type: Sequelize.INTEGER
    },
    terms_level: {
      type: Sequelize.SMALLINT
    },
    external_code: {
      type: Sequelize.STRING
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
    },
    invalid_email: {
      type: Sequelize.INTEGER
    },
    country_code_publish: {
      type: Sequelize.INTEGER
    },
    partner_idx: {
      type: Sequelize.INTEGER
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
