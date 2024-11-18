//--------------------全局变量声明区 begin---------------------------------------
//websocket相关
var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
//websocekt链接建立标志
var ws_onopen = false;
//接收后端websocket数据并用于模式判断的对象
var wsMsg_Mode; 
//根据后端更新数据，实时获得当前后端状态机状态
var BackCurrentState;

//子网id
const NetId0 = 0x40;
const NetId1 = 0x40;
const NetId2 = 0x40;
const NetId3 = 0x40;
//设备类型
const Bump = 0;   
const Valve = 1;
const Chip = 2;
const Bottle = 3;
const PressureSensor = 4;

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_1_0={
  MsgType: 1,            
  FuncType:0      //==0, 向后端询问当前模式
};

// 接受后端websocket数据并用于数据处理的对象
var wsMsg_ToShowRegularly;    // 用于实时跟新界面参数

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_1_1={
  MsgType: 1 ,  
  FuncType:1             //==1, 定时向后端索要界面各个参数
};

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_2_0={
  MsgType:2,    //自动模式消息包
  FuncType:0  //功能：设置实验模式为自动模式
};

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_2_1={
  MsgType:2,    //自动模式消息包
  FuncType:1  //功能：前端点击开始试验
};

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_2_2={
  MsgType:2,    //自动模式消息包
  FuncType:2  //功能：前端点击暂停试验
};

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_2_3={
  MsgType:2,    //自动模式消息包
  FuncType:3  //功能：前端点击结束试验
};

//发送给后端websocket的对象，用MsgType来区分不同的消息类型
var wsMsg_ToBack_2_4={
  MsgType:2,    //自动模式消息包
  FuncType:4  //功能：前端点击退出自动模式
};

//当前实验模式
var mode = "无";
var mode_known = false;   //标志是否已从后端获取状态模式，若已获取为true；

//canvas相关
//化学框图绘制canvas
var canvas = document.getElementById('tutorial');
var ctx = canvas.getContext("2d");
//cv处理摄像头画面canvas
//1号摄像头画面
var canvas2 = document.getElementById('CanvasOpencv_1');
var ctx2 = canvas2.getContext("2d");
//2号摄像头画面
var canvas3 = document.getElementById('CanvasOpencv_2');
var ctx3 = canvas3.getContext("2d");

const dw = canvas2.width;
const dh = canvas2.height;
//requestAnimationFrame 方法用于在下次浏览器重绘之前执行一个函数。如果想在某个时刻停止调用 ProcessVideo 方法，可以使用标志变量
let shouldProcessVideo = true; // 标志变量

//opencv相关
var OpencvReady = 0;
let Sourcevideo1 = document.createElement("video"); // video is the id of video tag
let Sourcevideo2 = document.createElement("video");

// 预设的颜色范围  
const colorMin_Red = [0, 0, 0]; // RGB  
const colorMax_Red = [255, 255, 255]; // RGB 
const colorMin_Green = [0, 0, 0]; // RGB  
const colorMax_Green = [255, 255, 255]; // RGB
const colorMin_Blue = [0, 0, 0]; // RGB  
const colorMax_Blue = [255, 255, 255]; // RGB

// 预设的圆形数据，每个元素包含x, y, 半径和颜色信息  
//xy: 我这个菜鸡hough circle detect搞不出来，没有几个瓶盖能正确判断成圆形，检测出一堆不是瓶盖的东西是圆形
// 本想圆形检测+颜色检测match， 无奈只得放弃，在固定位置检测颜色
const bottles = [  
  //------
  { x: 25, y: 158, radius: 7, color: [0, 0, 255] },  
  { x: 65, y: 158, radius: 7, color: [0, 255, 0] },  
  { x: 65, y: 180, radius: 7, color: [255, 0, 0] },  
  //------
  { x: 95, y: 158, radius: 7, color: [0, 0, 255] },  
  { x: 140, y: 158, radius: 7, color: [0, 255, 0] },  
  { x: 140, y: 180, radius: 7, color: [255, 0, 0] }, 
  //------
  { x: 170, y: 158, radius: 7, color: [0, 0, 255] },  
  { x: 190, y: 180, radius: 7, color: [255, 0, 0] },  
  // { x: 140, y: 180, radius: 7, color: [255, 0, 0] },
  //------
  { x: 220, y: 158, radius: 7, color: [0, 0, 255] },  
  { x: 260, y: 158, radius: 7, color: [0, 255, 0] },  
  { x: 260, y: 180, radius: 7, color: [255, 0, 0] },
  //------
  { x: 290, y: 158, radius: 7, color: [0, 0, 255] },  
  { x: 330, y: 158, radius: 7, color: [0, 255, 0] },  
  { x: 330, y: 180, radius: 7, color: [255, 0, 0] },
  //------
  { x: 455, y: 160, radius: 7, color: [0, 0, 255] },  
  { x: 495, y: 160, radius: 7, color: [0, 255, 0] },  
  { x: 495, y: 182, radius: 7, color: [255, 0, 0] },
  //------
  { x: 525, y: 160, radius: 7, color: [0, 0, 255] },  
  { x: 565, y: 160, radius: 7, color: [0, 255, 0] },  
  { x: 565, y: 182, radius: 7, color: [255, 0, 0] },
  //------
  { x: 595, y: 160, radius: 7, color: [0, 0, 255] },  
  { x: 635, y: 160, radius: 7, color: [0, 0, 255] },  
  { x: 615, y: 182, radius: 7, color: [255, 0, 0] },
  //------
  { x: 667, y: 163, radius: 7, color: [0, 0, 255] }, 
];  

//xy: 申明一个用来存储拓扑中element的数组，承载各元素需要修改显示的card
var elem_array=[];  //elem_array[0]承载拓扑中的element1，以此类推
//记录当前操作elem元素的标号,初始状态为底物1
var currentElem = 1;
function InitElemArray(){
  //初始化elem_array
  for(var i=1; i<30; i++)
  {
    var elemId = `ChemElem_Card${i}`;
    //yh:用于从文档中获取具有指定ID的元素，数组索引从0开始，i从1开始，所以i-1
    elem_array[i-1] = document.getElementById(elemId);
  }
}

// echart画表格所需变量：
var option1 = {
  backgroundColor: '#ffffff', // 设置背景颜色为灰色 
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
  backgroundColor: '#ffffff', // 设置背景颜色为白色 
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

var echartdom ;
var pressure_echart ;
var tempreture_echart ;

var Msg_LastInfo;//记录上一次后端穿来的错误信息
var Msg_CurrentInfo;//记录这一次后端传来的错误信息
//--------------------全局变量声明区 end---------------------------------------


ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws_onopen = true;//websocekt链接建立标志
  ws.send("processingpage is opened");
  // 向后端询问当前模式并以此更新页面 //jyh:mode_known标志是否已从后端获取状态模式，若已获取为true；
  if(mode_known == false)
  {
    var jsonString = JSON.stringify(wsMsg_ToBack_1_0);//向后端询问当前模式
    ws.send(jsonString);
  }
  // 定时发送信息索要更新数据
  var jsonString = JSON.stringify(wsMsg_ToBack_1_1);//定时向后端索要界面各个参数
  //每隔2s索要一次数据,调用一个定时器
  let intervalId = setInterval(function() {  
    ws.send(jsonString);  
  }, 2000);
  //停止该定时器调用：clearInterval(intervalId);

}

