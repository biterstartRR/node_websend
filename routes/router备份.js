const { request } = require("express");
const e = require("express");
const express = require("express");
const mysq = require("./mysql");
let router = express.Router();

// 登录
// 传入name和password
router.post("/login", (req, res) => {
  console.log("--------用户登录--------");
  var username = req.body.username;
  var password = req.body.password;
  mysq.db.query(`select * from user where id = ?`, [username], (err, r) => {
    console.log("用户登录:", req.body.name);
    console.log("密码:", req.body.password);
    console.log(r)
    if (r.length > 0) {
      var data = r;
      if (data[0].password == password) {
        res.send("1");
        console.log("状态：成功");
      } else {
        res.send("2");
        console.log("状态:密码错了");
      }
    } else {
      res.send("3");
      console.log("状态:用户名不存在");
    }
  });
  console.log(req.body);
});

// 注册
// id/password/name/mail/sex/ico/vip
router.post("/usereg", (req, res) => {
  console.log("--------用户注册--------");
  var str = req.body;
  console.log("信息:");
  console.log(str);
  mysq.db.query(
    "insert into user values(?,?,?,?,?,?,?)",
    [str.id, str.password, str.name, str.mail, str.sex, "./img/user.png", 0],
    (err, r) => {
      // res.send(r);
      console.log("状态：用户注册成功");
    }
  );
  var x = "`";
  var fox =
    "CREATE TABLE" +
    ` ${x + str.id + x} ` +
    "( `who` varchar(64) NOT NULL COMMENT '好友昵称', `id` varchar(128) NOT NULL COMMENT '好友标识', `text` varchar(9375) NOT NULL COMMENT '聊天内容', `time` datetime NOT NULL COMMENT '聊天时间', `inou` varchar(5) NOT NULL COMMENT '判断是发还是收0/1' ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;";
  mysq.ut.query(fox, (err, r) => {
    // res.send(r);
    console.log(err);
  });
  var foxs =
    "CREATE TABLE" +
    ` ${x + str.id + "f" + x} ` +
    "( `id` varchar(128) NOT NULL COMMENT '用户id【用户标识】', `who` varchar(128) NOT NULL COMMENT '双重验证用户名', `friend` varchar(128) NOT NULL COMMENT '好友的备注', `fid` varchar(128) NOT NULL COMMENT '好友的id', `isfriend` int(2) NOT NULL COMMENT '是否为好友' ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4; ";
  mysq.ut.query(foxs, (err, r) => {
    // res.send(r);
    console.log(err);
  });
});

