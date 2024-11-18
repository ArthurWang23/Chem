
// //--------------------全局变量声明区 begin---------------------------------------
var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
const m_3004 = localStorage.getItem('latestMessage');
const TcpControlMessage = 2;
console.log('Received message:llllllllllll',m_3004);
var ws_onopen = false;
var wsMsg_Mode; 
var BackCurrentState;//根据后端更新数据，实时获得当前后端状态机状态
//子网id
const NetId0 = 0x40;
const NetId1 = 0x40;
const NetId2 = 0x40;
const NetId3 = 0x40;
//设备类型
const Bump_code = 0;   
const Valve_code = 1;
const HeatChip_code = 2;
const Bottle_code = 3;
const PressureSensor_code = 4;

const Bump_type = 0;   
const Valve_type = 1;
const HeatTmp_type = 2;

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_1_0={MsgType: 1,FuncType:0}      //==0, 向后端询问当前模式
// 接受后端websocket数据并用于数据处理的对象
var wsMsg_ToShowRegularly;    // 用于实时跟新界面参数
var wsMsg_ToBack_1_1={MsgType: 1 ,FuncType:1 };            //==1, 定时向后端索要界面各个参数
var wsMsg_ToBack_2_0={
  MsgType:2,    //自动模式消息包
  FuncType:0  //功能：设置实验模式为自动模式
};
var wsMsg_ToBack_2_1={
  MsgType:2,    //自动模式消息包
  FuncType:1  //功能：前端点击开始试验
};

