let userDBHelper;
let accessTokensDBHelper;

module.exports = (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
  userDBHelper = injectedUserDBHelper;

  accessTokensDBHelper = injectedAccessTokensDBHelper;

  return {
    getClient: getClient,

    saveAccessToken: saveAccessToken,

    getUser: getUser,

    grantTypeAllowed: grantTypeAllowed,

    getAccessToken: getAccessToken
  };
};

function getClient(clientID, clientSecret, callback) {
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null
  };

  callback(false, client);
}

function grantTypeAllowed(clientID, grantType, callback) {
  callback(false, true);
}

function getUser(username, password, callback) {
  userDBHelper.getUserFromCrentials(username, password, callback);
}

function saveAccessToken(accessToken, clientID, expires, user, callback) {
  accessTokensDBHelper.saveAccessToken(accessToken, user.idx, callback);
}

function getAccessToken(bearerToken, callback) {
  accessTokensDBHelper.getUserIDFromBearerToken(bearerToken, callback);
}
