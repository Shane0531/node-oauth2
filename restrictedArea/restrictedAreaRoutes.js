module.exports = (router, expressApp, restrictedAreaRoutesMethods) => {
  router.post(
    "",
    expressApp.oauth.authorise(),
    restrictedAreaRoutesMethods.accessRestrictedArea
  );

  return router;
};
