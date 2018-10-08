module.exports = (router, expressApp, authRoutesMethods) => {
  router.post("/register", authRoutesMethods.registerUser);
  router.post("/login", expressApp.oauth.grant());
  router.post("/autoLogin", authRoutesMethods.autoLogin);
  router.post("/logout", authRoutesMethods.logout);
  router.post("/lang", authRoutesMethods.changeLocale);
  router.post("/profile/birthday", authRoutesMethods.changeBirthday);
  router.post("/profile/email", authRoutesMethods.changeEmail);
  router.post("/profile/passwd", authRoutesMethods.changePassword);
  router.post("/profile", authRoutesMethods.changeProfile);
  router.get("/check/nickname", authRoutesMethods.checkNickname);
  router.get("/check/email", authRoutesMethods.checkEmail);
  return router;
};
