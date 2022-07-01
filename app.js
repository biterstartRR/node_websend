const express = require("express");
const app = express();
const useRouter = require("./routes/useRouter");
app.use(
    express
    .urlencoded
    // 把post请求转换为对象
    ()
);
app.listen(3000, () => {
    console.log("http://localhost:3000 and http:127.0.0.1:3000");
});
app.use("/user", useRouter);
app.use('/index',express.static('./public'))

