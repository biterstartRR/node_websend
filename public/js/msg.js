// var xhr = new XMLHttpRequest();
function resolveData(data) {
  var arr = [];
  for (let k in data) {
    var str = k + "=" + data[k];
    arr.push(str);
  }
  return arr.join("&");
}

function ajax(options) {
  var xhr = new XMLHttpRequest();
  var str = resolveData(options.data);
  if (options.method.toUpperCase() == "GET") {
    xhr.open(options.method, options.url + "?" + str);
    xhr.send();
  } else if (options.method.toUpperCase() == "POST") {
    xhr.open(options.method, options.url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(str);
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var result = JSON.parse(xhr.responseText);
      options.success(result);
    }
  };
}
// 操作dom
var loginto=document.getElementById("logintoserver")
var loginokbody=document.getElementById("loginokbody")
// 请求数据
function getmsg(user,password) {
  console.log("传入消息",user,password);
  var msgboxitem = [];
  var friendboxitem = [];
  //插入请求好友列表
  // 获取好友信息
  ajax({
    method: "post",
    url: "http://localhost:3000/user/requsertable",
    data: {
      user: user,
      password: password,
    },
    success: function (friends) {
      if (friends.length == 0 || friends == null) {
        alert("环境异常请重新登录");
      } else {
        console.log(friends);
        // 用好友信息来遍历
        for (i = 0; i < friends.length; i++) {
          // 获取需要的用户信息
          friendin(friends, i);
        }
      }
    },
  });
  // 获取需要的用户信息
  function friendin(friends, i) {
    ajax({
      method: "post",
      url: "http://localhost:3000/user/requsers",
      data: {
        user: friends[i].fid,
      },
      success: function (users) {
        console.log(friends[i].fid);
        endmsg(friends[i].fid, users, friends);
      },
    });
  }
  // 获取用户消息最后面的
  function endmsg(fid, users) {
    ajax({
      method: "post",
      url: "http://localhost:3000/user/reqmasg",
      data: {
        user: fid,
      },
      success: function (msgss) {
        var msgss = msgss[msgss.length - 1].text;
        // 调用插入数据的封装函数
        Innermsg(users, msgss, fid);
        console.log(users);
      },
    });
  }
  // 插入消息列表
  function Innermsg(users, msgss, fid) {
    msgboxitem += `
  <div class="usermsglist" onclick="startMsg('${fid}')">
      <img src="${users.ico}" alt="">
      <div>
          <p id="msgfriend"><b>${users.name}</b></p>
          <p id="msgtext" class="msgtext">${msgss}</p>
      </div>
  </div>
  `;
    friendboxitem += `
  <div class="userfriendlist" onclick="startMsg('${fid}')">
      <img src="${users.ico}" alt="">
      <div>
          <p id="msgfriend"><b>${users.name}</b></p>
          <p id="msgtext" class="msgtext">账号ID : ${users.id}</p>
          <p class="msgtext">性别 : ${users.sex}</p>
          <p class="msgtext">邮箱 : ${users.mail}</p>
      </div>
  </div>
  `;
    var msgdiv = document.getElementById("msg");
    var frienddiv = document.getElementById("friend");
    msgdiv.innerHTML = msgboxitem;
    frienddiv.innerHTML = friendboxitem;
  }
}
// 定义亲求内容
function startMsg(x) {
  console.log(x);
}
function loginusers() {
  var username = document.getElementById("user").value;
  var password = document.getElementById("pwd").value;
  if (username.length > 0 && password.length > 0) {
    ajax({
      method: "post",
      url: "http://localhost:3000/user/login",
      data: {
        username: username,
        password: password,
      },
      success: function (r) {
        if (r == 1) {
          // 成功
          alert("登录成功");
          getmsg(username,password)
          loginokbody.style.display = "block";
          loginto.style.display = "none";
        } else if (r == 2) {
          // 用户错误
          alert("密码错误");
        } else if (r == 3) {
          // 密码错误
          alert("无效的账号");
        }
      },
    });
  } else {
    alert("非法的账号密码");
  }
}
