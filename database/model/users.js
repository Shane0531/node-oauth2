const Sequelize = require("sequelize");
const { db } = require("../db");

const UsersModel = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING
    },
    user_password: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const Users = db.models.users;

exports.Users = Users;
