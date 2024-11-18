var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws.send("loginpage is opened");
}

ws.onmessage = function (evt) {
  var Msg = JSON.parse(evt.data);

};

ws.onclose = function () {
  // 关闭 websocket
  console.log("连接已关闭...");
};


// xy： 账户登录退出相关jquery函数均写于此处
//xy: 用户登录界面登录功能表单提交
jQuery(document).ready(function(){
  //点击login模态框中的登录，进行登录
  $("#loginBtn").click(function(e){
    e.preventDefault();     //xy:阻止默认浏览器动作(W3C) 
    var dataToBack = $("#loginForm").serialize(); //xy: jquery ajax serialize() 方法通过序列化表单值，创建 URL 编码文本字符串,您可以选择一个或多个表单元素（比如 input 及/或 文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中。
    console.log("dataToBack:",dataToBack);
    $.ajax({
      data: dataToBack,
      url:"/login",
      type:"GET",
      success:function(data){
        dataHandler(data);
        console.log("用户账号密码表单提交成功");
      }
    })
  })
})

function dataHandler(data)
{
  switch(data)
  {
    case "User Not Found":
      console.log("用户不存在");
      $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
        title: '登陆失败',
        content: '用户不存在！',
        type:'red',
      });
      break;
    case "PassWordError": 
      console.log("密码错误");
      $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
        title: '登陆失败',
        content: '密码错误！',
        type:'red',
      });
      break;
    case "LoginSuccess": 
      console.log("登录成功");
      $.confirm({ //xy:使用jquery-confirm 的confirm弹窗弹出消息
        title: 'The login process was successful！',
        // content: '用户不存在！',
        type:'green',
        buttons:{
          Continue:function(){
            window.location.replace("/index");
          }
        }
      });
      
      break;
  }
}
