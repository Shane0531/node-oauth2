const { db } = require("../database/db");
const { Users } = require("../database/model/users");
const Op = require("sequelize").Op;
const bcrypt = require("bcrypt");

module.exports = () => {
  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist,
    doesUserNickname: doesUserNickname,
    changeProfile: changeProfile,
    changeLocale: changeLocale,
    changeBirthday: changeBirthday,
    changeEmail: changeEmail,
    changePassword: changePassword
  };
};

function registerUserInDB(payload, registrationCallback) {
  const email = payload.email.trim();
  const passwd = payload.passwd;
  const nickname = payload.nickname;
  const realname = payload.realname;
  const birthDayDate = payload.birthDayDate;
  const gender = payload.gender;
  const countryCode = payload.countryCode;
  const locale = payload.locale;

  Users.create({
    email: email,
    passwd: passwd,
    name: nickname,
    real_name: realname,
    locale: locale,
    gender: gender.substring(0, 1),
    country_code: countryCode,
    birthday: birthDayDate,
    converted_email: convertEmail(email)
  })
    .then(() => {
      registrationCallback();
    })
    .catch(err => {
      console.log("ERR : " + err);
      res.status(500).json({
        status: 500,
        message: "SignUp Failed",
        error: err
      });
    });
}

//TODO 구회원들 비밀번호 !로 시작안하는 것들 따로 분리하는 작업이 필요하다.
function getUserFromCrentials(email, password, callback) {
  Users.findOne({
    where: {
      email: email
    }
  })
    .then(item => {
      bcrypt
        .compare(password, item.dataValues.passwd.substring(1))
        .then(res => {
          if (res) callback(false, item);
          else callback(false, null);
        });
    })
    .catch(err => {
      console.log("ERR : " + err);
      callback(false, null);
    });
}

function doesUserExist(email, callback) {
  Users.findOne({
    where: {
      converted_email: email
    }
  })
    .then(item => {
      callback(null, item ? true : false);
    })
    .catch(err => {
      callback(true, err);
    });
}

function doesUserNickname({ nickname, email }, callback) {
  Users.findOne({
    where: {
      name: nickname,
      email: { [Op.ne]: email }
    }
  })
    .then(item => {
      callback(null, item ? true : false);
    })
    .catch(err => {
      console.log(err);
      callback(true, err);
    });
}

function changeLocale(idx, locale, callback) {
  Users.update(
    {
      locale: locale
    },
    { where: { idx: idx } }
  ).then(() => {
    callback(false, null);
  });
}

function changeBirthday(payload, callback) {
  const idx = payload.idx;
  const birthYear = payload.birthYear;
  const birthMonth = payload.birthMonth;
  const birthDay = payload.birthDay;
  const gender = payload.gender;
  const birthDayDate = birthYear + "-" + birthMonth + "-" + birthDay;
  Users.update(
    {
      gender: gender,
      birthday: birthDayDate
    },
    { where: { idx: idx } }
  ).then(() => {
    callback(false, null);
  });
}

function changeEmail(idx, newEmail, callback) {
  Users.update(
    {
      email: newEmail,
      converted_email: convertEmail(newEmail)
    },
    { where: { idx: idx } }
  ).then(() => {
    callback(false, null);
  });
}

function changePassword({ email, passwd }, callback) {
  Users.update(
    {
      passwd: passwd
    },
    { where: { email: email } }
  ).then(() => {
    callback(false, null);
  });
}

function changeProfile(payload, callback) {
  const nickname = payload.nickname;
  const realname = payload.realname;
  const countryCode = payload.contryCode;
  const locale = payload.locale;
  const picture = payload.picture;
  const idx = payload.idx;

  Users.update(
    {
      name: nickname,
      real_name: realname,
      country_code: countryCode,
      locale: locale,
      picture: picture
    },
    {
      where: { idx: idx }
    }
  ).then(() => {
    callback(false, null);
  });
}

// TODO 회원탈퇴 로직이 정해질때 다시 정의해야할 듯 싶다..
// function leaveUser(email, callback) {
//   Users.update({
//     email: "탈퇴_" + Math.floor(Math.random() * 100) + "_" + email,
//     passwd: "탙퇴회원",
//     name: "-",
//     real_name: "-",
//     picture: null,
//     converted_email: null
//   }, {
//     where: {email: email}
//   })
//   .then(() => {
//     callback(false, null);
//   })
//   .catch(err => {
//     callback(true, err);
//   });
// }

//Gmail은 .이 낑기든말든 같은 이메일로 인식한다. 따라서 이것들을 걸러내기위해 .이 들어있지않은 필드를 따로 저장하도록한다
function convertEmail(email) {
  const split = email.split("@");
  const bear = split[1].toLowerCase();
  if (bear == "gmail.com" || bear == "googlemail.com") {
    return split[0].replace(/\./gi, "") + "@" + split[1];
  } else {
    return email;
  }
}
