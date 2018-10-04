const { db } = require("../database/db");
const { Users, TermsLevel } = require("../database/model/users");
const bcrypt = require("bcrypt");

module.exports = () => {
  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist,
    doesUserNickname: doesUserNickname
  };
};

//TODO 13세미만 허용안되는 로직 추가해야함
function registerUserInDB(payload, registrationCallback) {
  const email = payload.email.trim();
  const password = payload.password;
  const nickname = payload.nickname;
  const realname = payload.realname;
  const birthYear = payload.birthYear;
  const birthMonth = payload.birthMonth;
  const birthDay = payload.birthDay;
  const gender = payload.gender;
  const countryCode = payload.contryCode;
  const locale = payload.locale;
  const reCaptcha = payload.recaptcha;

  const birthDayDate = birthYear + "-" + birthMonth + "-" + birthDay;

  bcrypt.hash(password, bcrypt.genSaltSync(10)).then(hash => {
    Users.create({
      email: email,
      passwd: "!" + hash,
      name: nickname,
      real_name: realname,
      locale: locale,
      gender: gender,
      country_code: countryCode,
      birthday: birthDayDate,
      converted_email: convertEmail(email),
      terms_level: TermsLevel
    });
  });
  registrationCallback();
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

function doesUserNickname(name, callback) {
  Users.findOne({
    where: {
      name: name
    }
  })
    .then(item => {
      callback(null, item ? true : false);
    })
    .catch(err => {
      callback(true, err);
    });
}

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