var wsMsg_ToBack_2_2={
  MsgType:2,    //自动模式消息包
  FuncType:2  //功能：前端点击暂停试验
};
var wsMsg_ToBack_2_3={
  MsgType:2,    //自动模式消息包
  FuncType:3  //功能：前端点击结束试验
};
var wsMsg_ToBack_2_4={
  MsgType:2,    //自动模式消息包
  FuncType:4  //功能：前端点击退出自动模式
};
//当前实验模式
var mode = "无";
var mode_known = true;   //标志是否已从后端获取状态模式，若已获取为true；
// echart画表格所需变量：
var option1 = {
  backgroundColor: '#ffffff', 
  title: {
    text: '',
    //text: '压力曲线图',
    textStyle: {  
      color: '#366cb4'   
    }  
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['sensor 1', 'sensor 2'],
    textStyle: {  
      // color: '#ffffff'   
      color: '#000000',  
    }  
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      dataView:{},
      saveAsImage: {}      
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [1,2,3,4,5,6,7],
    axisLabel: {  
      // color: '#ffffff'  // 这里设置标签颜色
      color: '#000000',    
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {  
      // color: '#ffffff'  // 这里设置标签颜色  
      color: '#000000',  
    },
    name: 'Pressure/mbar',
    nameTextStyle: {  // 添加这一行来设置 y 轴名称的文本样式  
      // color: '#ffffff'  ,
      color: '#000000',  
      fontWeight:'bold',
      fontStyle:'italic' 
    }, 
    splitLine:{     // 背景虚线
      show: true,
      lineStyle:{
        color: '#636566',
        type:'dashed'
      } 
    }
  },
  series: [
    {
      name: 'sensor 1',
      type: 'line',
      smooth: 'true',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'sensor 2',
      type: 'line',
      smooth: 'true',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ],
  dataZoom: [  
                {  
                    type: 'slider',  // 使用滑动条类型的数据区域缩放组件  
                    show: true,      // 显示滑动条  
                    bottom: '0%',       // 滑动条位置，可以在这里调整位置  
                    start: 0,         // 初始位置，这里设置为0，表示初始时滑动条在左边  
                    end: 100           // 结束位置，这里设置为50，表示滑动条可以滑动的范围是数据的50%  
                }  
]
};
var option2 = {
  // backgroundColor: '#ffffff', // 设置背景颜色为白色
  backgroundColor: 'rgba(255, 255, 255, 1)',
  title: {
    //text: '温度曲线图',
    text: '',
    textStyle: {  
      color: '#366cb4'   
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Heater1-1', 'Heater1-2', 'Heater2-1', 'Heater2-2'],
    textStyle: {  
      // color: '#ffffff'  
      color: '#000000',
    } 
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      dataView:{},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1', '2', '3', '4', '5', '6', '7'],
    axisLabel: {  
      // color: '#ffffff'  // 这里设置标签颜色  
      color: '#000000'  // 这里设置标签颜色 
    }
  },
  yAxis: {
    type: 'value',
    scale: true,
    max:150,
    min:0,
    splitNumber: 5, 
    axisLabel: {  
      // color: '#ffffff',  // 这里设置标签颜色
      color: '#000000',  // 这里设置标签颜色
      //formatter: '{value} °C'  
    },
    name: 'T/°C',
    nameTextStyle: {  // 添加这一行来设置 y 轴名称的文本样式  
      // color: '#ffffff' ,
      color: '#000000',  
      fontWeight:'bold',
      fontStyle:'italic'  
    },
    splitLine:{     // 背景虚线
      show: true,
      lineStyle:{
        color: '#636566',
        type:'dashed'
      } 
    }
  },
  series: [
    {
      name: 'Heater1-1',
      type: 'line',
      // stack: 'Total',
      smooth: 'true',
      // yAxisIndex: 0, // 设置该系列对应第一个y轴  
      data: [20, 33, 46, 67, 88, 99, 100]
    },
    {
      name: 'Heater1-2',
      type: 'line',
      // stack: 'Total',
      smooth: 'true',
      // yAxisIndex: 0, // 设置该系列对应第一个y轴  
      data: [22, 31, 52, 65, 83, 98, 100]
    },
    {
      name: 'Heater2-1',
      type: 'line',
      // stack: 'Total',
      smooth: 'true',
      // yAxisIndex: 0, // 设置该系列对应第一个y轴  
      data: [21, 35, 50, 70, 90, 100, 101]
    },
    {
      name: 'Heater2-2',
      type: 'line',
      // stack: 'Total',
      smooth: 'true',
      // yAxisIndex: 0, // 设置该系列对应第一个y轴  
      data: [18, 29, 52, 71, 86, 97, 100]
    }
  ],
  dataZoom: [  
                {  
                    type: 'slider',  // 使用滑动条类型的数据区域缩放组件  
                    show: true,      // 显示滑动条  
                    bottom: '0%',       // 滑动条位置，可以在这里调整位置  
                    start: 0,         // 初始位置，这里设置为0，表示初始时滑动条在左边  
                    end: 100           // 结束位置，这里设置为50，表示滑动条可以滑动的范围是数据的50%  
                }  
]
};
var pressure_echart ;
var tempreture_echart ;
var Msg_LastInfo;//记录上一次后端穿来的错误信息
var Msg_CurrentInfo;//记录这一次后端传来的错误信息
var Active_nodes=[]
var Active_edges=[]

//--------------------全局变量声明区 end---------------------------------------
ws.onopen = function () {
  console.log("webSocket opening...");
  ws_onopen = true;
  // 向后端询问当前模式并以此更新页面 //jyh:mode_known标志是否已从后端获取状态模式，若已获取为true；
  if(mode_known == false){
    var jsonString = JSON.stringify(wsMsg_ToBack_1_0);//向后端询问当前模式
    ws.send(jsonString);
  }
  // 定时发送信息索要更新数据
  var jsonString = JSON.stringify(wsMsg_ToBack_1_1);//定时向后端索要界面各个参数
  // 每隔2s索要一次数据,调用一个定时器
  let intervalId = setInterval(function() {  
    ws.send(jsonString);  
  }, 2000);
  //停止该定时器调用：clearInterval(intervalId);
  if (m_3004){
    parsedMessage = JSON.parse(m_3004)
    loadDefaultJson(0).then(data => {
      ws.send(JSON.stringify({
          'additionalText': "3002",
          'data_H': data,
          'data_G':parsedMessage
      }));
      localStorage.removeItem('latestMessage');
    }).catch(error => {
        console.error('Error loading data:', error);
    });
  }else{
    ws.send("processing page is opened")
    loadDefaultJson()
  } 
}

ws.onmessage = function (evt) {
  var Msg = JSON.parse(evt.data);
  console.log('控制界面收到后端发送的消息：',Msg);
  switch(Msg.MsgType){
    case 0:     //Msg.MsgType=0，后端向前端报错
        //修改弹窗问题
      Msg_LastInfo = Msg_CurrentInfo;
      Msg_CurrentInfo = Msg.errInfo;
      if(Msg_CurrentInfo == Msg_LastInfo){
      }else{
        switch(Msg.errType){
          case 0: //子网初始化错误
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '系统初始化失败',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          case 1: //实验尚未结束就请求结果数据
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '暂无实验结果',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          case 2: //上位机失去与下位机的tcp连接
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '连接失败',
              content: Msg.errInfo,
            type:'red',
            });
            break;
          case 3: //上位机失去与matlab的websocket连接
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '连接失败',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          case 4: //阈值警报
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '阈值报警',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          case 5: //设备错误
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '设备错误',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          default:
            break;
        }
      }
      break;
    case 1:     //Msg.MsgType = 1用来实时显示界面各个参数的数据包
      if(Msg.FuncType == 0){          //判断当前实验模式
        if(mode_known == false){
          mode_known = true;
          mode = Msg.mode;
          // ChooseMode_Disp(mode);
          console.log("当前实验模式：",mode);
        }
      }else if(Msg.FuncType == 1){  //实时更新界面各个参数
        wsMsg_ToShowRegularly = Msg;
        BackCurrentState = Msg.BackCurrentState;//后端状态机状态
      }
      break;
    case 2:     //Msg.MsgType = 2后端向前端汇报自动模式进度
      switch(Msg.FuncType){
        case 1:// 自动模式下web前端点击开始试验的回馈
          //操作成功
          if(Msg.success == true){
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
          }
          //操作失败
          else {
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        // 自动模式下点击开始清理的反馈
        case 2:
          //操作成功
          if(Msg.success == true){            
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
          }
          //操作失败
          else{
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        //自动模式下点击紧急停止的反馈
        case 3:
          //操作成功
          if(Msg.success == true){
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
          }
          //操作失败
          else{
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        //自动模式下点击退出自动模式的反馈
        case 4:
          //操作成功
          if(Msg.success == true){
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
            ChooseMode_Disp('无');
          }
          //操作失败
          else{
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        default:
          break;
      }
      break;
    case 3:     //Msg.MsgType = 3后端向前端汇报手动模式进度
      switch(Msg.FuncType){
        //手动模式下web前端点击初始化的反馈
        case 1:
          //操作成功
          if(Msg.success == true){
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
            // 恢复参数设置按键
          } 
          break;
        //手动模式下web前端点击清洗仪器的反馈
        case 2:
          //操作成功
          if(Msg.success == true){            
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
            // // 隐藏body card中手动模式的按钮
            // const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
            // for(var i=0; i<ManuElemID.length; i++)
            // {
            //   var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
            //   var btn = document.getElementById(elemID);
            //   btn.style.display = 'none';
            // }
            // 禁用参数设置按键
          }
          //操作失败
          else if(Msg.success == false){
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        //手动模式下web点击退出手动模式的反馈
        case 3:
          //操作成功
          if(Msg.success == true)
          {
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'green',
            });
            ChooseMode_Disp('无');
          }
          //操作失败
          else if(Msg.success == false)
          {
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: 'Note',
              content: Msg.MsgInfo,
              type:'red',
            });
          }
          break;
        //下位机回复uart收到的消息
        case 4:  //***wait
          //串口消息更新
          // var uart_R = document.getElementById('uartOutput');
          // uart_R.textContent = "接收到串口信息：" + Msg.MsgInfo;
          
          // if(){//**wait 判断Msg.MsgInfo是否是注射或吸取成功
          //   var msg={
          //     MsgType:3,    //手动模式消息包
          //     FuncType:6,  //功能：请求退出手动模式
          //     data:'suction success'
          //   };
          //   var jsonString = JSON.stringify(msg);
          //   ws.send(jsonString);
          // }else if(){


          // }else{
          //   $.dialog({ 
          //     title: 'Note',
          //     content: Msg.MsgInfo,
          //     type:'red',
          //   });
          //   var msg={
          //     MsgType:3,    //手动模式消息包
          //     FuncType:6,  //功能：请求退出手动模式
          //     data:'failure'
          //   };
          //   var jsonString = JSON.stringify(msg);
          //   ws.send(jsonString);          
          // }
          break;
        default:
          break;
      }      
      break;
    case 4:      //graph 映射
      const values = Object.values(Msg.data);
      var active=[]
      var active_edge=[]
      let allMatchFailed = true;
      let matchFailed=true
      values.forEach(value => {
        var match_result = value['match_result'];
        if (match_result != 'No subgraph isomorphism found.') {
          console.log('///////',active,match_result)
          for (let i = 0; i < match_result.length; i++) {
            let intersection = match_result[i]['possible_paths'].filter(item => active.includes(item))  
            if (intersection.length === 0) {
              var H_deepcopy_data = match_result[i]['H_deepcopy_data']; // 直接访问第一个元素
              loadCanvasFromJson(H_deepcopy_data,active,active_edge);
              active.push(...match_result[i]['possible_paths'])
              active_edge.push(...match_result[i]['possible_edges'])
              Active_nodes.push(match_result[i]['possible_paths'])
              Active_edges.push(match_result[i]['possible_edges'])
              console.log('qqqqqqqq',active_edge,match_result[i]['possible_edges'])
              allMatchFailed = false;
              matchFailed=false
              break   
            }else{
              allMatchFailed = true;
            }
          }
          if (allMatchFailed) {
            info={
              MsgType:6,
              headline:'wait device OK',
              description:value,
              tag:value['product']
            }
            ws.send(JSON.stringify(info))
          }
        }else{
          info={
            MsgType:6,
            headline:'No subgraph',
            description:value,
            tag:value['product']
          }
          ws.send(JSON.stringify(info))
        }    
      });
      if(matchFailed){
        alert('No subgraph isomorphism found for all routes! ')
        loadDefaultJson()
      }
      
      // values.forEach(value => {
      //   var match_result=value['match_result']
      //   if(match_result!='No subgraph isomorphism found.'){
      //     match_result.forEach(value => {
      //       var H_deepcopy_data=value['H_deepcopy_data']
      //       loadCanvasFromJson(H_deepcopy_data)
      //       console.log(value);
      //       break
      //   });
      //   }
      // }
      // )
      //   updata=Msg

    default:
      break;
  }
};

ws.onclose = function () {
  console.log("控制界面连接已关闭...");
};

// //************************************************************************************************************************* */
//xy: jQuery 在文档加载后激活函数：
$(document).ready(function () { //check TCP server是否已经启动
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
  InitEchart();
  setInterval(RefreshParamPeriodly,1500); //每1s更新一次系统参数
  ChooseMode_Disp(mode);  //此时界面已经加载好，之后才会显示模式选择按钮。因此界面点击模式按钮触发此函数不影响mode   
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
// //------------------------- 不同模式下的界面调整 begin ------------------------------
//根据点击的按钮进入相应模式，修改界面
function ChooseMode_Disp(modeid){
  var btn1 = document.getElementById('AutoProcBtn')
  var btn2 = document.getElementById('ManuProcBtn')
  var btn3 = document.getElementById('AutoB')
  var btn4 = document.getElementById('ManualB')
  if(mode_known == false){
    var jsonString = JSON.stringify(wsMsg_ToBack_1_0);
    ws.send(jsonString);
  }
  else{
    if(modeid=='自动模式'){ //自动模式 
      console.log("进入自动模式");
      btn1.style.display = 'block';
      btn2.style.display = 'none';
      btn3.style.display = 'none';
      btn4.style.display = 'none';
      manualsetbutton(true)
      var data=saveCanvas(1)
      //设置后端实验模式
      let mergedDict = Object.assign({}, data, wsMsg_ToBack_2_0);
      var jsonString = JSON.stringify(mergedDict);
      ws.send(jsonString);
    }
    else if(modeid=='手动模式'){ //手动模式
      console.log("进入手动模式");
      btn1.style.display = 'none';
      btn2.style.display = 'block';
      btn3.style.display = 'none';
      btn4.style.display = 'none';
      manualsetbutton(false)
      var data=saveCanvas(1)
      // if(BackCurrentState==1)
      // {
       
      //   //显示串口
      //   var uartContainer = document.getElementById('uartContainer');
      //   uartContainer.style.display = 'block';
      // }
      //设置后端实验模式
      var msg={
        MsgType:3,  
        FuncType:0  //功能：设置实验模式为手动模式
      };
      let mergedDict = Object.assign({}, data, msg);
      var jsonString = JSON.stringify(mergedDict);
      ws.send(jsonString);
    }
    else if(modeid == "无") {
      console.log("无");
      btn1.style.display = 'none';
      btn2.style.display = 'none';
      btn3.style.display = 'block';
      btn4.style.display = 'block';
      manualsetbutton(true)
    }
  } 
}

function generate_instrctions(Active_nodes){
  var device_valve=`${TcpControlMessage}`
  var device_chip=`${TcpControlMessage}`
  var device_pump_s=`${TcpControlMessage}`
  var device_pump_i=`${TcpControlMessage}`
  var device_pump_s_clean=`${TcpControlMessage}`
  var device_pump_i_clean=`${TcpControlMessage}`

  if(Active_nodes.length!=0){
    for (let i = 0; i < Active_nodes.length; i++){
      var nodes_to_run=Active_nodes[i]
      for (let i = 0; i < nodes_to_run.length; i++){
        const node = document.getElementById(nodes_to_run[i]);
        var device=node.getAttribute('data-id1')
        if(device=='valve'){
          var inst_valve=`@${Valve_type}${node.getAttribute('data-id')}${node.getAttribute('data-outlet_channel')}@`
          device_valve= `${device_valve}${inst_valve}`
        }else if(device=='heat_chip'){
          var tmp = Number(node.getAttribute('data-react_temp___')); 
          var inst_heatchip=`@${HeatTmp_type}${node.getAttribute('data-id')}${node.getAttribute('data-heating_rate')}${tmp}@`                                             
          device_chip= `${device_chip}${inst_heatchip}`
        }else if(device=='pump'){
          let devID_s=node.getAttribute('data-id')
          let devPort_s=node.getAttribute('data-channel1')
          let devVelocity_s=node.getAttribute('data-velocity1_step_s_')
          let devPosition_s=node.getAttribute('data-position1_step_')
          let devPort_i=node.getAttribute('data-channel2')
          let devVelocity_i=node.getAttribute('data-velocity2_step_s_')
          let devPosition_i=node.getAttribute('data-position2_step_')
          var command_s = `@${Bump_type}${devID_s}${devVelocity_s}${devPosition_s}${devPort_s}@`;
          var command_i = `@${Bump_type}${devID_s}${devVelocity_i}${devPosition_i}${devPort_i}@`;
          device_pump_s= `${device_pump_s}${command_s}`
          device_pump_i= `${device_pump_i}${command_i}`
          // 清洗
          var command_s_clean = `@${Bump_type}${devID_s}${devVelocity_s}${devPosition_s}1@`;
          var command_i_clean = `@${Bump_type}${devID_s}${devVelocity_i}${devPosition_i}1@`;
          device_pump_s_clean= `${device_pump_s_clean}${command_s_clean}`
          device_pump_i_clean= `${device_pump_i_clean}${command_i_clean}`
        }
      }
    }
  }
  return device_valve,device_chip,device_pump_s,device_pump_i,device_pump_s_clean,device_pump_i_clean
}

// //------------------------- 不同模式下的界面调整 end ------------------------------
// //#################################################################################

// //设置瓶子类设置按钮的使能
// function SettingBottlesAble(flag)
// {
//   const bottlesElemId = [1,2,6,8,11,16,18,19,21,22,25,28,29];
//   if(flag == "enable")
//   {
//     for(var i=0; i<bottlesElemId.length; i++)
//     {
//       //使用模板字符串 
//       var elem = `elem${bottlesElemId[i]}_SetBtn`;
//       var btn = document.getElementById(elem);
//       btn.disabled = false;
//       console.log(elem);
//     }
//   }
//   else if(flag == "disable")
//   {
//     for(var i=0; i<bottlesElemId.length; i++)
//     {
//       //使用模板字符串 
//       var elem = `elem${bottlesElemId[i]}_SetBtn`;
//       var btn = document.getElementById(elem);
//       btn.disabled = true;
//     }
//   }
// }


// //#################################################################################
// //------------------------- 自动模式功能函数 begin --------- --------------------------
//开始自动模式实验
function StartAutoExp()
{ var coms_valve,coms_chip,coms_pump_s,coms_pump_i,coms_pump_s_clean,coms_pump_i_clean=generate_instrctions(Active_nodes)
  console.log('NNNNNNN',coms_valve,coms_chip,coms_pump_s,coms_pump_i,coms_pump_s_clean,coms_pump_i_clean)
  var msg={
    MsgType:2,    //自动模式消息包
    FuncType:1,  //功能：开始自动模式 
    coms_valve:coms_valve,
    coms_chip:coms_chip,
    coms_pump_s:coms_pump_s,
    coms_pump_i:coms_pump_i,
    coms_pump_s_clean:coms_pump_s_clean,
    coms_pump_i_clean:coms_pump_i_clean,
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

//点击紧急停止按钮
function UrgentStopFunc()
{
  var msg={
    MsgType:2,  
    FuncType:3 
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

// //#################################################################################
// //------------------------- 手动模式功能函数 begin --------- -----------------------

//手动模式下发送泵的串口*********************************
// function SendUart()
// {
//   var uartText = document.getElementById('uartInput').value;
//   if(uartText.length>60)
//   {
//     $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
//       title: 'Note',
//       content: '请勿输入超过60个字符',
//       type:'red',
//     });
//   }
//   else{
//     var msg = {
//       MsgType:3,
//       FuncType:6,
//       UartText:uartText
//     };
//     var jsonString = JSON.stringify(msg);
//     ws.send(jsonString);
//   } 
// }

let deletenode=null;
// let nodes = document.querySelectorAll('.node');
let columnContainer = document.querySelector('.column3');

jsPlumb.ready(function() {
  console.log(',,,,,,,,,,',jsPlumb.version)
  const canvas = document.getElementById('canvas2');  // 获取画布元素（画布是用于放置和连接节点的区域）
  const container = document.getElementById('container_canvas');
  let scale = 1; // 缩放比例
  let isDragging = false;
  let startX, startY;
 
  let pendingDx = 0, pendingDy = 0;
  let animationFrameRequested = false;
  
  // Allow dragging from toolbar
  const tools = document.querySelectorAll('.tool');
  tools.forEach(tool => {
      tool.addEventListener('dragstart', function(e) {
          // 将工具的 ID 存储到数据传输中
          e.dataTransfer.setData('text/plain', this.id);  
      });
  });

  // Allow dropping into canvas
  canvas.addEventListener('dragover', function(e) {
    e.preventDefault();  
  });

  canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left)/scale;
    const mouseY = (e.clientY - canvasRect.top)/scale;
     
    // 从数据传输中获取拖拽的工具 ID
    const draggedNodeId = e.dataTransfer.getData('text/plain');
    const draggedTool = document.getElementById(draggedNodeId);
    var addtionalattributes=getCardValues(draggedNodeId)
    // 深度克隆原始工具节点（包括内容和所有子节点）
    var newNode = draggedTool.cloneNode(true);
    
    
    newNode.classList.add('node'); 
    newNode.style.backgroundColor = draggedTool.style.backgroundColor; // 保持背景颜色
    console.log('////////////',newNode.style.cssText)
    // 更新新节点的 ID，避免冲突
    newNode.id = 'node' + document.querySelectorAll('.node').length;
    console.log("<<<<<",newNode.id)
    newNode.style.opacity = 1;
        // 创建并添加 ID 标签
    // const idLabel = document.createElement('span');
    // idLabel.classList.add('node-id-label');
    // idLabel.textContent = newNode.id;
    // newNode.appendChild(idLabel);

    createNewCardForNode(draggedNodeId,newNode)
    // showCorrespondingCard(newNode.id)
    // setNodeAttributes(newNode,addtionalattributes)
    // console.log('jjjjj',newNode.getAttribute(''))


    // const nodeCount = document.querySelectorAll('.node').length;
    // newNode = document.createElement('div');
    // newNode.className = 'node';
    // newNode.id = 'node' + nodeCount;
    // newNode.innerHTML = 'Node ' + nodeCount;
    
    // Place the new node where it was dropped
    newNode.style.position = 'absolute';
    newNode.style.left = mouseX + 'px';
    newNode.style.top = mouseY + 'px';
    
   
    // Append the node to the canvas
    canvas.appendChild(newNode);
    
    // 记录节点初始位置
    // nodes.push(newNode);
    var nodes = document.querySelectorAll('.node');
    console.log("当前所有节点:", nodes);

    jsPlumb.draggable(newNode);
    
    
    // addMouseDownEventToNode(newNode)
    addMousedubleclickToNode(newNode)
    addMouseclickToNode(newNode)
    
    // Make the node draggable and connectable
    
    jsPlumb.makeSource(newNode, {
      anchor: 'Continuous',
      connector: ['Flowchart'],
      connectorStyle: { stroke: '#fff', strokeWidth: 2 },
      endpoint:['Dot', { radius: 2}],  // Dot endpoint with radius 7 (you can adjust the size)
      endpointStyle: { fill: '#456',visible: false }, 
      maxConnections: -1,
      allowLoopback: false,
    });

    jsPlumb.makeTarget(newNode, {
      anchor: 'Continuous',
      endpoint:  ['Dot', { radius: 2}],  // Dot endpoint with radius 7 (you can adjust the size)
      endpointStyle: { fill: '#456',visible: false },  // Ensures the rectangle endpoint is filled with color
      maxConnections: -1,  // Allows unlimited connections
      allowLoopback: false,  
    });
 
  });

  jsPlumb.bind('click', function(conn) {
      console.log('连接线被点击！');
  });


  // Handle node connections
  jsPlumb.bind('connection', function(info) {
    console.log('Connected:', info.sourceId, '->', info.targetId);
    var connection = info.connection;

    // // 更改连接线的样式
    // connection.setPaintStyle({
    //     stroke: "blue",      // 连接线的颜色
    //     strokeWidth: 4       // 连接线的宽度
    // });

    // 可选：如果你想为连接线添加箭头
    connection.addOverlay(["Arrow", { width:10, height: 0.1, location: 1 }]);
    var connectionElement = info.connection.canvas; // 或者使用 info.connection.getElement()
    connectionElement.classList.add('connector');
  });

  // 处理缩放
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? -0.2 : 0.1; // 根据滚轮方向决定缩放
    const newScale = scale + scaleAmount;
    // 检查新的缩放比例是否在限制范围内
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const minScale = Math.min(containerWidth / 2500, containerHeight / 2500); // 最小缩放比例
    const maxScale = 4; // 最大缩放比例
    
    // 限制缩放比例
    scale = Math.min(Math.max(minScale, newScale), maxScale);
    // scale = Math.min(Math.max(0.5, scale + scaleAmount), 2); // 限制缩放范围
    canvas.style.transform = `scale(${scale})`; // 应用缩放
    canvas.style.transformOrigin = '0 0'; // 设置缩放中心
    jsPlumb.repaintEverything(); // 重新绘制连接线
  });

  // // 更新节点的大小和位置
  // const nodes = document.querySelectorAll('.node');
  // nodes.forEach(node => {
  //     node.style.transform = `scale(${1 / scale})`; // 反向缩放节点
  // });
  
  // Handle canvas dragging
  canvas.addEventListener('mousedown', function(e) {
      const target = e.currentTarget; // 或 event.target 根据情况选择
      // const target = e.target;
      if ( target.classList.contains('connector')||target.tagName==='path') {
        
        console.log('lianjiexian')
        isDragging = true;
        // 是连接线，允许对连接线进行处理，比如阻止画布拖动
        return; // 不执行画布拖动逻辑
      }
      if (target.classList.contains('node')) {  //if无法触发，因为节点没有鼠标事件
        e.stopPropagation();
        console.log('lianjiexian')
        console.log('Node clicked:', target.id);
        // 在此处理节点的 mousedown 事件
      }
      // 判断目标元素是否是连接线
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY; 
      let allCards = document.querySelectorAll('.ChemElem_Card');
      allCards.forEach(card => card.style.display = 'none');   
  });

  canvas.addEventListener('mousemove', function(e) {
      var nodes = document.querySelectorAll('.node');
      const target = e.target;
      if (target.classList.contains('node')||target.tagName=='img') {
        console.log('Node clicked:', target.id);
        // 在此处理节点的 mousedown 事件
      }
      console.log('move',isDragging)
      if (isDragging) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          canvas.scrollLeft -= dx;
          canvas.scrollTop -= dy;
          pendingDx += (e.clientX - startX) / scale;
          pendingDy += (e.clientY - startY) / scale;
          startX = e.clientX;
          startY = e.clientY;
          //  使用 requestAnimationFrame 降低频率更新
          if (!animationFrameRequested) {
              animationFrameRequested = true;
              requestAnimationFrame(() => {
                  nodes.forEach(node => {
                      const currentLeft = parseFloat(node.style.left);
                      const currentTop = parseFloat(node.style.top);
                      node.style.left = (currentLeft + pendingDx) + 'px';
                      node.style.top = (currentTop + pendingDy) + 'px';
                  });
                  pendingDx = 0;
                  pendingDy = 0;
                  animationFrameRequested = false;

                  jsPlumb.repaintEverything(); // 重新绘制连接线
              });
          }
      }
    });

  canvas.addEventListener('mouseup', function() {
      isDragging = false;    
  });

  canvas.addEventListener('mouseleave', function() {
      isDragging = false;
  });
  
});

//----------------------------------------------
function saveCanvas(num) {
  const nodesData = [];
  const connectionsData = [];

  // 获取所有节点及其属性
  const nodes = document.querySelectorAll('.node');
  console.log('xiazai ',nodes)
  nodes.forEach(node => {
    const attributes = {};
    
    // 获取节点的所有属性
    Array.from(node.attributes).forEach(attr => {
        attributes[attr.name] = attr.value;
    });

    // 在这里可以使用提取到的 attributes
    console.log('?????',attributes);
    const nodeData = {
        // id: node.id,  // 节点 ID
        // left: node.style.left,  // 节点的 left 属性（位置）
        // top: node.style.top,  // 节点的 top 属性（位置）
        // width: node.style.width,  // 节点的宽度
        // height: node.style.height,  // 节点的高度
        content: node.innerHTML,  // 节点内容
        // backgroundColor: node.style.backgroundColor,  // 背景颜色
        // tool: node.parentNode.className,
        // tool: getAllAttributes(node.parentNode),// 保存工具的所有属性
        // fontSize: node.style.fontSize,  // 节点字体大小
        // color: node.style.color,  // 节点文本颜色
        // borderRadius: node.style.borderRadius,  // 节点的圆角
        // border: node.style.border,  // 边框样式
        nodeattributes:attributes,
        endpoint: jsPlumb.getEndpoints(node).map(ep => ({
            anchor: ep.anchor.type,  // 获取端点的锚点类型
            endpointStyle: ep.getPaintStyle(), // 获取端点样式
            type: ep.endpoint.type,
            radius: ep.endpoint.radius,// 保存 endpoint 的半径
            maxConnections: -1,  // 默认值为 -1
            allowLoopback:true,      
        })) , 
        maxConnections:node.maxConnections      
    }; 
    // console.log('ttt1',node.maxConnections),
    nodesData.push(nodeData);
  });

  // 获取所有连接
  jsPlumb.getAllConnections().forEach(connection => {
    const overlaysData = [];

    // 使用 for...in 遍历所有 overlays
    const overlays = connection.getOverlays();
    for (let key in overlays) {
      const overlay = overlays[key];
      if (overlay.type === 'Arrow') {
        overlaysData.push({
          type: 'Arrow',
          location: overlay.getLocation(),
          width: overlay.width || 10,
          height: overlay.height || 0.1
        });
      }
    }

    const connData = {
      sourceId: connection.sourceId,  // 源节点 ID
      targetId: connection.targetId,  // 目标节点 ID
      paintStyle: connection.getPaintStyle(),  // 连接线样式
      connector:  connection.getConnector().type,  // 连接器类型（例如 Flowchart, Bezier）
      overlays: overlaysData,  // 保存提取的 overlays 数据
      connectorStyle: connection.connectorStyle,  // 保存 connector 样式
      // endpoint:connection.getEndpoints
      endpoints: connection.endpoints.map(ep => ({  
          type: ep.type,
          radius: ep.endpoint.radius ,// 保存 endpoint 的半径
          endpointStyle:ep.getPaintStyle(),
          maxConnections: -1,  // 默认值为 -1
          allowLoopback:true, 
          anchor:ep.anchor.type,
        
        })),  
       
    };
    // console.log('ttt',connection.endpoints.allowLoopback)
    connectionsData.push(connData);
  });

  // 组合数据
  const canvasData = {
      nodes: nodesData,
      connections: connectionsData
  };

  const jsonData = JSON.stringify(canvasData, null,3); // 格式化输出
  if (num==0){
      // 创建一个 Blob 对象
    const blob = new Blob([jsonData], { type: 'application/json' });
    // 创建一个 URL
    const url = URL.createObjectURL(blob);
    // 创建一个临时的链接元素
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvasData.json'; // 默认文件名
    // 触发点击事件以执行下载
    document.body.appendChild(a);
    a.click();
    // 清理资源
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
  }else if(num==1){
    return canvasData
  }
}

let instance;
function initJsPlumb() {
  instance = jsPlumb.getInstance({
      Container: "canvas2"
  });
}

function clearCanvas() {
  const canvas = document.getElementById('canvas2');
  const fileInput = document.getElementById("fileInput");
  var connections = jsPlumb.getAllConnections();
  let allCards = document.querySelectorAll('.ChemElem_Card');
  // // 逐个删除连接
  // connections.forEach(connection => {
  //     jsPlumb.deleteConnection(connection); // 删除连接
  // });
  let nodes = document.querySelectorAll('.node');
  console.log('allcard',nodes,allCards,nodes)
  nodes.forEach(node => {
    // console.log('allcard',allCards)
    console.log('allcard',allCards)
    jsPlumb.remove(node); // 从 jsPlumb 实例中移除节点
    if (node.parentNode) {
      canvas.removeChild(node); // 从 DOM 中移除节点
    } 
    deleteCard(node)
  });
  // 清空画布内容
  // while (canvas.firstChild) {
  //     canvas.removeChild(canvas.firstChild);
  // }
  console.log('画布上的所有节点和连接已清除',nodes);
  initJsPlumb()
  instance.reset()
  fileInput.value = "";  // 清空文件输入框的值
}
// 上传文件并解析
function loadJsonFile(event) {
  const file = event.target.files[0];
  
  if (file) {
      const reader = new FileReader();
      
      // 当文件被加载时执行
      reader.onload = function(e) {
          const jsonData = JSON.parse(e.target.result); // 解析 JSON 数据
          loadCanvasFromJson(jsonData); // 调用函数加载到 canvas 上
      };
      
      reader.readAsText(file); // 读取文件内容
  }
}
function loadDefaultJson(num) {
  return new Promise((resolve, reject) => {
    fetch("files/canvasData.json")
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch the default JSON data');
          }
          return response.json();
      })
      .then(jsonData => {
        if(num==0){
          console.log('default',jsonData)
          resolve(jsonData);
        }else{
          loadCanvasFromJson(jsonData); // 渲染到 canvas 上
        }     
      })
      .catch(error => {
          console.error('Error loading default JSON:', error);
          reject(error);
        });
    });
}

