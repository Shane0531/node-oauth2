const Sequelize = require("sequelize");

const db = new Sequelize(
  "oAuth2Test", // 데이터베이스 이름
  "root", // 유저 명
  "", // 비밀번호
  {
    host: "localhost", // 데이터베이스 호스트
    dialect: "mysql",
    timezone: "+09:00"
  }
);

exports.db = db;
