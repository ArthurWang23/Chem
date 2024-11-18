var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws.send("database2page is opened");
}

ws.onmessage = function (evt) {
  var Msg = JSON.parse(evt.data);

};

ws.onclose = function () {
  // 关闭 websocket
  console.log("连接已关闭...");
};

//************************************************************************************************************************* */
//xy: jQuery 在文档加载后激活函数：
$(document).ready(function () {
  //check TCP server是否已经启动
  $.ajax({    //jquery ajax方法
      // url: "/checkTcpServer",   //url: "/checkUdpServer",
      // type: "GET",
      success: function (data) {
          if (data != '') {
              // var dataObj =JSON.parse(data);
              //   if(dataObj[1]=="running"){
              //     $(".btn-udp").css("display","none");
              //     $(".udp-status").text("Udp Server is running at "+dataObj[2]+":"+dataObj[3]);
              //     $(".udp-status").css("color","#449d44");
              //   }
          } else {
              // udpStatus = true;
              // startUdpServer();
              // tcpStatus = true;
              // startTcpServer();
          }
      }
  })
})

//开启UDP服务
function startUdpServer() {
  $.ajax({
      url: "/startUdpServer",
      type: "GET",
      success: function (data) {

          var dataObj = JSON.parse(data);
          //后台数据请求成功
          // if(dataObj[0]=="success"){
          //   swal("成功启动UDP Server!", "Udp Server is running at "+dataObj[2]+":"+dataObj[3], "success");
          //   $(".btn-udp").css("display","none");
          //   $(".udp-status").text("Udp Server is running at "+dataObj[2]+":"+dataObj[3]);
          //   $(".udp-status").css("color","#449d44");
          // }
      }//success
  })//ajax
}

//开启TCP服务
function startTcpServer() {
  $.ajax({
      url: "/startTcpServer",
      type: "GET",
      success: function (data) {

          var dataObj = JSON.parse(data);
          //后台数据请求成功
          // if(dataObj[0]=="success"){
          //   swal("成功启动UDP Server!", "Udp Server is running at "+dataObj[2]+":"+dataObj[3], "success");
          //   $(".btn-udp").css("display","none");
          //   $(".udp-status").text("Udp Server is running at "+dataObj[2]+":"+dataObj[3]);
          //   $(".udp-status").css("color","#449d44");
          // }
      }//success
  })//ajax
}