// 从 JSON 数据中加载节点和连接到 canvas 上
function loadCanvasFromJson(jsonData,active=[],active_edge=[]) {
  const canvas = document.getElementById('canvas2');
  let selectedConnections = jsonData.links || jsonData.connections;
  // 清除现有的节点和连接
  let attr_now={}
  // 添加节点
  if(active.length !=0){
    for (let i = 0; i < active.length; i++){
      
      const nodeElement = document.getElementById(active[i]);
      const nodeattributes = nodeElement.attributes;
      attr_now[active[i]]=nodeattributes
    }
  }
  clearCanvas(); 

  jsonData.nodes.forEach(nodeData => {
      const newNode = document.createElement('div');
      newNode.classList.add('node');
      // newNode.id = nodeData.id;
      // newNode.style.position = 'absolute';
      // newNode.style.left = nodeData.left;
      // newNode.style.top = nodeData.top;
      // newNode.style.width = nodeData.width;
      // newNode.style.height = nodeData.height;
      if(active.length != 0 && active.includes(nodeData.nodeattributes.id)){
        for (let i = 0; i < attr_now[nodeData.nodeattributes.id].length; i++) {
          const attribute = attr_now[nodeData.nodeattributes.id].item(i);  // 获取单个属性（Attr 对象）
          console.log('Attribute name:', attribute.name, 'Attribute value:', attribute.value);
          
          // 设置新节点的属性
          newNode.setAttribute(attribute.name, attribute.value);
      }
      }else{
        // newNode.style.backgroundColor = nodeData.backgroundColor ;  // Set background color
        for (const [key, value] of Object.entries(nodeData.nodeattributes)) {
          newNode.setAttribute(key, value);
        }
        // 将节点添加到 canvas
      }
      
      newNode.innerHTML = nodeData.content;
      createuploadCardForNode(newNode)
      canvas.appendChild(newNode);
      jsPlumb.draggable(newNode); // 使节点可拖拽
      jsPlumb.droppable(newNode);
 
      // if (nodeData.endpoint) {
      //   nodeData.endpoint.forEach(endpoint => {
      //       jsPlumb.addEndpoint(newNode, {
      //           anchor: endpoint.anchor ,
      //           isSource: true,
      //           isTarget: true,
      //           // endpointStyle: endpoint.endpointStyle, // 默认端点
      //           // endpoint:[endpoint.type,{radius:endpoint.radius}],// type: endpoint.type,
      //           // maxConnections: -1,  // 默认值为 -1
      //           // allowLoopback:true
      //       });
   
      //       console.log('eeeeeeeeeeee',endpoint.maxConnections)
      //   });
      // }
      // let nodes = document.querySelectorAll('.node');
      // nodes.push(newNode); // 将节点添加到节点数组
      // addMouseDownEventToNode(newNode)
      addMousedubleclickToNode(newNode)
      addMouseclickToNode(newNode)
      // 启用手动拖动连接的功能
      jsPlumb.makeSource(newNode, {
        anchor: nodeData.endpoint[0].anchor,
        connector: selectedConnections.connector,
        connectorStyle:selectedConnections.paintStyle,
        endpoint:[nodeData.endpoint[0].type,{radius:nodeData.endpoint[0].radius}],  // Dot endpoint with radius 7 (you can adjust the size)
        endpointStyle: nodeData.endpoint[0].endpointStyle, 
        maxConnections: nodeData.endpoint[0].maxConnections,
        allowLoopback: nodeData.endpoint[0].allowLoopback,
      });
  
      jsPlumb.makeTarget(newNode, {
        anchor: nodeData.endpoint[0].anchor,
        endpoint: [nodeData.endpoint[0].type,{radius:nodeData.endpoint[0].radius}],  // Dot endpoint with radius 7 (you can adjust the size)
        endpointStyle: nodeData.endpoint[0].endpointStyle,  // Ensures the rectangle endpoint is filled with color
        maxConnections: nodeData.endpoint[0].maxConnections,
        allowLoopback: nodeData.endpoint[0].allowLoopback,
      
      });
  });

  // 添加连接
  selectedConnections.forEach(connData => {
    var source= connData.sourceId || connData.source
    var target= connData.targetId || connData.target
    pair=[source,target]
    exists = active_edge.some(subArray => 
      subArray.length === pair.length && 
      subArray[0] === pair[0] && 
      subArray[1] === pair[1]
    );
    if(exists){
      console.log('???????',active_edge,)
      connData.paintStyle.stroke='#FFA500'
    }
    const connection = jsPlumb.connect({
      
      source: connData.sourceId || connData.source,
      target: connData.targetId || connData.target,
      connector: connData.connector , // Default connector type
      paintStyle: connData.paintStyle,// Customize the style
      endpoints: [[ connData.endpoints[0].type||"Dot", { radius: connData.endpoints[0].radius || 10 }], [ connData.endpoints[1].type||"Dot", { radius: connData.endpoints[1].radius || 10 }]], // 设置端点类型
      anchors: [connData.endpoints[0].anchor, connData.endpoints[1].anchor] ,
      endpointStyles:[connData.endpoints[0].endpointStyle,connData.endpoints[1].endpointStyle],
      maxConnections: connData.endpoints[0].maxConnections,
      allowLoopback:connData.endpoints[0].allowLoopback
    });  
    console.log('kkkkkkkk',[connData.endpoints[0].type, { radius: connData.endpoints[0].radius }]) 

    // Add overlays if any
    if (connData.overlays) {
      connData.overlays.forEach(overlayData => {
          if (overlayData.type === 'Arrow') {
              connection.addOverlay([
                  'Arrow', 
                  { 
                      location: overlayData.location , 
                      width: overlayData.width , 
                      height: overlayData.height 
                  }
              ]);
          }
      });
  } 
    console.log('kkkkkkkk',connData.overlays) 
    jsPlumb.repaintEverything();
  });
}

