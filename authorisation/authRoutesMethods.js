let userDBHelper;
let accessTokensDBHelper;

module.exports = (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
  userDBHelper = injectedUserDBHelper;
  accessTokensDBHelper = injectedAccessTokensDBHelper;
  return {
    registerUser: registerUser,
    autoLogin: autoLogin,
    checkNickname: checkNickname,
    checkEmail: checkEmail,
    logout: logout
  };
};

//TODO: GEOIP랑 RECAPTCHA 추가해야합니다.
function registerUser(req, res) {
  userDBHelper.doesUserExist(req.body.email, (sqlError, doesUserExist) => {
    if (sqlError !== null || doesUserExist) {
      const message =
        sqlError !== null ? "Operation unsuccessful" : "User already exists";

      const error = sqlError !== null ? sqlError : "User already exists";

      sendResponse(res, message, sqlError);

      return;
    }

    userDBHelper.doesUserNickname(
      req.body.nickname,
      (sqlError, doesUserExist) => {
        if (sqlError !== null || doesUserExist) {
          const message =
            sqlError !== null
              ? "Operation unsuccessful"
              : "User Nickname already exists";

          const error =
            sqlError !== null ? sqlError : "User Nickname already exists";

          sendResponse(res, message, sqlError);

          return;
        }
        userDBHelper.registerUserInDB(req.body, () => {
          const message = "Registration was successful";

          sendResponse(res, message, (error = null));
        });
      }
    );
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

function logout(req, res) {
  accessTokensDBHelper.deleteToken(req.body.token, (isDeleted, sqlError) => {
    if (isDeleted) {
      res.status(200).json({
        status: 200,
        message: "Logout Completed"
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Logout Failed",
        err: sqlError
      });
    }
  });
}

function checkNickname(req, res) {
  var query = req.query;
  userDBHelper.doesUserNickname(query.nickname, (sqlError, doesUserExist) => {
    if (sqlError !== null || doesUserExist) {
      const message =
        sqlError !== null
          ? "Operation unsuccessful"
          : "User Nickname already exists";

      const error =
        sqlError !== null ? sqlError : "User Nickname already exists";

      sendResponse(res, message, sqlError);
      return;
    }
    res.status(200).json({ status: 200 });
  });
}

function checkEmail(req, res) {
  var query = req.query;
  userDBHelper.doesUserExist(query.email, (sqlError, doesUserExist) => {
    if (sqlError !== null || doesUserExist) {
      const message =
        sqlError !== null
          ? "Operation unsuccessful"
          : "User Email already exists";

      const error = sqlError !== null ? sqlError : "User Email already exists";

      sendResponse(res, message, sqlError);
      return;
    }
    res.status(200).json({ status: 200 });
  });
}

function sendResponse(res, message, error) {
  res.status(error == null ? 200 : 400).json({
    status: message == "Registration was successful" ? 200 : 400,
    message: message,
    error: error
  });
}
