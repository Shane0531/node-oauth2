let userDBHelper;

module.exports = injectedUserDBHelper => {
  userDBHelper = injectedUserDBHelper;

  return {
    registerUser: registerUser,
    login: login
  };
};

function registerUser(req, res) {
  console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);

  userDBHelper.doesUserExist(req.body.username, (sqlError, doesUserExist) => {
    if (sqlError !== null || doesUserExist) {
      const message =
        sqlError !== null ? "Operation unsuccessful" : "User already exists";

      const error = sqlError !== null ? sqlError : "User already exists";

      sendResponse(res, message, sqlError);

      return;
    }
    userDBHelper.registerUserInDB(req.body.username, req.body.password, () => {
      const message = "Registration was successful";

      sendResponse(res, message, (error = null));
    });
  });
}

function login(registerUserQuery, res) {}

function sendResponse(res, message, error) {
  res.status(error !== null ? (error !== null ? 400 : 200) : 400).json({
    status: message == "Operation unsuccessful" ? 200 : 400,
    message: message,
    error: error
  });
}