function addMouseDownEventToNode(node) {
  node.addEventListener('mousedown', function(e) {
    deletenode=node.id
    console.log('Node mousedown triggered:', node.id);
    // 在此处理节点的 mousedown 事件
  });
}
function addMousedubleclickToNode(node) {
  node.addEventListener('dblclick', function(e) {
    deletenode=node.id
    console.log('Node mousedown triggered:', node.id);
    jsPlumb.remove(deletenode); // 删除节点及其连接
    node.remove(); 
    // const index = nodes.findIndex(node => node.id === deletenode);
    // if (index !== -1) {
    //     nodes.splice(index, 1); // 从数组中删除节点
    // }
    // 在此处理节点的 mousedown 事件
    deleteCard(node)

  });
}
function deleteCard(node){
  let cardId = node.id
  if (cardId) {
      let cardToDelete = document.querySelector(`#${cardId}_card`);
      if (cardToDelete) {
          cardToDelete.remove();  // 删除对应的卡片
          console.log(`Card with ID ${cardId}_card removed.`);
      } else {
          console.error(`No card found with ID ${cardId}_card`);
      }
  } else {
      console.error(`No card attribute found on node ${deletenode}`);
  }
}
function addMouseclickToNode(node){
    node.addEventListener('click', function() {
        let cardId = node.id;
       
        // 隐藏所有卡片
        let allCards = document.querySelectorAll('.ChemElem_Card');
        allCards.forEach(card => card.style.display = 'none');

        // 显示对应的卡片
        let correspondingCard = document.querySelector(`#${cardId}_card`);
        
        if (correspondingCard) {
            correspondingCard.style.display = 'block';
            console.log('QQQQQQ',cardId,allCards)
        }
    });    
}
function getCardValues(nodeType) {
  let paragraphs = document.querySelectorAll(`#${nodeType} P`);
  let cardData = {};
  paragraphs.forEach((p) => {
      let description = p.textContent.trim().split(':')[0]; // 获取描述部分，冒号前面的内容
      let input = p.querySelector('input');
      let inputValue = input ? input.value : null;
      cardData[description] = inputValue;
  });
  console.log(cardData);
  return cardData; // 返回 card 数据对象
}
function setNodeAttributes(node, attributes) {
  // 遍历字典（attributes），将键值对设置为节点的属性
  for (let key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (attributes.hasOwnProperty(key)) {
          let validKey = key.replace(/[^\w-]/g, '_');
          console.log(validKey)
        node.setAttribute(validKey, attributes[key]);
      }
  }
}
}


