const Sequelize = require("sequelize");

const password = process.env.OAUTH_DATABASE_PASSWORD;
const host = process.env.OAUTH_DATABASE_HOST;

const db = new Sequelize(
  "oAuth2Test", // 데이터베이스 이름
  "root", // 유저 명
  password, // 비밀번호
  {
    host: host, // 데이터베이스 호스트
    dialect: "mysql",
    timezone: "+09:00",
    logging: false
  }
);

exports.db = db;
