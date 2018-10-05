const { Users, TermsLevel } = require("../database/model/users");

module.exports = {
  accessRestrictedArea: accessRestrictedArea
};

function accessRestrictedArea(req, res) {
  const tokenClient = req.oauth.bearerToken.client;
  const userId = req.user.id;
  const reqClient = req.body.client;
  if (tokenClient == reqClient) {
    Users.findOne({
      where: {
        idx: userId
      }
    })
      .then(item => {
        const result = makeDTO(item);
        res.status(200).json({
          content: result
        });
      })
      .catch(err => {
        res.status(401).json({
          message: "No User"
        });
      });
  } else {
    res.status(401).json({
      message: "No User"
    });
  }
}

//initialReferer 써야하나????
function makeDTO(item) {
  let result = {};
  let insufficientProfile = null;

  if (item.dataValues.birthday == null) {
    insufficientProfile = "birthday";
  } else if (item.dataValues.real_name == "") {
    insufficientProfile = "realName";
  }

  result["idx"] = item.dataValues.idx;
  result["email"] = item.dataValues.email;
  result["isLoggedIn"] = true;
  result["profileImageUrl"] = item.dataValues.picture;
  result["nickName"] = item.dataValues.name;
  result["insufficientProfile"] = insufficientProfile;
  result["locale"] = item.dataValues.locale;
  result["grade"] = item.dataValues.grade;
  result["isActivated"] = item.dataValues.grade == "00" ? false : true;
  result["needRefreshTerms"] = item.dataValues.terms_level < TermsLevel;

  return result;
}