ws.onmessage = function (evt) {
  //jyh:JSON.parse用于将一个 JSON 格式的字符串转换为 JavaScript 对象
  var Msg = JSON.parse(evt.data);
  console.log('收到后端发送的消息：',Msg);

    switch(Msg.MsgType)
    {
      case 0:     //Msg.MsgType=0，后端向前端报错
          //修改弹窗问题
        Msg_LastInfo = Msg_CurrentInfo;
        
        Msg_CurrentInfo = Msg.errInfo;
        
        if(Msg_CurrentInfo == Msg_LastInfo){

        }
        else{
          switch(Msg.errType)
        {
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
        if(Msg.FuncType == 0) //判断当前实验模式
        {
          if(mode_known == false)
          {
            mode_known = true;
            mode = Msg.mode;
            ChooseMode_Disp(mode);
            console.log("当前实验模式：",mode);
          }
        }
        else if(Msg.FuncType == 1)  //实时更新界面各个参数
        {
          wsMsg_ToShowRegularly = Msg;
          BackCurrentState = Msg.BackCurrentState;//后端状态机状态
        }
        
        break;
      case 2:     //Msg.MsgType = 2后端向前端汇报自动模式进度
        switch(Msg.FuncType)
        {
          // 自动模式下web前端点击开始试验的回馈
          case 1:
            //操作成功
            if(Msg.success == true)
            {
              $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
                title: 'Note',
                content: Msg.MsgInfo,
                type:'green',
              });
            }
            //操作失败
            else 
            {
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
            if(Msg.success == true)
            {
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
            if(Msg.success == true)
            {
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


        break;
      case 3:     //Msg.MsgType = 3后端向前端汇报手动模式进度
        switch(Msg.FuncType)
        {
          //手动模式下web前端点击初始化的反馈
          case 1:
            //操作成功
            if(Msg.success == true)
            {
              $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
                title: 'Note',
                content: Msg.MsgInfo,
                type:'green',
              });
              // 恢复参数设置按键
              for(var i=1; i<=29; i++)
              {
                //使用模板字符串 
                var elem = `elem${i}_SetBtn`;
                var btn = document.getElementById(elem);
                btn.disabled = false;
              }
              SettingBottlesAble("disable");
              // 显示body card中手动模式的按钮
              const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
              for(var i=0; i<ManuElemID.length; i++)
              {
                var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
                var btn = document.getElementById(elemID);
                btn.style.display = 'block';
              }
              //显示串口
              var uartContainer = document.getElementById('uartContainer');
              uartContainer.style.display = 'block';
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
          //手动模式下web前端点击清洗仪器的反馈
          case 2:
            //操作成功
            if(Msg.success == true)
            {
              $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
                title: 'Note',
                content: Msg.MsgInfo,
                type:'green',
              });
              // 隐藏body card中手动模式的按钮
              const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
              for(var i=0; i<ManuElemID.length; i++)
              {
                var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
                var btn = document.getElementById(elemID);
                btn.style.display = 'none';
              }
              // 禁用参数设置按键
              for(var i=1; i<=29; i++)
              {
                //使用模板字符串 
                var elem = `elem${i}_SetBtn`;
                var btn = document.getElementById(elem);
                btn.disabled = true;
              }
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
          case 4:
            //串口消息更新
            var uart_R = document.getElementById('uartOutput');
            uart_R.textContent = "接收到串口信息：" + Msg.MsgInfo;
            break;
          default:

            break;
        }
      
        break;
      case 4:
        console.log('mmmm',Msg.data)   
      default:

        break;
    }
  

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
  canvas_draw();
  InitElemArray();
  InitEchart();
  ShowSliderValue();
  // setInterval(RefreshParamPeriodly,1500); //每1s更新一次系统参数

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

//#################################################################################
//------------------------- 显示加热芯片滑条值 begin --------------------------------
// 使用JavaScript来更新加热芯片加热速度滑条显示的值
function ShowSliderValue()
{
  var slider1 = document.getElementById("ChemElem12_HeatingRate1_Slider");
  var display1 = document.getElementById("ChemElem12_HeatingRate1_Val");
  var slider2 = document.getElementById("ChemElem12_HeatingRate2_Slider");
  var display2 = document.getElementById("ChemElem12_HeatingRate2_Val");
  var slider3 = document.getElementById("ChemElem23_HeatingRate1_Slider");
  var display3 = document.getElementById("ChemElem23_HeatingRate1_Val");
  var slider4 = document.getElementById("ChemElem23_HeatingRate2_Slider");
  var display4 = document.getElementById("ChemElem23_HeatingRate2_Val");
  // 初始设置显示值为滑动条的初始值
  display1.textContent = slider1.value;
  display2.textContent = slider2.value;
  display3.textContent = slider3.value;
  display4.textContent = slider4.value;
  // 当滑动条的值改变时，更新显示的值
  slider1.addEventListener("input", function() {
  display1.textContent = this.value;
  });
  slider2.addEventListener("input", function() {
  display2.textContent = this.value;
  });
  slider3.addEventListener("input", function() {
  display3.textContent = this.value;
  });
  slider4.addEventListener("input", function() {
  display4.textContent = this.value;
  });
}
//------------------------- 显示加热芯片滑条值 end --------------------------------
//#################################################################################

//#################################################################################
//------------------------- 不同模式下的界面调整 begin ------------------------------
//根据点击的按钮进入相应模式，修改界面
function ChooseMode_Disp(modeid)
{
  //界面DOM加载完毕，此时还不知道mode，向后端询问。询问之后再次调用此函数，modeid便是后端查询的结果
  if(mode_known == false)
  {
    var jsonString = JSON.stringify(wsMsg_ToBack_1_0);
    ws.send(jsonString);
  }
  else
  {
    if(modeid=="自动模式") //自动模式
    {
      console.log("进入自动模式");
      var btn1 = document.getElementById('AutoProcBtn');
      btn1.style.display = 'block';
      var btn2 = document.getElementById('ManuProcBtn');
      btn2.style.display = 'none';
      var btn3 = document.getElementById('ChooseModeBtn');
      btn3.style.display = 'none';
      var uartContainer = document.getElementById('uartContainer');
      uartContainer.style.display = 'none';

      // 禁用参数设置按键
      for(var i=1; i<=29; i++)
      {
        //使用模板字符串 
        var elem = `elem${i}_SetBtn`;
        var btn = document.getElementById(elem);
        btn.disabled = true;
      }

      SettingBottlesAble("enable");

      //设置后端实验模式
      var jsonString = JSON.stringify(wsMsg_ToBack_2_0);
      ws.send(jsonString);
      
    }

    else if(modeid=="手动模式") //手动模式
    {
      console.log("进入手动模式");
      var btn1 = document.getElementById('AutoProcBtn');
      btn1.style.display = 'none';
      var btn2 = document.getElementById('ManuProcBtn');
      btn2.style.display = 'block';
      var btn3 = document.getElementById('ChooseModeBtn');
      btn3.style.display = 'none';
      StartManuProc();
      SettingBottlesAble("enable");
      if(BackCurrentState==1)
      {
        // 显示body card中手动模式的按钮
        const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
        for(var i=0; i<ManuElemID.length; i++)
        {
          var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
          var btn = document.getElementById(elemID);
          btn.style.display = 'block';
        }
        //显示串口
        var uartContainer = document.getElementById('uartContainer');
        uartContainer.style.display = 'block';
      }
      //设置后端实验模式
      var msg={
        MsgType:3,    //手动模式消息包
        FuncType:0  //功能：设置实验模式为手动模式
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
    }
    else if(modeid == "无") 
    {
      var btn1 = document.getElementById('AutoProcBtn');
      btn1.style.display = 'none';
      var btn2 = document.getElementById('ManuProcBtn');
      btn2.style.display = 'none';
      var btn3 = document.getElementById('ChooseModeBtn');
      btn3.style.display = 'block';
      var uartContainer = document.getElementById('uartContainer');
      uartContainer.style.display = 'none';
      // 禁用参数设置按键
      for(var i=1; i<=29; i++)
      {
        //使用模板字符串 
        var elem = `elem${i}_SetBtn`;
        var btn = document.getElementById(elem);
        btn.disabled = true;
      }
    }
  }
  
}

//------------------------- 不同模式下的界面调整 end ------------------------------
//#################################################################################

//设置瓶子类设置按钮的使能
function SettingBottlesAble(flag)
{
  const bottlesElemId = [1,2,6,8,11,16,18,19,21,22,25,28,29];
  if(flag == "enable")
  {
    for(var i=0; i<bottlesElemId.length; i++)
    {
      //使用模板字符串 
      var elem = `elem${bottlesElemId[i]}_SetBtn`;
      var btn = document.getElementById(elem);
      btn.disabled = false;
      console.log(elem);
    }
  }
  else if(flag == "disable")
  {
    for(var i=0; i<bottlesElemId.length; i++)
    {
      //使用模板字符串 
      var elem = `elem${bottlesElemId[i]}_SetBtn`;
      var btn = document.getElementById(elem);
      btn.disabled = true;
    }
  }
}


//#################################################################################
//------------------------- 自动模式功能函数 begin --------- --------------------------
//开始自动模式实验
function StartAutoExp()
{
  var msg={
    MsgType:2,    //自动模式消息包
    FuncType:1  //功能：开始自动模式 
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
  SettingBottlesAble("disable");
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

//点击紧急停止按钮
function UrgentStopFunc()
{
  var msg={
    MsgType:2,    //自动模式消息包
    FuncType:3  //功能：紧急停止
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}

//点击退出自动模式按钮
function ExitAutoExp()
{
  var msg={
    MsgType:2,    //自动模式消息包
    FuncType:4  //功能：请求退出自动模式
  };
  var jsonString = JSON.stringify(msg);
  ws.send(jsonString);
}
//------------------------- 自动模式功能函数 end --------- --------------------------
//#################################################################################

//#################################################################################
//------------------------- 手动模式功能函数 begin --------- -----------------------
function StartManuProc()
{
  // 修改自动模式的按钮disabled
  //使用模板字符串 
  for(var i=1; i<=5; i++)
  {
    var elemID = `StartSysBtns_${i}`;
    var btn = document.getElementById(elemID);
    btn.disabled = true;
  }
  // // 显示body card中手动模式的按钮
  // const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
  // for(var i=0; i<ManuElemID.length; i++)
  // {
  //   var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
  //   var btn = document.getElementById(elemID);
  //   btn.style.display = 'block';
  // }


  
}

function ExitManuProc()
{
  mode = "无";
  // 修改自动模式的按钮disabled
  //使用模板字符串 
  for(var i=1; i<=5; i++)
  {
    var elemID = `StartSysBtns_${i}`;
    var btn = document.getElementById(elemID);
    btn.disabled = false;
  }
  // 隐藏body card中手动模式的按钮
  const ManuElemID=[3,4,7,9,10,12,15,17,20,23,24,27];
  for(var i=0; i<ManuElemID.length; i++)
  {
    var elemID = `ChemElem${ManuElemID[i]}_ManuBtns`;
    var btn = document.getElementById(elemID);
    btn.style.display = 'none';
  }

  var msg={
    MsgType:3,    //手动模式消息包
    FuncType:3  //功能：请求退出手动模式
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

  SettingBottlesAble("disable");
}

//手动模式下点击启动某个仪器
function manuStart(elemId)
{
  switch(elemId)
  {
    //切换阀
    case 7:
      var msg = {
        MsgType:3,
        FuncType:4,
        NetId:NetId0,
        DevType:Valve,
        DevId:1
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 20:
      var msg = {
        MsgType:3,
        FuncType:4,
        NetId:NetId0,
        DevType:Valve,
        DevId:2,
   nk    
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 27:
      var msg = {
        MsgType:3,
        FuncType:4,
        NetId:NetId0,
        DevType:Valve,
        DevId:3
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;

    //加热芯片
    case 12:
      var msg = {
        MsgType:3,
        FuncType:4,
        NetId:NetId0,
        DevType:Chip,
        DevId:0
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 23:
      var msg = {
        MsgType:3,
        FuncType:4,
        NetId:NetId0,
        DevType:Chip,
        DevId:1
      };
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    
    default:
      break;
  }
}

//手动模式下点击停止某个仪器
function manuStop(elemId)
{
  switch(elemId)
  {
    //泵
    case 3:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,0]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 4:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,1]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 9:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,2]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 10:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,3]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 15:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,4]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 17:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,5]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 24:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Bump,6]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;

    //加热芯片
    case 12:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Chip,1]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 23:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Chip,2]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    
    //切换阀
    case 7:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Valve,0]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 20:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Valve,1]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;
    case 27:
      var msg = {
        MsgType:3,
        FuncType:5,
        data:[NetId0,Valve,2]
      }
      var jsonString = JSON.stringify(msg);
      ws.send(jsonString);
      break;

    default:
      break;
  }
}

//手动模式下发送泵的串口
function SendUart()
{
  var uartText = document.getElementById('uartInput').value;
  if(uartText.length>60)
  {
    $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
      title: 'Note',
      content: '请勿输入超过60个字符',
      type:'red',
    });
  }
  else{
    var msg = {
      MsgType:3,
      FuncType:6,
      UartText:uartText
    };
    var jsonString = JSON.stringify(msg);
    ws.send(jsonString);
  }
  
}

