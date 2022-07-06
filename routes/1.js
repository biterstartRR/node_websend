// 发送消息
// 当前用户：user
// 目标好友：who
// 消息：msgs

// router.post("/tomsgs", (req, res) => {
//   var str = req.body;
//   var x = "`";
//   var mian = `select * from ${x + req.body.user + x} where name = ?`;
//   mysq.db.query(mian, [str], (err, r) => {
//     res.send(r);
//     console.log(r);
//   });
// });

// mysq.db.query(`select * from emp`, (err, r) => {
//   res.send(r);
// });

// 添加消息
// INSERT INTO `startrr` (`who`, `id`, `text`, `time`, `inou`, `isfriend`) VALUES ('涛哥', 'tao', '有时间来八宝山卖煎饼啊', '2022-07-04 13:59:34', '0', '1');
// 发送验证消息
// INSERT INTO `fired` (`id`, `gid`, `msg`) VALUES ('tao', 'startrr', '加个好友小哥哥')
// 添加伪信息
// INSERT INTO `startrrf` (`id`, `who`, `friend`, `fid`, `isfriend`) VALUES ('startrr', '小山', '涛哥', 'tao', '0');
var x="`"
var fox =
  "INSERT INTO" +
  ` ${x + str.id + x} ` +
  "(`id`, `who`, `friend`, `fid`, `isfriend`) VALUES ('startrr', '小山', '涛哥', 'tao', '0')";
console.log(fox)

mysq.db.query(
  `insert into ${str.id} values(?,?,?,?,?)`,
  [a[0].id,a[0].name,b[0].name,b[0].name,0],
  (err, r) => {
    // res.send(r);
    console.log(r);
  }
);
  // mysq.ut.query(fox, (err, r) => {
//   // res.send(r);
//   console.log(r);
// });
// 当前用户：user
// 目标好友：who
// 验证信息：msgs
