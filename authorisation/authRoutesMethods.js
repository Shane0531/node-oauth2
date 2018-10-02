let userDBHelper;
let accessTokensDBHelper;

module.exports = (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
  userDBHelper = injectedUserDBHelper;
  accessTokensDBHelper = injectedAccessTokensDBHelper;
  return {
    registerUser: registerUser,
    autoLogin: autoLogin
  };
};

function registerUser(req, res) {
  userDBHelper.doesUserExist(req.body.email, (sqlError, doesUserExist) => {
    if (sqlError !== null || doesUserExist) {
      const message =
        sqlError !== null ? "Operation unsuccessful" : "User already exists";

      const error = sqlError !== null ? sqlError : "User already exists";

      sendResponse(res, message, sqlError);

      return;
    }
    userDBHelper.registerUserInDB(req.body, () => {
      const message = "Registration was successful";

      sendResponse(res, message, (error = null));
    });
  });
}

//자동로그인 기능
function autoLogin(req, res) {
  accessTokensDBHelper.saveAutoLoginToken(req.body.token, () => {
    res.status(200).json({
      status: 200,
      message: "AutoLogin Completed"
    });
  });
}

function sendResponse(res, message, error) {
  res.status(error == null ? 200 : 400).json({
    status: message == "Registration was successful" ? 200 : 400,
    message: message,
    error: error
  });
}
