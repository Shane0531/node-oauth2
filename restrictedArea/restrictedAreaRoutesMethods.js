const { Users } = require("../database/model/users");

module.exports = {
  accessRestrictedArea: accessRestrictedArea
};

function accessRestrictedArea(req, res) {
  const userId = req.user.id;
  Users.findOne({
    where: {
      idx: userId
    }
  })
    .then(item => {
      const result = makeDTO(item);
      res.status(200).json({
        user: result
      });
    })
    .catch(err => {
      res.status(401).json({
        message: "No User"
      });
    });
}

function makeDTO(item) {
  let result = {};
  result["idx"] = item.dataValues.idx;
  result["email"] = item.dataValues.email;
  return result;
}
