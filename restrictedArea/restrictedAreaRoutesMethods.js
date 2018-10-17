const { Users } = require("../database/model/users");

module.exports = {
  accessRestrictedArea: accessRestrictedArea
};

function accessRestrictedArea(req, res) {
  const tokenClient = req.oauth.bearerToken.client;
  const id = req.user.id;
  const reqClient = req.body.client;

  if (tokenClient == reqClient) {
    Users.findOne({
      where: {
        idx: id
      }
    })
      .then(item => {
        res.status(200).json({
          email: item.dataValues.email
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
// function makeDTO(item) {
//   let result = {};
//   let insufficientProfile = null;
//
//   if (item.dataValues.birthday == null) {
//     insufficientProfile = "birthday";
//   } else if (item.dataValues.real_name == "") {
//     insufficientProfile = "realName";
//   }
//
//   result["email"] = item.dataValues.email;
//   result["profileImageUrl"] = item.dataValues.picture;
//   result["nickName"] = item.dataValues.name;
//   result["insufficientProfile"] = insufficientProfile;
//   result["locale"] = item.dataValues.locale;
//   result["grade"] = item.dataValues.grade;
//
//   return result;
// }