function createNewCardForNode(cardId,newNode) {
  // 克隆模板卡片
  let template = document.querySelector(`#${cardId}_card`);
  let newCard = template.cloneNode(true);  // 深度克隆整个结构
  newCard.id = newNode.id+'_card';  // 为新卡片设置唯一的ID
  var allCards = document.querySelectorAll('.ChemElem_Card');
  const idLabel = document.createElement('span');
  idLabel.classList.add('node-id-label');

  allCards.forEach(card => {
      card.style.display = 'none';
  });
  newCard.style.display = 'block';  // 使克隆的卡片可见
  
  // 设置card内容（如ID等）
  // newCard.querySelector('').value = newNodeId;  // 设置卡片的ID输入框为节点的ID

  // 将新卡片插入到DOM中，放到指定位置
  document.body.appendChild(newCard);
  
  if (!columnContainer) {
      console.error(`Container with class .column not found`);
      return;
  }
  // 将新卡片插入到 `.column` 容器中
  columnContainer.appendChild(newCard);
  // 直接为新卡片内的输入框添加事件监听器
  let paragraphs = document.querySelectorAll(`#${newCard.id} P`);
  let inputFields = newCard.querySelectorAll('input');  // 获取所有输入框
  let reagentclass=''
  let inputIdValue=''
  const existingLabel = newNode.querySelector('.node-id-label');
  
  paragraphs.forEach((p) => {
      // inputField.value = newNodeId;  // 默认设置输入框的值
      let input = p.querySelector('input');
      let description = p.textContent.trim().split(':')[0];
      let newValue = input ? input.value : null;
      let validKey = description.replace(/[^\w-]/g, '_');
      
      newNode.setAttribute('data-'+validKey, newValue);
      console.log(validKey, newValue)
      // 为每个输入框添加事件监听器
      if (input){
        input.addEventListener('input', function () {
          // 获取新的输入值
          valuetoupload=input ? input.value : null;
          console.log('?????',valuetoupload)
          newNode.setAttribute('data-'+validKey,valuetoupload)  // 根据需要更新节点属性
          console.log('9999',newNode.getAttribute('data-'+validKey),newNode.dataset.validKey,newCard.id)
          
          if (existingLabel) {
            newNode.removeChild(existingLabel);
          }
          if(input.id==='class'){
            reagentclass=input.value
          }else if(input.id === 'id'){
            inputIdValue = input.value;
          }
            // console.log("ID 输入框的值:", inputIdValue);
          if (cardId==='bottle'){
            idLabel.textContent = reagentclass+' '+inputIdValue;
          }else{
            idLabel.textContent = cardId+' '+inputIdValue;
          }
          newNode.appendChild(idLabel);  
          
      });
      
    }
  });
  newNode.setAttribute('data-id1', cardId);
 
  return newCard;
}
function createuploadCardForNode(newNode) {
  // 克隆模板卡片
  let cardId=newNode.getAttribute('data-id1')
  let template = document.querySelector(`#${cardId}_card`);
  let newCard = template.cloneNode(true);  // 深度克隆整个结构
  newCard.id = newNode.id+'_card';  // 为新卡片设置唯一的ID
  var allCards = document.querySelectorAll('.ChemElem_Card');
  allCards.forEach(card => {
      card.style.display = 'none';
  });
  newCard.style.display = 'block';  // 使克隆的卡片可见

  // 设置card内容（如ID等）
  // newCard.querySelector('').value = newNodeId;  // 设置卡片的ID输入框为节点的ID

  // 将新卡片插入到DOM中，放到指定位置
  document.body.appendChild(newCard);
  
  if (!columnContainer) {
      console.error(`Container with class .column not found`);
      return;
  }
  // 将新卡片插入到 `.column` 容器中
  columnContainer.appendChild(newCard);
  // 直接为新卡片内的输入框添加事件监听器
  let paragraphs = document.querySelectorAll(`#${newCard.id} P`);
  let dataAttributes = newNode.dataset;
  let reagentclass=''
  let inputIdValue=''
  const existingLabel = newNode.querySelector('.node-id-label');
  const idLabel = document.createElement('span');
  idLabel.classList.add('node-id-label');
  paragraphs.forEach((p) => {
      // inputField.value = newNodeId;  // 默认设置输入框的值
  
      let input = p.querySelector('input');
  
      let description = p.textContent.trim().split(':')[0];
      
      let validKey = description.replace(/[^\w-]/g, '_').toLowerCase();;
      let newValue = dataAttributes[validKey];
      
      console.log(validKey, newValue)
      // 为每个输入框添加事件监听器
      if (input){
        input.value=newValue
        input.addEventListener('input', function () {
          // 获取新的输入值
          valuetoupload=input ? input.value : null;
          console.log('?????',valuetoupload)
          newNode.setAttribute('data-'+validKey,valuetoupload)  // 根据需要更新节点属性
          console.log('9999',newNode.getAttribute('data-'+validKey),newNode.dataset.validKey,newCard.id)
      
          existingLabel?.remove(); // 移除 span 标签
          if(input.id==='class'){
            reagentclass=input.value
          }else if(input.id === 'id'){
            inputIdValue = input.value;
          }
            // console.log("ID 输入框的值:", inputIdValue);
          if (cardId==='bottle'){
            idLabel.textContent = reagentclass+' '+inputIdValue;
          }else{
            idLabel.textContent = cardId+' '+inputIdValue;
          }
          newNode.appendChild(idLabel);  
        });      
    }
  });

  return newCard;
}
// function showCorrespondingCard(nodeType) {
//   console.log('YYY',nodeType)
//   var allCards = document.querySelectorAll('.ChemElem_Card');
//   allCards.forEach(card => {
//       card.style.display = 'none';
//   });
//   // 根据节点类型显示相应的 card
//   console.log('>>>>',nodeType)
//   var correspondingCard = document.querySelector(`#${nodeType}`);
//   console.log(correspondingCard,nodeType)
//   if (correspondingCard) {
//       correspondingCard.style.display = 'block';
//   }
// }

