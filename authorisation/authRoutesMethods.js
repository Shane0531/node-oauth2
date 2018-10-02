let userDBHelper;

module.exports = injectedUserDBHelper => {
  userDBHelper = injectedUserDBHelper;

  return {
    registerUser: registerUser,
    login: login
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

function login(registerUserQuery, res) {}

function sendResponse(res, message, error) {
  res.status(error == null ? 200 : 400).json({
    status: message == "Registration was successful" ? 200 : 400,
    message: message,
    error: error
  });
}
