const { db } = require("../database/db");
const Sequelize = require("sequelize");
const { AccessToken } = require("../database/model/token");
let mySqlConnection;

module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection;

  return {
    saveAccessToken: saveAccessToken,
    getUserIDFromBearerToken: getUserIDFromBearerToken
  };
};

function saveAccessToken(accessToken, userID, callback) {
  db.query(
    "INSERT INTO user_token (user_idx, token, expiry_date) VALUES (:userID, :accessToken,DATE_ADD(NOW(), INTERVAL 7200 SECOND)) ON DUPLICATE KEY UPDATE token = :accessToken",
    {
      replacements: { accessToken: accessToken, userID: userID },
      type: db.QueryTypes.INSERT,
      model: accessToken
    }
  )
    .then(result => {
      callback(null);
    })
    .catch(err => {
      callback(err);
    });
}

function getUserIDFromBearerToken(bearerToken, callback) {
  AccessToken.findOne({
    where: {
      token: bearerToken
    }
  })
    .then(item => {
      if (item) {
        const userID = item.dataValues.user_idx;
        const expiredDate = item.dataValues.expiry_date;
        const accessTokens = {
          user: {
            id: userID
          },
          expires: expiredDate
        };
        callback(false, accessTokens);
      } else {
        callback(false, null);
      }
    })
    .catch(err => {
      console.log("ERR : " + err);
      callback(false, null);
    });
}