// 发送消息
// 当前用户：user
// 目标好友：who
// 消息：msgs
router.post("/tomsgs", (req, res) => {
  console.log("--------发送消息--------");
  var str = req.body;
  // 确认好友列表是否存在
  mysq.ut.query(
    `select * from ${str.user}f WHERE fid='${str.who}';`,
    (err, r) => {
      if (r == undefined || r.length == 0) {
        console.log("用户好像没有添加过对方");
        res.send("你好像没有添加过对方");
      } else if (r[0].isfriend == 0) {
        console.log("请求方还未通过好友申请或双方还不是好友");
        res.send("对方还未通过好友申请或你们还不是好友");
      } else if (r[0].isfriend == 2) {
        console.log("用户拉黑了对方，若要发消息请需要黑名单拉出");
        res.send("你拉黑了对方，若要发消息请先从黑名单拉出");
      } else {
        mysq.ut.query(
          `select * from ${str.who}f WHERE fid='${str.user}';`,
          (err, x) => {
            if (x == undefined || x.length == 0) {
              console.log("你好像不是对方的好友");
              res.send("你好像不是对方的好友");
            } else if (x[0].isfriend == 0) {
              console.log("你们还不是好友");
              res.send;
            } else if (x[0].isfriend == 2) {
              console.log("你的消息发出了，但是对方拒收了");
              res.send("你的消息发出了，但是对方拒收了");
            } else {
              // 查找对方是否在黑名单
              mysq.ut.query(
                `select * from ${str.user}f WHERE fid='${str.who}';`,
                (err, y) => {
                  // 插入自己
                  // console.log(y)
                  // console.log(x)
                  console.log("拉取数据错误：" + err);
                  mysq.ut.query(
                    `insert into ${req.body.user} values(?,?,?,?,?)`,
                    [str.user, y[0].id, str.msgs, 1, 0],
                    (err, s) => {
                      // res.send(r);
                      // console.log(err);
                      console.log("推送数据错误1：" + err);
                    }
                  );
                  // 插入对方
                  mysq.ut.query(
                    `insert into ${req.body.who} values(?,?,?,?,?)`,
                    [str.who, y[0].id, str.msgs, 1, 1],
                    (err, s) => {
                      // res.send(r);
                      console.log("推送数据错误2：" + err);
                      console.log(err);
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

// 添加好友
// 当前用户：user
// 目标好友：who
// 验证信息：msgs
router.post("/gofrd", (req, res) => {
  console.log("--------加好友申请--------");
  var str = req.body;
  // 确认好友是否已经为好友
  mysq.ut.query(
    `select * from ${str.who} WHERE id='${str.user}';`,
    (err, r) => {
      if (r == undefined || r.length == 0) {
        console.log(`好友添加:${str.user} -=> ${str.who}`);
        console.log("验证信息:" + str.msgs);
        // 发送加好友请求
        mysq.db.query(
          `insert into fired values(?,?,?)`,
          [str.user, str.who, str.msgs],
          (err, x) => {
            console.log("状态:发送成功");
          }
        );
        // 获取发送者信息
        mysq.db.query(
          `select * from user where id = "${str.user}"`,
          (err, a) => {
            // 接收者的信息
            mysq.db.query(
              `select * from user where id = "${str.who}"`,
              (err, b) => {
                // console.log(a);
                // 发送者的信息
                // console.log(b);
                // 接收者的信息
                // 迁移用户数据
                mysq.ut.query(
                  `insert into ${str.user + "f"} values(?,?,?,?,?)`,
                  [a[0].id, a[0].name, b[0].name, b[0].id, 0],
                  (err, aa) => {
                    // res.send(r);
                    console.log("拉取数据错误：" + err);
                    // console.log(str.user,a[0].id, a[0].name, b[0].name, b[0].id, 0);
                  }
                );
                // 把数据推过去
                mysq.ut.query(
                  `insert into ${str.who + "f"} values(?,?,?,?,?)`,
                  [b[0].id, b[0].name, a[0].name, a[0].id, 0],
                  (err, bb) => {
                    console.log("推送数据错误：" + err);

                    // console.log(str.user,b[0].id, b[0].name, a[0].name, a[0].id, 0);
                  }
                );
                // 打印测试表名
                // console.log(`${str.who + "f"},${str.user + "f"}`);
                // 打印日志
                console.log("数据迁移成功");
              }
            );
          }
        );
      } else {
        console.log("用户已经发送过了申请或者已经是好友了-=>返回错误");
        res.send("你已经发送过了或者已经是好友了");
      }
    }
  );
});

// 获取好友申请
// 传入数据
// 当前用户：user
// 目标好友：who
router.post("/gofriendlist", (req, res) => {
  console.log("--------用户获取申请--------");
  var str = req.body;
  // 匹配密码是否正确
  mysq.db.query(`select * from user where id = "${str.user}"`, (err, r) => {
    // console.log(r[0].password);
    // 验证密码
    if (r[0].password == str.password) {
      // 密码正确执行去找好友申请
      mysq.db.query(
        `select * from fired where id = "${str.user}"`,
        (err, x) => {
          // console.log(r[0].password);
          // 验证密码
          console.log("获取数据：");
          console.log(x);
          res.send(x);
        }
      );
    } else {
      console.log("用户验证失败-=>推送重新登录");
      res.send("验证失败请重新登录");
    }
  });
  // 确认好友列表是否存在
});

// 通过好友申请
// 传入数据
// 当前用户：user
// 目标好友：who
router.post("/gofriend", (req, res) => {
  console.log("--------用户通过申请--------");
  var str = req.body;
  // 匹配密码是否正确
  mysq.db.query(`select * from user where id = "${str.user}"`, (err, r) => {
    // console.log(r[0].password);
    // 验证密码
    if (r[0].password == str.password) {
      // 密码正确执行去找好友申请
      console.log("用户验证成功");
      mysq.db.query(
        `select * from fired where id = "${str.user}"`,
        (err, x) => {
          // console.log(r[0].password);
          // 验证密码
          if (x.length > 0) {
            // UPDATE startrrf SET isfriend=1 WHERE fid='tao';
            // 修改用户好友状态
            mysq.ut.query(
              `UPDATE ${str.user}f SET isfriend=1 WHERE fid='${str.who}';`,
              (err, a) => {
                console.log("推送好友申请" + err);
              }
            );
            mysq.ut.query(
              `UPDATE ${str.who}f SET isfriend=1 WHERE fid='${str.user}';`,
              (err, b) => {
                console.log("添加自己错误" + err);
              }
            );
            // 移除好友申请
            var c = "`";
            var int = `DELETE FROM ${c}fired${c} WHERE gid='${str.who}' and id='${str.user}'`;
            mysq.db.query(
              // DELETE FROM `fired` WHERE gid='tao' and id='startrr'
              int,
              (err, z) => {
                // 移除好友申请
                console.log("添加对方错误" + err);
              }
            );
          } else {
            console.log("没有查到用户相关信息");
            res.send("无");
          }
        }
      );
    } else {
      console.log("用户验证失败-=>推送重新登录");
      res.send("验证失败请重新登录");
    }
  });
  // 确认好友列表是否存在
});

// 请求消息
// 传入数据
// 当前用户：user
// 当前用户密码：password
router.post("/reqmasg", (req, res) => {
  var str = req.body;
  mysq.ut.query(`select * from ${str.user}`, (err, r) => {
    res.send(r);
  });
  // 确认好友列表是否存在
});

// 获取好友列表
// 传入数据
// 当前用户：user
// 当前用户密码：password
router.post("/requsertable", (req, res) => {
  var str = req.body;
  mysq.db.query(`select * from user where id = "${str.user}"`, (err, r) => {
    // 验证密码
    if (r.length == 0) {
      res.send(r);
      console.log("用户身份验证失败");
    } else {
      console.log(err);
      console.log(r[0].password, str.password);
      if (r[0].password != str.password) {
        console.log;
        res.send("获取失败请重新登录");
        console.log("用户身份验证失败");
        console.log(2);
      } else {
        console.log(3);
        mysq.ut.query(`select * from ${str.user}f`, (err, r) => {
          res.send(r);
          console.log(r);
        });
      }
    }
  });
  // 确认好友列表是否存在
});

// 根据id求用户信息
// 当前用户：user
// 当前用户密码：password
router.post("/requsers", (req, res) => {
  var str = req.body;
  mysq.db.query(`select * from user where id = "${str.user}"`, (err, r) => {
    var data = {
      ico: r[0].ico,
      id: r[0].id,
      name: r[0].name,
      sex: r[0].sex,
      vip: r[0].vip,
      mail: r[0].mail
    };
    res.send(data);
  });
  // 确认好友列表是否存在
});
// ico/id/name/sex/vip/
//导出该路由
module.exports = router;