// // ----------------------------
function InitEchart(){
  // echartdom = document.getElementById('echartDom');
  pressure_echart = echarts.init(document.getElementById('PressureEchartDom'));
  tempreture_echart = echarts.init(document.getElementById('TempretureEchartDom'));
  pressure_echart.setOption(option1);
  tempreture_echart.setOption(option2);
  window.addEventListener('resize', function() {
    pressure_echart.resize();
    tempreture_echart.resize();
});
}

function manualsetbutton(f){
  var btns = document.getElementsByClassName('btn-sm');
  for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = f; // 禁用按钮
      // btns[i].classList.add('disabled'); // 添加禁用样式类
  }
}

function toggleRunStop() {
  const visibleId = getVisibleCardIds();
  const card = document.getElementById(visibleId)
  console.log(typeof(visibleId))
  var nodeid=visibleId.split('_')[0]
  const targetNode = document.getElementById(nodeid)
  if (card) {
    // 在 card 内查找具有 class 'run-btn' 的按钮
    const runButton = card.querySelector('.btn-sm');
    
    if (runButton.innerText === 'Run') {
        runButton.innerText = 'Stop';
        startFunction(targetNode); 
    } else {
        runButton.innerText = 'Run';
        stopFunction(targetNode); 
    }
  }else{
    alert('Run button not found in Card');
  }
}

