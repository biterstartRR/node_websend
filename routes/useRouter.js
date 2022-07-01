const express = require("express");
const mysq = require("./mysql");
let router = express.Router();
// 登录
router.post("/login", (req, res) => {
  //验证账号密码
  mysq.db.query("SELECT * FROM `emp`", (err, r) => {
    res.send(r)
  });
})
// 搜索用户
router.post("/lguser", (req, res) => {
  var str = req.body.id;
  console.log(str);
  mysq.db.query(`select * from emp where ename = ?`, [str], (err, r) => {
    res.send(r);
    console.log(r)
  });
});
// 获取全部用户
router.get("/getuse", (req, res) => {
  // var str = 'tao" or "1';
  mysq.db.query(`select * from emp where ename = "tao" or "1"`, (err, r) => {
    res.send(r);
  });
});
// 注册
router.post("/usereg", (req, res) => {
  var str = req.body;
  if (str.sex == "男") {
    var sex = 1;
  } else if (str.sex == "女") {
    var sex = 0;
  }
  mysq.db.query(
    "insert into emp values(null,?,?,?,?,?)",
    [str.name, sex, str.bir, str.salary, str.bumen],
    (err, r) => {
      // res.send(r);
      console.log(r);
    }
  );
  console.log(req.body);
});
//导出该路由
module.exports = router;