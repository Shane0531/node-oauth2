module.exports = (router, expressApp, authRoutesMethods) => {
  router.post("/registerUser", authRoutesMethods.registerUser);
  router.post("/login", expressApp.oauth.grant());
  router.post("/autoLogin", authRoutesMethods.autoLogin);
  return router;
};
