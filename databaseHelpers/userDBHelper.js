const { db } = require("../database/db");
const { Users } = require("../database/model/users");
const bcrypt = require("bcrypt");
let mySqlConnection;

module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection;

  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist
  };
};

//TODO 13세미만 허용안되는 로직 추가해야함
function registerUserInDB(payload, registrationCallback) {
  console.log(payload);
  const email = payload.email;
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
      birthday: birthDayDate
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
        .compare(passwd, item.dataValues.user_password.substring(1))
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

// TODO 이메일 말고 닉네임도 중복체크를 해야합니다.
function doesUserExist(email, callback) {
  Users.findOne({
    where: {
      email: email
    }
  })
    .then(item => {
      callback(null, item ? true : false);
    })
    .catch(err => {
      callback(true, err);
    });
}