function startFunction(target) {
  if (target) {
    target.classList.add('highlight');
  }
  var device=target.getAttribute('data-id1')
  console.log('Running...',device,target.dataset.id1);
  if(device=='pump'){
    var msg={
      MsgType:3,
      FuncType:6,
      data:target.dataset
    }
  }else{
    var msg={
      MsgType:3,
      FuncType:4,
      data:target.dataset
    }
  }
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
  console.log('Running...', target.dataset);
  // switch(device){
  //   case 'valve'||'Valve':
  //     var msg={
  //       MsgType:3,
  //       FuncType:4,
  //       NetId:NetId0,
  //       DevType:Valve_code,
  //       DevId:target.dataset.id,
  //       Devport:target.dataset.outlet_channel,
  //       data:target.dataset
  //     }
  //     var jsonString = JSON.stringify(msg);
  //     ws.send(jsonString);
  //     console.log('Running...', target.dataset);
  //     break;
  //   case 'heat_chip':
  //     var msg = {
  //       MsgType:3,
  //       FuncType:4,
  //       NetId:NetId0,
  //       DevType:HeatChip_code,
  //       DevId:target.dataset.id,
  //       DevTemp:target.dataset.react_temp___,
  //       DevRate:target.dataset.heating_rate
  //     };
  //     var jsonString = JSON.stringify(msg);
  //     ws.send(jsonString);
  //     break;
  //   case 'pump':
  //     var msg={

  //     }
  //   default:
  //     break;
  // } 
}

