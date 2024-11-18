//每页显示十条数据
var perPage = 10;
var currentPage;
var totalPage;
var dataFromDB;


var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws.send("database1page is opened");
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
  //check TCP server是否已经启动    //UDP
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


//连接前后端数据库的websocket
var ws_db = new WebSocket("ws://localhost:3005"); //与后端数据库相关的websocket
ws_db.onopen = function(){
  // Web Socket 已连接上，使用 send() 方法发送数据
  ws_db.send("database1page is opened");
  console.log("websocket between databasepage1 with db opening...");
};

//处理接收到的信息
ws_db.onmessage = function(evt){
  dataFromDB = JSON.parse(evt.data);//evt.data数据格式为string
  totalPage = Math.ceil(dataFromDB.length / perPage);
  goToPage(1);  
};

//处理错误信息
ws_db.onerror = function(evt){
  console.log("websocket error:" + evt.error);
};

ws_db.onclose = function(){
  console.log("连接数据库已关闭...");
};




//处理点击页码按钮时的数据
function goToPage(currentPage){
  // currentPage1 = currentPage;
  console.log('跳转到第 ' +  currentPage + '页');
  // 获取表格的tbody元素，用于后续清空和添加数据 
  var tableBody = document.getElementById('tableBody');
  // 清空tbody元素的内容，准备填充新的数据
  tableBody.innerHTML = ''; 

  // 根据当前页码计算数据的起始索引和结束索引  
  var startIndex = (currentPage - 1) * perPage;
  var endIndex = startIndex + perPage; 

  // 渲染当前页的数据到表格中
  for (let i = startIndex; i < endIndex && i < dataFromDB.length; i++) { 
    // 获取当前索引对应的数据项
    var item = dataFromDB[i];
    if(item){
      // 创建一个新的表格行元素
      var row = document.createElement('tr');  
      // 设置表格行的内容，包括各个数据项
      row.innerHTML = `  
      <td>${item.ExperimentalPeriod}</td>
      <td>${item.Experimenter}</td>
      <td>${item.ReagentName}</td>
      <td>${item.Concentration}</td>
      <td>${item.FlowVelocity}</td>
      <td>${item.ReactorTemperature}</td>
      <td>${item.ReactorVolume}</td>
      <td>${item.ReactionTime}</td>
      <td>${item.ProductivityRate}</td>
      <td>${item.PercentConversion}</td>  
      `;  
      // 将新的表格行添加到tbody元素中 
      tableBody.appendChild(row);
    }   
  } 
  // 重新渲染分页控件，显示当前页码和总页数 
  renderPagination(currentPage, totalPage);
}


//渲染分页控件的函数
function renderPagination(currentPage, totalPage){
  console.log('分页里面currentPage1:' + currentPage);
  var paginationHtml = [];

  paginationHtml.push(`<button onclick="goToPage(${1})">首页</button>`);
  //添加上一页的按钮
  if(currentPage > 1){
    paginationHtml.push(`<button onclick="goToPage(${currentPage - 1})">上一页</button>`);
  }
  if(totalPage <= 4){
    for(let i = 1; i <= totalPage; i++ ){
      paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
    }
  }
  else{//totalPage > 4
    if(currentPage <= 3){//前三页{1、2、3、4、...、11、12}    12页为例
      for(let i = 1; i <= 4; i++ ){
        paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
      }
      paginationHtml.push('<button>...</button>');
      for(let i = (totalPage - 1); i <= totalPage; i++ ){
        paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
      }
    }

    else if((currentPage > 3) && (currentPage <= totalPage - 3)){
      paginationHtml.push('<button>...</button>');
      for(let i = currentPage - 2; i <= currentPage + 1; i++ ){
        paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
      }
      paginationHtml.push('<button>...</button>');
      for(let i = (totalPage - 1); i <= totalPage; i++ ){
        paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
      }
    }

    else if((currentPage > totalPage - 3) && (currentPage <= totalPage)){
      paginationHtml.push('<button>...</button>');
      for(let i = currentPage - 3; i <= totalPage; i++ ){
        paginationHtml.push(`<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`);
      }
    }
  

  }


  // 添加“下一页”按钮（如果当前页不是最后一页）  
  if (currentPage < totalPage) {  
    paginationHtml.push(`<button onclick="goToPage(${currentPage + 1})">下一页</button>`);  
  } 

  paginationHtml.push(`<button onclick="goToPage(${totalPage})">末页</button>`);

  // 获取分页控件容器元素，并设置其HTML内容
  var paginationContainer = document.getElementById('pagination-container');  
  paginationContainer.innerHTML = paginationHtml.join(''); 

}