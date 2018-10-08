const { db } = require("../database/db");
const Sequelize = require("sequelize");
const { AccessToken } = require("../database/model/token");

module.exports = () => {
  return {
    saveAccessToken: saveAccessToken,
    getUserIDFromBearerToken: getUserIDFromBearerToken,
    saveAutoLoginToken: saveAutoLoginToken,
    deleteToken: deleteToken
  };
};

function saveAccessToken(accessToken, userID, clientID, callback) {
  db.query(
    "INSERT INTO access_token (user_idx, token, expiry_date, client) VALUES (:userID, :accessToken,DATE_ADD(NOW(), INTERVAL 7200 SECOND), :clientID) ON DUPLICATE KEY UPDATE token = :accessToken",
    {
      replacements: {
        accessToken: accessToken,
        userID: userID,
        clientID: clientID
      },
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

function saveAutoLoginToken(payload, callback) {
  const token = payload.token;
  db.query(
    "UPDATE access_token SET expiry_date=DATE_ADD(NOW(), INTERVAL 1 MONTH) WHERE token = :token",
    {
      replacements: { token: token },
      type: db.QueryTypes.UPDATE
    }
  )
    .then(result => {
      callback(null);
    })
    .catch(err => {
      callback(err);
    });
}

//해당 토근 한개 지우기
function deleteToken(token, callback) {
  AccessToken.destroy({
    where: {
      token: token
    }
  })
    .then(() => {
      callback(true, null);
    })
    .catch(err => {
      callback(false, err);
    });
}

//해당 유저의 모든 토큰 지우기
function deleteUserAllToken(userIdx, callback) {
  AccessToken.destroy({
    where: {
      user_idx: userIdx
    }
  })
    .then(() => {
      callback(true, null);
    })
    .catch(err => {
      callback(false, err);
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
        const client = item.dataValues.client;
        const accessTokens = {
          user: {
            id: userID
          },
          client: client,
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