//------------------------- 自动模式功能函数 end --------- --------------------------
//#################################################################################

//#################################################################################
//-------------------------canavas 绘制 begin--------------------------------------
//xy： 使用canvas绘制化学反应的流程框图
function canvas_draw()
{
  // var canvas = document.getElementById('tutorial');
  if(!canvas.getContext) {
    console("canvas getContext failed!")
    return;
  }
  //写字
  // 设置字体和颜色  
  ctx.font = "30px Oblique"; // 设置字体大小和类型  
  ctx.fillStyle = "#cc0000"; // 设置填充颜色为红色
  //ctx.fillText("拓扑映射结果", 20, 50); 
  ctx.fillStyle = "#000000"; // 设置填充颜色为红色
  // var ctx = canvas.getContext("2d");
  //xy： 加载本地化学反应流程图元件并设置其在canvas画布上的坐标
  canvasLoadImg();
  //xy: 使用canvas绘制器件间的的连接
  canvasDrawConnections();
}


//xy: 加载本地化学反应流程图元件及文字说明，并设置其在canvas画布上的坐标
function canvasLoadImg()
{
  //设置字体
  ctx.font = "10px sans-serif"
  // ---------------  玻璃瓶（单个） -----------------------------
  var img_bottle_1 = new Image();  //element6
  img_bottle_1.onload = function() {        
    ctx.drawImage(img_bottle_1, 285, 80, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_1.src = '/images/Chemical_Instruments/bottle.png';
  ctx.fillText("Waste", 290, 150); 

  var img_bottle_2 = new Image();  //element8
  img_bottle_2.onload = function() {        
    ctx.drawImage(img_bottle_2, 390, 180, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_2.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Intermediate", 394, 250);

  var img_bottle_3 = new Image();  //element11
  img_bottle_3.onload = function() {        
    ctx.drawImage(img_bottle_3, 590, 90, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_3.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Reagent 4",590,160);

  var img_bottle_4 = new Image();  //element16
  img_bottle_4.onload = function() {        
    ctx.drawImage(img_bottle_4, 750-60, 170, 28, 59);
    // ctx.drawImage(img_bottle_4, 750, 170, 20, 35);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_4.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Reagent 5", 750-60, 240);
  // ctx.fillText("水相", 750, 215);

  var img_bottle_5 = new Image();  //element18
  img_bottle_5.onload = function() {        
    ctx.drawImage(img_bottle_5, 850+50, 170, 28, 59);
    // ctx.drawImage(img_bottle_5, 850, 170, 20, 35);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_5.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Reagent 6", 845+55, 240);
  // ctx.fillText("有机相", 845, 215);

  var img_bottle_6 = new Image();  //element19
  img_bottle_6.onload = function() {        
    ctx.drawImage(img_bottle_6, 697+50, 330, 28, 59);
    // ctx.drawImage(img_bottle_6, 697, 330, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_6.src = '/images/Chemical_Instruments/bottle.png';
  ctx.fillText("Aqueous Phase", 700+20, 400);
  // ctx.fillText("水相", 700, 400);

  var img_bottle_7 = new Image();  //element21
  img_bottle_7.onload = function() {       
    ctx.drawImage(img_bottle_7, 670, 360, 28, 59); 
    // ctx.drawImage(img_bottle_7, 845, 390, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_7.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Waste", 673, 430);
  // ctx.fillText("废液", 848, 460);

  var img_bottle_8 = new Image();  //element22
  img_bottle_8.onload = function() {    
    ctx.drawImage(img_bottle_8, 797, 330, 28, 59);    
    // ctx.drawImage(img_bottle_8, 815, 410, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_8.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Organic Phase", 795, 400);
  // ctx.fillText("利多卡因", 805, 480);

  var img_bottle_9 = new Image();  //element25
  img_bottle_9.onload = function() {        
    ctx.drawImage(img_bottle_9, 240, 463, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_9.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Reagent 7",240,533);

  var img_bottle_10 = new Image();  //element28
  img_bottle_10.onload = function() {        
    ctx.drawImage(img_bottle_10, 600, 440, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_10.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Waste", 605, 510);

  var img_bottle_11 = new Image();  //element29
  img_bottle_11.onload = function() {        
    ctx.drawImage(img_bottle_11, 570, 460, 28, 59);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_bottle_11.src = '/images/Chemical_Instruments/bottle.png'; 
  ctx.fillText("Diazepam", 570, 530);

  // ---------------   玻璃瓶（多个）  -------------------------- 
  var img_bottles_1 = new Image();  //element1
  img_bottles_1.onload = function() {        
    ctx.drawImage(img_bottles_1, 135, 180, 28, 59); 
    // ctx.drawImage(img_bottles_1, 80, 180, 80, 60);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  }; 
  // img_bottles_1.src = '/images/Chemical_Instruments/bottles.png'; 
  img_bottles_1.src = '/images/Chemical_Instruments/bottle.png';
  ctx.fillText("Reagent 1", 135, 255);
  // ctx.fillText("底物1", 100, 260);

  var img_bottles_2 = new Image();  //element2 
  img_bottles_2.onload = function() {        
    ctx.drawImage(img_bottles_2, 135, 300, 28, 59);
    // ctx.drawImage(img_bottles_2, 80, 300, 80, 60);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  // img_bottles_2.src = '/images/Chemical_Instruments/bottles.png';
  img_bottles_2.src = '/images/Chemical_Instruments/bottle.png';
  ctx.fillText("Reagent 2", 135, 375);
  // ctx.fillText("底物2", 100, 380);

  // ---------------   加热芯片 ------------------------
  var img_chip_1 = new Image();  //element5
  img_chip_1.onload = function() {        
    ctx.drawImage(img_chip_1, 270, 200, 57, 52);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_chip_1.src = '/images/Chemical_Instruments/chip.png'; 
  ctx.fillText("Reactor 1", 285, 262);
  //ctx.fillText("温度 :         ℃",270,195);
  //ctx.fillText(Elem5_Temp,300,195);

  var img_chip_2 = new Image();  //element12
  img_chip_2.onload = function() {        
    ctx.drawImage(img_chip_2, 500, 200, 85, 78);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_chip_2.src = '/images/Chemical_Instruments/chip.png';
  ctx.fillText("Heater 1", 515, 288);
  ctx.fillText("Reactor 1:            ℃",497,185);
  ctx.fillText("Reactor 2:            ℃",497,200);
  ctx.fillText(30,549,185);
  ctx.fillText(30,549,200);

  var img_chip_3 = new Image();  //element23
  img_chip_3.onload = function() {        
    ctx.drawImage(img_chip_3, 370, 320, 85, 78);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_chip_3.src = '/images/Chemical_Instruments/chip.png';
  ctx.fillText("Heater 2", 385, 408);
  ctx.fillText("Reactor 1:            ℃",367,305);
  ctx.fillText("Reactor 2:            ℃",367,320);
  ctx.fillText(30,419,305);
  ctx.fillText(30,419,320);

  // ---------------   液液分离装置  ---------------  
  var img_separationDevice = new Image();  //element14
  img_separationDevice.onload = function() {      
    ctx.drawImage(img_separationDevice, 680+50, 270, 106, 40);  
    // ctx.drawImage(img_separationDevice, 680, 270, 106, 40);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_separationDevice.src = '/images/Chemical_Instruments/Liquid-liquidSeparationDevice.png'; 
  ctx.fillText("Separator", 700+50, 320);
  // ctx.fillText("液液分离装置", 700, 320);

  // ---------------   压力传感器、背压阀  ---------------  
  var img_pressureSensor_1 = new Image();  //element13
  img_pressureSensor_1.onload = function() {        
    ctx.drawImage(img_pressureSensor_1, 590, 290, 55, 20);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pressureSensor_1.src = '/images/Chemical_Instruments/PressureSensor_BackPressureValve.png'; 
  ctx.fillText("Pressure Sensor 1", 580, 315);
  ctx.fillText("Pressure :            mbar",580,285);
  ctx.fillText(69,605,285);

  var img_pressureSensor_2 = new Image();  //element26
  img_pressureSensor_2.onload = function() {        
    ctx.drawImage(img_pressureSensor_2, 455, 415, 55, 20);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pressureSensor_2.src = '/images/Chemical_Instruments/PressureSensor_BackPressureValve.png'; 
  ctx.fillText("Pressure Sensor 2", 445, 440);
  ctx.fillText("Pressure :            mbar",445,410);
  ctx.fillText(69,470,410);
  
  // ---------------   泵    ---------------  
  var img_pump_1 = new Image();  //element3
  img_pump_1.onload = function() {        
    ctx.drawImage(img_pump_1, 180, 150, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_1.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 1", 195, 260);

  var img_pump_2 = new Image();  //element4
  img_pump_2.onload = function() {        
    ctx.drawImage(img_pump_2, 180, 270, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_2.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 2", 195, 380);

  var img_pump_3 = new Image();  //element9
  img_pump_3.onload = function() {        
    ctx.drawImage(img_pump_3, 430, 50, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_3.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 3", 445, 160);

  var img_pump_4 = new Image();  //element10
  img_pump_4.onload = function() {        
    ctx.drawImage(img_pump_4, 520, 50, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_4.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 4", 535, 160);

  var img_pump_6 = new Image();  //element15
  img_pump_6.onload = function() {    
    ctx.drawImage(img_pump_6, 690+50, 120, 50, 100);    
    // ctx.drawImage(img_pump_6, 690, 120, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_6.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 5", 705+50, 230);
  // ctx.fillText("泵6", 705, 230);

  var img_pump_7 = new Image();  //element17
  img_pump_7.onload = function() {        
    ctx.drawImage(img_pump_7, 790+50, 120, 50, 100);
    // ctx.drawImage(img_pump_7, 790, 120, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_7.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 6", 805+50, 230);
  // ctx.fillText("泵7", 805, 230);

  var img_pump_5 = new Image();  //element24
  img_pump_5.onload = function() {        
    ctx.drawImage(img_pump_5, 290, 420, 50, 100);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_pump_5.src = '/images/Chemical_Instruments/pump.png';
  ctx.fillText("Pump 7", 305, 530);

  // ---------------   六通切换阀  ---------------  
  var img_SwValve_1 = new Image();  //element7
  img_SwValve_1.onload = function() {        
    ctx.drawImage(img_SwValve_1, 335, 250, 30, 30);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_SwValve_1.src = '/images/Chemical_Instruments/SwitchingValve.png';
  ctx.fillText("Valve 1",333,290);

  var img_SwValve_2 = new Image();  //element20
  img_SwValve_2.onload = function() {        
    ctx.drawImage(img_SwValve_2, 670, 280, 30, 30);
    // ctx.drawImage(img_SwValve_2, 770, 350, 30, 30);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_SwValve_2.src = '/images/Chemical_Instruments/SwitchingValve.png';
  ctx.fillText("Valve 2",668,320);

  var img_SwValve_3 = new Image();  //element27
  img_SwValve_3.onload = function() {        
    ctx.drawImage(img_SwValve_3, 540, 402, 30, 30);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
  };  
  img_SwValve_3.src = '/images/Chemical_Instruments/SwitchingValve.png';
  ctx.fillText("Valve 3",538,442);
}


//xy: 使用canvas绘制器件间的的连接
function canvasDrawConnections()
{
  //xy: 设置线条样式
  ctx.lineWidth=5; //设置线条宽度
  ctx.lineCap="round";//同一个 path 内，设定线条与线条间接合处的样式,共有 3 个值 round, bevel 和 miter
  //设置颜色为紫色--利多卡因路线
  ctx.strokeStyle=`rgba(136,83,175,0.6)`;  //设置图形轮廓的颜色和透明度 

  //xy:draw the connections between element1 and element3
  ctx.beginPath(); //新建一条path
  ctx.moveTo(150, 200); //把画笔移动到指定的坐标
  ctx.lineTo(150, 170);  //绘制一条从当前位置到指定坐标的直线.
  ctx.lineTo(200, 170);  //绘制一条从当前位置到指定坐标的直线.
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element2 and element4
  ctx.beginPath(); //新建一条path
  ctx.moveTo(150, 320); //把画笔移动到指定的坐标
  ctx.lineTo(150, 290);  //绘制一条从当前位置到指定坐标的直线.
  ctx.lineTo(200, 290);  //绘制一条从当前位置到指定坐标的直线.
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element3、 element4 and element5
  ctx.beginPath(); //新建一条path
  ctx.moveTo(200, 180); 
  ctx.lineTo(240, 180);  
  ctx.lineTo(240, 300);  
  ctx.lineTo(200, 300);
  ctx.moveTo(240, 270);
  ctx.lineTo(265, 270);
  ctx.lineTo(280, 250);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element7 and element5
  ctx.beginPath(); //新建一条path
  ctx.moveTo(315, 250); 
  ctx.lineTo(300,270); 
  ctx.lineTo(335,270); 
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element7 and element6
  ctx.beginPath(); //新建一条path
  ctx.moveTo(350, 250); 
  ctx.lineTo(350,70); 
  ctx.lineTo(300,70); 
  ctx.lineTo(300,120);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element7 and element8
  ctx.beginPath(); //新建一条path
  ctx.moveTo(360, 260); 
  ctx.lineTo(370,250); 
  ctx.lineTo(370,170); 
  ctx.lineTo(400,170);
  ctx.lineTo(400,200);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element7 、element23 and element24
  ctx.beginPath(); //新建一条path
  ctx.moveTo(350, 280); 
  ctx.lineTo(350,450); 
  ctx.lineTo(330,450); 
  ctx.moveTo(350,420);
  ctx.lineTo(370,420);
  ctx.lineTo(390,390);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element24 and element25
  ctx.beginPath(); //新建一条path
  ctx.moveTo(300, 450); 
  ctx.lineTo(255,450); 
  ctx.lineTo(255,480); 
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element23 and element26
  ctx.beginPath(); //新建一条path
  ctx.moveTo(440, 390); 
  ctx.lineTo(420,420); 
  ctx.lineTo(470,420); 
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element26 and element27
  ctx.beginPath(); //新建一条path
  ctx.moveTo(490, 420); 
  ctx.lineTo(550,420);  
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element27 and element29
  ctx.beginPath(); //新建一条path
  ctx.moveTo(560, 420); 
  ctx.lineTo(585,440);  
  ctx.lineTo(585,480);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element27 and element28
  ctx.beginPath(); //新建一条path
  ctx.moveTo(560, 410); 
  ctx.lineTo(615,410);  
  ctx.lineTo(615,460);
  ctx.stroke(); //绘制路径。

  //设置颜色为绿色--利多卡因路线
  ctx.strokeStyle=`rgba(6, 177, 87,0.6)`;  //设置图形轮廓的颜色和透明度36, 177, 87

  //xy:draw the connections between element8 and element9
  ctx.beginPath(); //新建一条path
  ctx.moveTo(410, 200); 
  ctx.lineTo(410,80);  
  ctx.lineTo(440,80);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element10 and element11
  ctx.beginPath(); //新建一条path
  ctx.moveTo(550, 80); 
  ctx.lineTo(605,80);  
  ctx.lineTo(605,100);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element9、element10 and element12
  ctx.beginPath(); //新建一条path
  ctx.moveTo(470, 80); 
  ctx.lineTo(520,80); 
  ctx.moveTo(495, 80); 
  ctx.lineTo(495,295);
  ctx.lineTo(515,278);
  ctx.stroke(); //绘制路径。

  //xy:draw the connections between element12 and element13
  ctx.beginPath(); //新建一条path
  ctx.moveTo(565, 278); 
  ctx.lineTo(545,295); 
  ctx.lineTo(600,295);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element13 and element14
  ctx.beginPath(); //新建一条path
  ctx.moveTo(630, 295); 
  ctx.lineTo(700,295); 
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element14 and element15
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(700, 220);
  // ctx.lineTo(700, 230);
  // ctx.lineTo(710, 240); 
  // ctx.lineTo(710,275); 
  ctx.moveTo(700+50, 220);
  ctx.lineTo(700+50, 230);
  ctx.lineTo(710+50, 240); 
  ctx.lineTo(710+50,275);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element15 and element16
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(735, 150); 
  // ctx.lineTo(760,150); 
  // ctx.lineTo(760,170);
  ctx.moveTo(750, 150); 
  ctx.lineTo(705,150); 
  ctx.lineTo(705,170);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element17 and element18
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(835, 150); 
  // ctx.lineTo(860,150); 
  // ctx.lineTo(860,170);
  ctx.moveTo(835+50, 150); 
  ctx.lineTo(860+50,150); 
  ctx.lineTo(860+50,170);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element14 and element17
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(800, 220); 
  // ctx.lineTo(800,230); 
  // ctx.lineTo(780,250); 
  // ctx.lineTo(780,275);
  ctx.moveTo(800+50, 220); 
  ctx.lineTo(800+50,230); 
  ctx.lineTo(780+50,250); 
  ctx.lineTo(780+50,275);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element14 and element19
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(710, 305); 
  // ctx.lineTo(710,360); 
  ctx.moveTo(710+50, 305); 
  ctx.lineTo(710+50,360);
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element14 and element22
  ctx.beginPath(); //新建一条path
  ctx.moveTo(810, 305); 
  ctx.lineTo(810,360); 
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element14 and element20
  ctx.beginPath(); //新建一条path
  ctx.moveTo(700, 295); 
  ctx.lineTo(770,295); 
  ctx.stroke(); //绘制路径

  //xy:draw the connections between element20 and element21
  ctx.beginPath(); //新建一条path
  // ctx.moveTo(780, 355); 
  // ctx.lineTo(830,405);
  // ctx.lineTo(830,420); 
  ctx.moveTo(685, 290); 
  ctx.lineTo(685,370);
  ctx.stroke(); //绘制路径

  // //xy:draw the connections between element20 and element22
  // ctx.beginPath(); //新建一条path
  // ctx.moveTo(780, 358); 
  // ctx.lineTo(858,358);
  // ctx.lineTo(858,400); 
  // ctx.stroke(); //绘制路径

  
}

//-------------------------canavas 绘制 end--------------------------------------
//#################################################################################

//#################################################################################
//-------------------------canavas元素函数处理 begin--------------------------------------
////xy: 添加点击事件监听器  
canvas.addEventListener('click', function(event) {  
  // 获取鼠标点击位置
  //xy:
  //坐标系问题：canvas的坐标系与浏览器的坐标系不同,在canvas中，坐标的原点在canvas的左上角，x轴向右延伸，y轴向下延伸。
  //而浏览器窗口的坐标系中，原点在窗口的左上角，x轴向右延伸，y轴向上延伸。这可能导致在canvas中获取的鼠标点击位置与实际位置存在偏差。
  //由于canvas使用了CSS绝对定位，因此如果不对获取鼠标位置的函数人为修正，则会出现点击偏差问题。
  var x = event.clientX - canvas.offsetLeft - 40;   // -40调整位置 
  var y = event.clientY - canvas.offsetTop - 80;    // -90调整位置 
    
  // 检查鼠标点击位置是否在图像元素范围内  
  if (x >= 285 && x <= 313 && y >= 80 && y <= 139) {   //element6
    ChangeElemCard(6);      
  } else if (x >= 390 && x <= 418 && y >= 180 && y <= 239) {  //element8
    ChangeElemCard(8);    
  } else if (x >= 590 && x <= 618 && y >= 90 && y <= 149) {  //element11
    ChangeElemCard(11);    
  // } else if (x >= 750 && x <= 770 && y >= 170 && y <= 205) {  //element16
  } else if (x >= 750-60 && x <= 778-60 && y >= 170 && y <= 229) {  //element16
    ChangeElemCard(16);    
  // } else if (x >= 850 && x <= 870 && y >= 170 && y <= 205) {  //element18
  } else if (x >= 850+50 && x <= 878+50 && y >= 170 && y <= 229) {  //element18
    ChangeElemCard(18);    
  // } else if (x >= 697 && x <= 725 && y >= 330 && y <= 389) {  //element19
  } else if (x >= 697+50 && x <= 725+50 && y >= 330 && y <= 389) {  //element19
    ChangeElemCard(19);    
  // } else if (x >= 845 && x <= 873 && y >= 390 && y <= 449) {  //element21
  } else if (x >= 670 && x <= 698 && y >= 360 && y <= 419) {  //element21
    ChangeElemCard(21);    
  // } else if (x >= 815 && x <= 843 && y >= 410 && y <= 469) {  //element22
  } else if (x >= 797 && x <= 825 && y >= 330 && y <= 389) {  //element22
    ChangeElemCard(22);    
  } else if (x >= 240 && x <= 268 && y >= 463 && y <= 522) {  //element25
    ChangeElemCard(25);    
  } else if (x >= 600 && x <= 628 && y >= 440 && y <= 499) {  //element28
    ChangeElemCard(28);    
  } else if (x >= 570 && x <= 598 && y >= 460 && y <= 519) {  //element29
    ChangeElemCard(29);    
  // } else if (x >= 80 && x <= 160 && y >= 180 && y <= 240) {  //element1
  } else if (x >= 135 && x <= 163 && y >= 180 && y <= 239) {  //element1
    ChangeElemCard(1);    
  } else if (x >= 135 && x <= 163 && y >= 300 && y <= 359) {  //element2
    ChangeElemCard(2);    
  } else if (x >= 270 && x <= 422 && y >= 200 && y <= 252) {  //element5
    ChangeElemCard(5);    
  } else if (x >= 500 && x <= 585 && y >= 200 && y <= 278) {  //element12
    ChangeElemCard(12);    
  } else if (x >= 370 && x <= 455 && y >= 320 && y <= 398) {  //element23
    ChangeElemCard(23);    
  // } else if (x >= 680 && x <= 786 && y >= 270 && y <= 310) {  //element14
  } else if (x >= 680+50 && x <= 786+50 && y >= 270 && y <= 310) {  //element14
    ChangeElemCard(14);    
  } else if (x >= 590 && x <= 645 && y >= 290 && y <= 310) {  //element13
    ChangeElemCard(13);       
  } else if (x >= 455 && x <= 510 && y >= 415 && y <= 435) {  //element26
    ChangeElemCard(26);    
  } else if (x >= 180 && x <= 230 && y >= 150 && y <= 250) {  //element3
    ChangeElemCard(3);    
  } else if (x >= 180 && x <= 230 && y >= 270 && y <= 370) {  //element4
    ChangeElemCard(4);    
  } else if (x >= 430 && x <= 480 && y >= 50 && y <= 150) {  //element9
    ChangeElemCard(9);    
  } else if (x >= 520 && x <= 570 && y >= 50 && y <= 150) {  //element10
    ChangeElemCard(10);    
  // } else if (x >= 690 && x <= 740 && y >= 120 && y <= 220) {  //element15
  } else if (x >= 690+50 && x <= 740+50 && y >= 120 && y <= 220) {  //element15
    ChangeElemCard(15);    
  // } else if (x >= 790 && x <= 840 && y >= 120 && y <= 220) {  //element17
  } else if (x >= 790+50 && x <= 840+50 && y >= 120 && y <= 220) {  //element17
    ChangeElemCard(17);    
  } else if (x >= 290 && x <= 340 && y >= 420 && y <= 520) {  //element24
    ChangeElemCard(24);    
  } else if (x >= 335 && x <= 365 && y >= 250 && y <= 280) {  //element7
    ChangeElemCard(7);    
  // } else if (x >= 770 && x <= 800 && y >= 350 && y <= 380) {  //element20
  } else if (x >= 670 && x <= 700 && y >= 280 && y <= 310) {  //element20
    ChangeElemCard(20);    
  } else if (x >= 540 && x <= 570 && y >= 402 && y <= 432) {  //element27
    ChangeElemCard(27);    
  }else{
    //点击非可操作元素的位置，啥也不做
  }
});  



//xy: 根据点击的元素，修改jade界面对应card的display属性（block or none)
//xy: 这种操作师承fsj学姐~
function ChangeElemCard(elem_id)
{
  console.log("click element",elem_id);
  currentElem = elem_id;
  //xy:清空所有卡片并设置需要显示的卡片display
  for(var i = 0; i < elem_array.length; i++)
  {
    elem_array[i].style.display = 'none';
  }
  elem_array[elem_id-1].style.display = 'block';
}

//xy:点击拓扑中的元素对应card的“设置”后的界面修改
function SetElemParam(elem_id)
{
  var elem_cb_show;
  var elem_cb_set;

  //使用模板字符串 
  var elemID1 = `elem${elem_id}cb_show`; 
  //console.log(elemID1);
  var elemID2 = `elem${elem_id}cb_set`;  
  //console.log(elemID2);
  
  elem_cb_show = document.getElementById(elemID1);
  elem_cb_set = document.getElementById(elemID2);
  elem_cb_show.style.display = 'none';
  elem_cb_set.style.display = 'block';
}

function SaveElemParam_Disp(elem_id)
{
  var elem_cb_show;
  var elem_cb_set;

  if(elem_id=='0')  //设置参数界面点击取消
  {
    //使用模板字符串 
    var elemID1 = `elem${currentElem}cb_show`; 
    //console.log(elemID1);
    var elemID2 = `elem${currentElem}cb_set`;  
    //console.log(elemID2);
  }
  else
  {
    //使用模板字符串 
    var elemID1 = `elem${elem_id}cb_show`; 
    //console.log(elemID1);
    var elemID2 = `elem${elem_id}cb_set`;  
    //console.log(elemID2);
  }
  
  elem_cb_show = document.getElementById(elemID1);
  elem_cb_set = document.getElementById(elemID2);
  elem_cb_set.style.display = 'none';
  elem_cb_show.style.display = 'block';
}


//xy:保存所设置的参数
function SaveElemParam(elem_id)
{
  // var elem_cb_show;
  // var elem_cb_set;
  switch(elem_id)
  {
    case '0'://设置参数界面点击取消
      SaveElemParam_Disp(elem_id);     
      break;
    case '1':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:0,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '2':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:1,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '3':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '4':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '5':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Chip,   
        DevId:0,
        chipType:0, //普通芯片
        data:[Number(document.getElementById(`ChemElem${elem_id}_Capacity`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);

      break;
    case '6':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:2,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '7':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        NetType:NetId0,
        DevType:Valve,   //切换阀
        DevId:0,
        data:[Number(document.getElementById(`ChemElem${elem_id}_Channels`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '8':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:3,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '9':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '10':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '11':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:4,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '12':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        NetType:NetId1,
        DevType:Chip,   //芯片
        DevId:1,
        chipType:1, //加热芯片
        data:[
          Number(document.getElementById(`ChemElem${elem_id}_Capacity`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Temp1`).value),
          Number(document.getElementById(`ChemElem${elem_id}_HeatingRate1_Slider`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Temp2`).value),
          Number(document.getElementById(`ChemElem${elem_id}_HeatingRate2_Slider`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Threshold`).value)
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '13':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,
        ElemId:elem_id,
        DevType:PressureSensor,
        DevId:0,
        data:[Number(document.getElementById(`ChemElem${elem_id}_Threshold`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '14':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '15':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '16':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:5,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '17':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '18':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:6,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '19':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:7,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '20':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        NetType:NetId2,
        DevType:Valve,   //切换阀
        DevId:1,
        data:[Number(document.getElementById(`ChemElem${elem_id}_Channels`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '21':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:8,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '22':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:9,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '23':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        NetType:NetId3,
        DevType:Chip,   //芯片
        DevId:2,
        chipType:1, //加热芯片
        data:[
          Number(document.getElementById(`ChemElem${elem_id}_Capacity`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Temp1`).value),
          Number(document.getElementById(`ChemElem${elem_id}_HeatingRate1_Slider`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Temp2`).value),
          Number(document.getElementById(`ChemElem${elem_id}_HeatingRate2_Slider`).value),
          Number(document.getElementById(`ChemElem${elem_id}_Threshold`).value)
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '24':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存

      break;
    case '25':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      //数据保存,这里我傻逼了，html上取名应该统一一下的，然后使用模板字符串+for循环很快就搞定了，不用一行一行来。后续改进
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:10,
        BottleType:0,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name1`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity1`).value),
          document.getElementById(`ChemElem${elem_id}_Name2`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity2`).value),
          document.getElementById(`ChemElem${elem_id}_Name3`).value,
          Number(document.getElementById(`ChemElem${elem_id}_Capacity3`).value)       
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '26':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,
        ElemId:elem_id,
        DevType:PressureSensor,
        DevId:1,
        data:[Number(document.getElementById(`ChemElem${elem_id}_Threshold`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '27':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        NetType:NetId3,
        DevType:Valve,   //切换阀
        DevId:2,
        data:[Number(document.getElementById(`ChemElem${elem_id}_Channels`).value)]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '28':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:11,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    case '29':
      //切换为显示界面
      SaveElemParam_Disp(elem_id);
      //数据保存
      var MsgtoBack = {
        MsgType:5,
        // FuncType:4,   //设置参数功能
        ElemId:elem_id,
        DevType:Bottle,   //瓶子
        DevId:12,
        BottleType:1,
        data:[
          document.getElementById(`ChemElem${elem_id}_Name`).value      
        ]
      }
      var jsonString = JSON.stringify(MsgtoBack);
      ws.send(jsonString);
      break;
    default:

      break;
  }
}
//-------------------------canavas元素函数处理 end--------------------------------------
//#################################################################################






//定时更新参数
//拓扑是死的，所以每个器件是死的，生成的网页界面是死的，每个器件的参数是定好的，
//本想把更新数据写成活的 但貌似这在未来能用到的概率几乎为零 那我也不麻烦了时间紧迫 写死！
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
  
  
  

  // CANVAS更新拓扑监测值，在别的地方修改数值，这里只负责显示
  // //elem5 芯片温度  
  // ctx.clearRect(295, 185, 25, 15);    //context.clearRect(x,y,width,height);  
  // ctx.fillText(Elem5_Temp, 300, 195);
  //elem12 芯片温度  
  ctx.clearRect(545, 175, 28, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.chips.chip2.Val2, 548, 185);
  ctx.clearRect(545, 185, 28, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.chips.chip2.Val4, 548, 200);
  //elem23 芯片温度  
  ctx.clearRect(415, 295, 28, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.chips.chip3.Val2, 418, 305);
  ctx.clearRect(415, 305, 28, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.chips.chip3.Val4, 418, 320);
  //elem13压力传感器压力值
  ctx.clearRect(602, 275, 38, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.PressureSensors.pressensor1.Val1, 605, 285);
  //elem26压力传感器压力值
  ctx.clearRect(467, 400, 38, 15);      
  ctx.fillText(wsMsg_ToShowRegularly.PressureSensors.pressensor2.Val1, 470, 410);
  //---------------更改canvas显示参数 end------------------------

  //---------------更新showcard上显示的数据 begin--------------------
  //Elem1
  document.getElementById("ChemElem1_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val1;
  document.getElementById("ChemElem1_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val2;
  document.getElementById("ChemElem1_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val3;
  document.getElementById("ChemElem1_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val4;
  document.getElementById("ChemElem1_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val5;
  document.getElementById("ChemElem1_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle1.Val6;
  //Elem2
  document.getElementById("ChemElem2_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val1;
  document.getElementById("ChemElem2_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val2;
  document.getElementById("ChemElem2_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val3;
  document.getElementById("ChemElem2_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val4;
  document.getElementById("ChemElem2_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val5;
  document.getElementById("ChemElem2_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle2.Val6;
  //Elem6
  document.getElementById("ChemElem6_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle3.Val1;
  //Elem8
  document.getElementById("ChemElem8_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val1;
  document.getElementById("ChemElem8_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val2;
  document.getElementById("ChemElem8_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val3;
  document.getElementById("ChemElem8_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val4;
  document.getElementById("ChemElem8_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val5;
  document.getElementById("ChemElem8_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle4.Val6;
  //Elem11
  document.getElementById("ChemElem11_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val1;
  document.getElementById("ChemElem11_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val2;
  document.getElementById("ChemElem11_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val3;
  document.getElementById("ChemElem11_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val4;
  document.getElementById("ChemElem11_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val5;
  document.getElementById("ChemElem11_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle5.Val6;
  //Elem16
  document.getElementById("ChemElem16_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val1;
  document.getElementById("ChemElem16_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val2;
  document.getElementById("ChemElem16_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val3;
  document.getElementById("ChemElem16_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val4;
  document.getElementById("ChemElem16_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val5;
  document.getElementById("ChemElem16_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle6.Val6;
  //Elem18
  document.getElementById("ChemElem18_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val1;
  document.getElementById("ChemElem18_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val2;
  document.getElementById("ChemElem18_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val3;
  document.getElementById("ChemElem18_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val4;
  document.getElementById("ChemElem18_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val5;
  document.getElementById("ChemElem18_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle7.Val6;
  //Elem19
  document.getElementById("ChemElem19_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle8.Val1;
  //Elem21
  document.getElementById("ChemElem21_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle9.Val1;
  //Elem22
  document.getElementById("ChemElem22_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle10.Val1;
  //Elem25
  document.getElementById("ChemElem25_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val1;
  document.getElementById("ChemElem25_Val2").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val2;
  document.getElementById("ChemElem25_Val3").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val3;
  document.getElementById("ChemElem25_Val4").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val4;
  document.getElementById("ChemElem25_Val5").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val5;
  document.getElementById("ChemElem25_Val6").textContent = wsMsg_ToShowRegularly.Bottles.bottle11.Val6;
  //Elem28
  document.getElementById("ChemElem28_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle12.Val1;
  //Elem29
  document.getElementById("ChemElem29_Val1").textContent = wsMsg_ToShowRegularly.Bottles.bottle13.Val1;

  //Elem3
  document.getElementById("ChemElem3_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump1.Val1;
  document.getElementById("ChemElem3_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump1.Val2;
  document.getElementById("ChemElem3_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump1.Val3;
  //Elem4
  document.getElementById("ChemElem4_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump2.Val1;
  document.getElementById("ChemElem4_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump2.Val2;
  document.getElementById("ChemElem4_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump2.Val3;
  //Elem9
  document.getElementById("ChemElem9_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump3.Val1;
  document.getElementById("ChemElem9_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump3.Val2;
  document.getElementById("ChemElem9_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump3.Val3;
  //Elem10
  document.getElementById("ChemElem10_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump4.Val1;
  document.getElementById("ChemElem10_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump4.Val2;
  document.getElementById("ChemElem10_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump4.Val3;
  //Elem15
  document.getElementById("ChemElem15_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump5.Val1;
  document.getElementById("ChemElem15_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump5.Val2;
  document.getElementById("ChemElem15_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump5.Val3;
  //Elem17
  document.getElementById("ChemElem17_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump6.Val1;
  document.getElementById("ChemElem17_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump6.Val2;
  document.getElementById("ChemElem17_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump6.Val3;
  //Elem24
  document.getElementById("ChemElem24_Val1").textContent = wsMsg_ToShowRegularly.Pumps.pump7.Val1;
  document.getElementById("ChemElem24_Val2").textContent = wsMsg_ToShowRegularly.Pumps.pump7.Val2;
  document.getElementById("ChemElem24_Val3").textContent = wsMsg_ToShowRegularly.Pumps.pump7.Val3;

  //Elem5
  document.getElementById("ChemElem5_Val1").textContent = wsMsg_ToShowRegularly.chips.chip1.Val1;
  //Elem12
  document.getElementById("ChemElem12_Val1").textContent = wsMsg_ToShowRegularly.chips.chip2.Val1;
  document.getElementById("ChemElem12_Val2").textContent = wsMsg_ToShowRegularly.chips.chip2.Val2;
  document.getElementById("ChemElem12_Val3").textContent = wsMsg_ToShowRegularly.chips.chip2.Val3;
  document.getElementById("ChemElem12_Val4").textContent = wsMsg_ToShowRegularly.chips.chip2.Val4;
  document.getElementById("ChemElem12_Val5").textContent = wsMsg_ToShowRegularly.chips.chip2.Val5;
  document.getElementById("ChemElem12_Val6").textContent = wsMsg_ToShowRegularly.chips.chip2.Val6;
  document.getElementById("ChemElem12_Val7").textContent = wsMsg_ToShowRegularly.chips.chip2.Val7;
  document.getElementById("ChemElem12_Val8").textContent = wsMsg_ToShowRegularly.chips.chip2.Val8;
  //Elem23
  document.getElementById("ChemElem23_Val1").textContent = wsMsg_ToShowRegularly.chips.chip3.Val1;
  document.getElementById("ChemElem23_Val2").textContent = wsMsg_ToShowRegularly.chips.chip3.Val2;
  document.getElementById("ChemElem23_Val3").textContent = wsMsg_ToShowRegularly.chips.chip3.Val3;
  document.getElementById("ChemElem23_Val4").textContent = wsMsg_ToShowRegularly.chips.chip3.Val4;
  document.getElementById("ChemElem23_Val5").textContent = wsMsg_ToShowRegularly.chips.chip3.Val5;
  document.getElementById("ChemElem23_Val6").textContent = wsMsg_ToShowRegularly.chips.chip3.Val6;
  document.getElementById("ChemElem23_Val7").textContent = wsMsg_ToShowRegularly.chips.chip3.Val7;
  document.getElementById("ChemElem23_Val8").textContent = wsMsg_ToShowRegularly.chips.chip3.Val8;
  //Elem13
  document.getElementById("ChemElem13_Val1").textContent = wsMsg_ToShowRegularly.PressureSensors.pressensor1.Val1;
  document.getElementById("ChemElem13_Val2").textContent = wsMsg_ToShowRegularly.PressureSensors.pressensor1.Val2;
  //Elem26
  document.getElementById("ChemElem26_Val1").textContent = wsMsg_ToShowRegularly.PressureSensors.pressensor2.Val1;
  document.getElementById("ChemElem26_Val2").textContent = wsMsg_ToShowRegularly.PressureSensors.pressensor2.Val2;

  //Elem7
  document.getElementById("ChemElem7_Val1").textContent = wsMsg_ToShowRegularly.SwitchingValves.swvalve1.Val1;
  //Elem20
  document.getElementById("ChemElem20_Val1").textContent = wsMsg_ToShowRegularly.SwitchingValves.swvalve2.Val1;
  //Elem27
  document.getElementById("ChemElem27_Val1").textContent = wsMsg_ToShowRegularly.SwitchingValves.swvalve3.Val1;

}

//初始化echart
function InitEchart()
{
  echartdom = document.getElementById('echartDom');
  pressure_echart = echarts.init(document.getElementById('PressureEchartDom'));
  tempreture_echart = echarts.init(document.getElementById('TempretureEchartDom'));
  pressure_echart.setOption(option1);
  tempreture_echart.setOption(option2);
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

//opencv.js加载完毕后，OpencvReady flag置1
function openCvReady()
{
  OpencvReady = 1;

  //首次运行引导用户，信任域名
  var first = window.localStorage.getItem('first');
  if(first == null ){
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        //调用用户媒体设备, 访问摄像头
        getUserMedia({video: {width: 978, height: 550}}, success, error);
    } else {
        alert('不支持访问用户媒体');
    }
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('menumerateDevices is not supported!');
  }else {
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices).catch(handleError);
  }

}


function ProcessVideo()
{
  //如果标志变量为false，则不执行函数  
  if(!shouldProcessVideo)
  {
    return;
  }
  //绘制剪裁过的video1
  /*drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) 剪切图像，并在画布上定位被剪切的部分 
    sx开始剪切图片的 x 坐标位置 
    sy开始剪切图片的 y 坐标位置
    sw被剪切图像的宽度（就是裁剪之前的图片宽度，这里的宽度若小于图片的原宽。则图片多余部分被剪掉；若大于，则会以空白填充）
    sh被剪切图像的高度（就是裁剪之前的图片高度）
    dx在画布上放置图像的 x 坐标位置
    dy在画布上放置图像的 y 坐标位置
    dw要使用的图像的宽度（就是裁剪之后的图片高度，放大或者缩放）
    dh要使用的图像的高度（就是裁剪之后的图片高度，放大或者缩放）
  */
  // xy: 以下drawImage函数第2，3个参数根据实际摄像头摆放位置微调 
  ctx2.drawImage(Sourcevideo1, 20, 150, 550, 220,0,0,dw,dh); 
  ctx3.drawImage(Sourcevideo2, 20, 130, 550, 220,0,0,dw,dh); 
  requestAnimationFrame(ProcessVideo);// 使用 requestAnimationFrame 以确保平滑的帧速率,如果标志变量为true，则再次调用自己 
}




// 遍历所有的设备，包括视频和音频设备,找到摄像头
function gotDevices(deviceInfos) {
  console.log(deviceInfos);
}

function handleError(error) {
  console.log('Error: ', error);
}

//访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
      //最新的标准API
      navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
  } else if (navigator.webkitGetUserMedia) {
      //webkit核心浏览器
      navigator.webkitGetUserMedia(constraints, success, error)
  } else if (navigator.mozGetUserMedia) {
      //firfox浏览器
      navigator.mozGetUserMedia(constraints, success, error);
  } else if (navigator.getUserMedia) {
      //旧版API
      navigator.getUserMedia(constraints, success, error);
  }
}
function success(stream) {
  console.log(stream);
  window.localStorage.setItem('first',"false");
  window.location.reload();
}
function error(error) {
  console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}



//拓扑监测
function TopologyDetection()
{
  //开启摄像头获取视频
  // 获取媒体设备列表  
  let cam1;
  let cam2;
  let cam1_deviceID;
  let cam2_deviceID;
  navigator.mediaDevices.enumerateDevices()  
    .then(function(devices) { 
      console.log(devices) 
      //选择要使用的设备(设备号我提前打印出来copy下来了，因此直接把ID写进代码里区分两个USB摄像头)
      //cam1 = devices.find(device => device.kind === 'videoinput' && device.deviceId ==='2222f17a3b65ba995903d162f2c3f4d507d9a441a14c7cabf85e4164e2c08138')
      cam1 = devices.find(device => device.kind === 'videoinput' && device.label === '2K USB Camera (2bdf:029a)');
      console.log('cam1',cam1);
      cam1_deviceID = cam1.deviceId;
      console.log('cam1_id:',cam1_deviceID);
      cam2 = devices.find(device => device.kind === 'videoinput' && device.label === '2K USB Camera (2bdf:029a)' && device.deviceId !== cam1_deviceID)
      console.log('cam2',cam2);
      cam2_deviceID = cam2.deviceId;
      console.log('cam2_id:',cam2_deviceID);
      // 获取媒体输入流并显示在视频元素中  
      navigator.mediaDevices.getUserMedia({ video: { deviceId: '2222f17a3b65ba995903d162f2c3f4d507d9a441a14c7cabf85e4164e2c08138'} })  
        .then(function(stream1){
          // 将流绑定到视频元素上
          Sourcevideo1.srcObject = stream1;
          Sourcevideo1.play();
          console.log('cam1 source 绑定成功！');
        })  
        .catch(function(error){
          console.log('无法访问摄像头1：' + error);
        });
      navigator.mediaDevices.getUserMedia({ video: { deviceId: cam2.deviceId } })  
        .then(function(stream2){
          // 将流绑定到视频元素上
          Sourcevideo2.srcObject = stream2;
          Sourcevideo2.play();
          console.log('cam2 source 绑定成功！');
        })  
        .catch(function(error){
          console.log('无法访问摄像头2：' + error);
        });  
    })
    .catch(function(err) {
    console.log("无法枚举设备： " + err);
  });
  //播放未处理的视频
  ProcessVideo();

}

//截取当前帧，对当前帧图像进行处理
function StartOpencvDetect()
{
  // 停止ProcessVideo()连续绘图
  shouldProcessVideo = false;
  //绘制一帧视频画面
  ctx2.drawImage(Sourcevideo1, 20, 150, 550, 220,0,0,dw,dh); 
  ctx3.drawImage(Sourcevideo2, 20, 130, 550, 220,0,0,dw,dh); 

  let src = cv.imread('CanvasOpencv_1');
  // //
  // let rgbaPlanes = new cv.MatVector()
  // // Split the Mat
  // cv.split(src, rgbaPlanes);
  // // Get R channel
  // let R = rgbaPlanes.get(0);
  let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U); 

  //定点圆形检测
  for (let i = 0; i < bottles.length; i++) {  
    const { x, y, radius, color } = bottles[i];  

    const row_start = Math.ceil(y - radius/2);
    const row_end = Math.ceil(y + radius/2);
    const col_start = Math.ceil(x - radius/2);
    const col_end = Math.ceil(x - radius/2);

    //计算区域颜色平均值
    var sum_r=0;
    var sum_g=0;
    var sum_b=0;
    var avg_r=0;
    var avg_g=0;
    var avg_b=0;
    var cnt=0;
    for(var row= row_start ; row<row_end+1; row++)
    {
      for(var col=col_start; col<col_end+1; col++)
      {
        cnt++;
        let R = src.ucharAt(row, col * src.channels());
        let G = src.ucharAt(row, col * src.channels() + 1);
        let B = src.ucharAt(row, col * src.channels() + 2);
        sum_r = sum_r + R;
        sum_g = sum_g + G;
        sum_b = sum_b + B;
      }
    }
    //获取这片区域R,G,B三个通道各自的均值
    avg_r = sum_r/cnt;
    avg_g = sum_g/cnt;
    avg_b = sum_b/cnt;

    //检测预定颜色值为红的圆
    if(color[0]==255)
    {
      //根据阈值检测判断是否在预设颜色范围内，然后在图像上绘制圆形或正方形 
      if(avg_r>=128 && avg_g <= 128 && avg_b <= 128){
        let color = new cv.Scalar(255, 0, 0, 100);
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color,3); // 如果在范围内，画圆形  
      }
      else{
        let color = new cv.Scalar(255, 255, 255 ,100);
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color, 3); // 如果在范围内，画圆形
        // cv.rectangle(src, {x: x - radius, y: y - radius}, {x: x + radius, y: y + radius}, color); // 如果不在范围内，画正方形  
      }


    }
    //检测预定颜色值为绿的圆
    else if(color[1]==255){
      //根据阈值检测判断是否在预设颜色范围内，然后在图像上绘制圆形或正方形 
      if(avg_g>=128 && avg_r <= 128 && avg_b <= 128){
        let color = new cv.Scalar(0, 255, 0, 100);
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color,3); // 如果在范围内，画圆形  
      }
      else{
        let color = new cv.Scalar(255, 255, 255 ,100);
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color, 3); // 如果在范围内，画圆形
        // cv.rectangle(src, {x: x - radius, y: y - radius}, {x: x + radius, y: y + radius}, color); // 如果不在范围内，画正方形  
      }
    }
    //检测预定颜色值为蓝的圆
    else if(color[2]==255){
      //根据阈值检测判断是否在预设颜色范围内，然后在图像上绘制圆形或正方形 
      if(avg_b>=128 && avg_r <= 128 && avg_g <= 128){
        let color = new cv.Scalar(0, 0, 255, 100);
        //let color = cv.Scalar(0, 0, 255); // RGB 蓝色
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color,3); // 如果在范围内，画圆形  
      }
      else{
        let color = new cv.Scalar(255, 255, 255 ,100);
        let center = new cv.Point(x, y);
        cv.circle(src, center, radius+3, color, 3); // 如果在范围内，画圆形
        // cv.rectangle(src, {x: x - radius, y: y - radius}, {x: x + radius, y: y + radius}, color); // 如果不在范围内，画正方形  
      }
    }
    else{

    }
      
    
  } 
  
  cv.imshow('CanvasOpencv_1', src);
  src.delete();
  dst.delete(); 
  // rgbaPlanes.delete();
  // R.delete();
  //-----hough圆形检测 begin ----------------
  // let src = cv.imread('CanvasOpencv_1');
  // let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
  // let circles = new cv.Mat();
  // let color = new cv.Scalar(255, 0, 0);
  // cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  // // You can try more different parameters
  // cv.HoughCircles(src, circles, cv.HOUGH_GRADIENT,1, 10, 70, 30, 5, 30);
  // // draw circles
  // for (let i = 0; i < circles.cols; ++i) {
  //     let x = circles.data32F[i * 3];
  //     let y = circles.data32F[i * 3 + 1];
  //     let radius = circles.data32F[i * 3 + 2];
  //     let center = new cv.Point(x, y);
  //     cv.circle(dst, center, radius, color);
  // }
  // cv.imshow('CanvasOpencv_2', dst);
  // src.delete();
  // dst.delete(); 
  // circles.delete();
  //-----hough圆形检测 end ----------------


}
