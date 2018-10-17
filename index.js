const port = 9999;
const accessTokenDBHelper = require("./databaseHelpers/accessTokensDBHelper")();
const userDBHelper = require("./databaseHelpers/userDBHelper")();
const oAuthModel = require("./authorisation/accessTokenModel")(
  userDBHelper,
  accessTokenDBHelper
);
const oAuth2Server = require("node-oauth2-server");
const express = require("express");
const expressApp = express();
expressApp.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ["password"],
  debug: true,
  accessTokenLifetime: 7200
});
//임시
expressApp.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const restrictedAreaRoutesMethods = require("./restrictedArea/restrictedAreaRoutesMethods.js");
const restrictedAreaRoutes = require("./restrictedArea/restrictedAreaRoutes.js")(
  express.Router(),
  expressApp,
  restrictedAreaRoutesMethods
);
const authRoutesMethods = require("./authorisation/authRoutesMethods")(
  userDBHelper,
  accessTokenDBHelper
);
const authRoutes = require("./authorisation/authRoutes")(
  express.Router(),
  expressApp,
  authRoutesMethods
);
const bodyParser = require("body-parser");

expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.use("/oauth", authRoutes);
expressApp.use("/oauth/verify", restrictedAreaRoutes);

expressApp.use(expressApp.oauth.errorHandler());

expressApp.listen(port, () => {
  console.log("auth server started");
  console.log(`listening on port ${port}`);
});