function stopFunction(target) {
  console.log('Stopped.'); 
  target.classList.remove('highlight');
  var msg={
    MsgType:3,
    FuncType:5,
    data:target.dataset
  }
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
  console.log('stop...', target.dataset);
}

function getVisibleCardIds() {
  let allCards = document.querySelectorAll('.ChemElem_Card');
  const visibleCardIds = [];
  allCards.forEach(card => {
      if (card.style.display !== 'none') {
          visibleCardIds.push(card.id); // 如果卡片可见，添加它的 ID
      }
  });
  console.log('cardid???',visibleCardIds)
  return visibleCardIds[0];
}

function ExitManuProc()
{
  var msg={
    MsgType:3,    //手动模式消息包
    FuncType:3  //功能：请求退出手动模式
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

//点击退出自动模式按钮
function ExitAutoExp()
{
  var msg={
    MsgType:2,  
    FuncType:4  
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

//手动模式点击初始化按钮
function ManuModeInit()
{
  var msg={
    MsgType:3,    //手动模式消息包
    FuncType:1    //功能：开始初始化
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

//前端点击开始清洗
function StartCleanFunc(expmode)
{
  if(expmode == "自动模式")
  {
    var msg={
      MsgType:2,    //自动模式消息包
      FuncType:2  //功能：开始清洗仪器
    };
    var jsonString = JSON.stringify(msg);
    ws.send(jsonString);
  }
  else if(expmode == "手动模式")
  {
    var msg={
      MsgType:3,    //自动模式消息包
      FuncType:2  //功能：开始清洗仪器
    };
    var jsonString = JSON.stringify(msg);
    ws.send(jsonString);
  }  
}

function RefreshParamPeriodly()
{
  //---------------更改系统参数 begin------------------------
  // 在这里获取新的数据值，例如从服务器获取  
  var SysParamVal1_new = (Math.random() * (24.4 - 23.6) + 23.6).toFixed(2);   //电压随机数，24.4~23.6，保留两位小数
  var SysParamVal2_new     
  //根据设备状态产生电流数据
  switch(BackCurrentState)
  {
    case 0:
      SysParamVal2_new = (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2);   //电流随机数，0.6-1.2，保留两位小数  
      break;
    case 1:
      SysParamVal2_new = (Math.random() * (40 - 10) + 10).toFixed(2);   //电流随机数，40-10，保留两位小数  
      break;
    case 2:
      SysParamVal2_new = (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2);   //电流随机数，0.6-1.2，保留两位小数  
      break;
    case 3:
      SysParamVal2_new = (Math.random() * (40 - 30) + 30).toFixed(2);   //电流随机数，40-30，保留两位小数  
      break;
    case 4:
      SysParamVal2_new = (Math.random() * (20 - 10) + 10).toFixed(2);   //电流随机数，20-10，保留两位小数  
      break;
    case 5:
      SysParamVal2_new = (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2);   //电流随机数，0.6-1.2，保留两位小数  
      break;
    case 6:
      SysParamVal2_new = (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2);   //电流随机数，0.6-1.2，保留两位小数  
      break;
    default:
      SysParamVal2_new = (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2);   //电流随机数，0.6-1.2，保留两位小数  
      break;
  }
  var SysParamVal3_new = (parseFloat(SysParamVal1_new) * parseFloat(SysParamVal2_new)).toFixed(2); 
  var SysParamVal4_new = "正常运行";
  switch(BackCurrentState)
  {
    case 0:
      SysParamVal4_new = "Waitting to start"
      break;
    case 1:
      SysParamVal4_new = "Running"
      break;
    case 2:
      SysParamVal4_new = "Error! stopping"
      break;
    case 3:
      SysParamVal4_new = "Cleaning"
      break;
    case 4:
      SysParamVal4_new = "Initializing"
      break;
    case 5:
      SysParamVal4_new = "Completed"
      break;
    case 6:
      SysParamVal4_new = "Cleaning Complete"
      break;
    default:
      SysParamVal4_new = "Normal operation"
      break;
  }

  // 更新HTML元素的内容  
  document.getElementById("SysParamVal_1").textContent = wsMsg_ToShowRegularly.ElectricalParameters.busVoltage.ValNum;  //总线电压
  document.getElementById("SysParamVal_2").textContent = wsMsg_ToShowRegularly.ElectricalParameters.busCurrent.ValNum;  //总线电流
  document.getElementById("SysParamVal_3").textContent = wsMsg_ToShowRegularly.ElectricalParameters.systemPower.ValNum; //总线功率
  document.getElementById("SysParamVal_4").textContent = SysParamVal4_new;  
  // document.getElementById("SysParamVal_5").textContent = SysParamVal5_new;  
  // document.getElementById("SysParamVal_6").textContent = SysParamVal6_new; 
  //---------------更改系统参数 end------------------------
  //为保证体验感，只有在BackCurrentState==1,5,3,2下更新chart
  if(BackCurrentState == 1 || BackCurrentState == 2 ||BackCurrentState == 3 ||BackCurrentState == 5 )
  {
    DrawPressTempChart();
  }
  //---------------更改canvas显示参数 end------------------------
  //---------------更新showcard上显示的数据 begin--------------------
  //Elem1
}
// 使用echarts画压力传感器和温度探头的曲线
function DrawPressTempChart()
{  
  //使用后端数据更新option
  option1.xAxis.data = wsMsg_ToShowRegularly.PressTempChart.Pressure.time;
  option1.series[0].data = wsMsg_ToShowRegularly.PressTempChart.Pressure.pressure1;
  option1.series[1].data = wsMsg_ToShowRegularly.PressTempChart.Pressure.pressure2;
  option2.xAxis.data = wsMsg_ToShowRegularly.PressTempChart.Tempreture.time;
  option2.series[0].data = wsMsg_ToShowRegularly.PressTempChart.Tempreture.tempreture1;
  option2.series[1].data = wsMsg_ToShowRegularly.PressTempChart.Tempreture.tempreture2;
  option2.series[2].data = wsMsg_ToShowRegularly.PressTempChart.Tempreture.tempreture3;
  option2.series[3].data = wsMsg_ToShowRegularly.PressTempChart.Tempreture.tempreture4;
  // 使用刚指定的配置项和数据显示图表。
  pressure_echart.setOption(option1);
  tempreture_echart.setOption(option2);
}
