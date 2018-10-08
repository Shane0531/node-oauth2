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
    logout: logout,
    changeLocale: changeLocale,
    changeBirthday: changeBirthday,
    changeEmail: changeEmail,
    changePassword: changePassword,
    changeProfile: changeProfile
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

function changeLocale(req, res) {
  userDBHelper.changeLocale(req.body.idx, req.body.locale, () => {
    res.status(200).json({
      status: 200,
      message: "Locale Change Completed"
    });
  });
}

function changeBirthday(req, res) {
  userDBHelper.changeBirthday(req.body, () => {
    res.status(200).json({
      status: 200,
      message: "Birthday Change Completed"
    });
  });
}

function changeEmail(req, res) {
  userDBHelper.changeEmail(req.body.idx, req.body.email, () => {
    res.status(200).json({
      status: 200,
      message: "Email Change Completed"
    });
  });
}

function changeProfile(req, res) {
  userDBHelper.changeProfile(req.body, () => {
    res.status(200).json({
      status: 200,
      message: "Profile Change Completed"
    });
  });
}

function changePassword(req, res) {
  userDBHelper.changePassword(req.body.idx, req.body.passwd, () => {
    res.status(200).json({
      status: 200,
      message: "Password Change Completed"
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
