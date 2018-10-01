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
    "INSERT INTO access_tokens (access_token, user_id, expire_date) VALUES (:accessToken, :userID,DATE_ADD(NOW(), INTERVAL 7200 SECOND)) ON DUPLICATE KEY UPDATE access_token = :accessToken",
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
      access_token: bearerToken
    }
  })
    .then(item => {
      if (item) {
        const userID = item.dataValues.user_id;
        const expiredDate = item.dataValues.expire_date;
        const accessTokens = {
          user: {
            id: userID
          },
          expires: expiredDate
        };
        callback(false, accessTokens);
      }
    })
    .catch(err => {
      console.log("ERR : " + err);
      callback(false, null);
    });
}
