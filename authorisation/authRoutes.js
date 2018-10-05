module.exports = (router, expressApp, authRoutesMethods) => {
  router.post("/registerUser", authRoutesMethods.registerUser);
  router.post("/login", expressApp.oauth.grant());
  router.post("/autoLogin", authRoutesMethods.autoLogin);
  router.post("/logout", authRoutesMethods.logout);
  router.get("/check/nickname", authRoutesMethods.checkNickname);
  router.get("/check/email", authRoutesMethods.checkEmail);
  return router;
};
