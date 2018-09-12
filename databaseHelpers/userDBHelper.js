const { db } = require("../database/db");
const { Users } = require("../database/model/users");
const bcrypt = require("bcrypt");
let mySqlConnection;

module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection;

  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist
  };
};

function registerUserInDB(username, password, registrationCallback) {
  bcrypt.hash(password, bcrypt.genSaltSync(10)).then(hash => {
    Users.create({
      username: username,
      user_password: "!" + hash
    });
  });
  registrationCallback();
}

function getUserFromCrentials(username, password, callback) {
  Users.findOne({
    where: {
      username: username
    }
  })
    .then(item => {
      bcrypt
        .compare(password, item.dataValues.user_password.substring(1))
        .then(res => {
          if (res) callback(false, item);
          else callback(false, null);
        });
    })
    .catch(err => {
      console.log("ERR : " + err);
      callback(false, null);
    });
}

function doesUserExist(username, callback) {
  const doesUserExistQuery = `SELECT * FROM users WHERE username = '${username}'`;

  const sqlCallback = dataResponseObject => {
    //calculate if user exists or assign null if results is null
    const doesUserExist =
      dataResponseObject.results !== null
        ? dataResponseObject.results.length > 0
          ? true
          : false
        : null;

    callback(dataResponseObject.error, doesUserExist);
  };

  mySqlConnection.query(doesUserExistQuery, sqlCallback);
}
