const data = require("mysql");
const db = data.createConnection({
  host: "localhost",
  port: 3306,
  password: "",
  database: "qiuqiu",
  user: "root",
});
const ut = data.createConnection({
  host: "localhost",
  port: 3306,
  password: "",
  database: "usertable",
  user: "root",
});
module.exports = {
  db: db,
  ut: ut,
};
