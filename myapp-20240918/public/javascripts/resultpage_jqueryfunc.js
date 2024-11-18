// echart画表格所需变量：
var option1 = {
  title: {
    text: '压力曲线图',
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
      color: '#ffffff'   
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
      color: '#ffffff'  // 这里设置标签颜色  
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {  
      color: '#ffffff'  // 这里设置标签颜色  
    },
    name: '压力/mbar',
    nameTextStyle: {  // 添加这一行来设置 y 轴名称的文本样式  
      color: '#ffffff'  ,
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
  title: {
    text: '温度曲线图',
    textStyle: {  
      color: '#366cb4'   
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['芯片组1芯片1', '芯片组1芯片2', '芯片组2芯片1', '芯片组2芯片2'],
    textStyle: {  
      color: '#ffffff'   
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: {  
      color: '#ffffff'  // 这里设置标签颜色  
    }
  },
  yAxis: {
    type: 'value', 
    axisLabel: {  
      color: '#ffffff',  // 这里设置标签颜色
      //formatter: '{value} °C'  
    },
    name: '温度/°C',
    nameTextStyle: {  // 添加这一行来设置 y 轴名称的文本样式  
      color: '#ffffff' ,
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
      name: '芯片组1芯片1',
      type: 'line',
      smooth: 'true',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '芯片组1芯片2',
      type: 'line',
      smooth: 'true',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: '芯片组2芯片1',
      type: 'line',
      smooth: 'true',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: '芯片组2芯片2',
      type: 'line',
      smooth: 'true',
      data: [320, 332, 301, 334, 390, 330, 320]
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

var echartdom;
var pressure_echart;
var tempreture_echart;

//存储当前后端传来的msg对象的全局变量
var MsgFromBack;
//试验结果界面向后端请求试验结果数据对象
var resultPageMsgToBack = {
  MsgType:4
};


var Msg_CurrentInfo_res;
var Msg_LastInfo_res;
var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws.send("resultpage is opened");
  var jsonString = JSON.stringify(resultPageMsgToBack);
  ws.send(jsonString);
}

ws.onmessage = function (evt) {
  var Msg = JSON.parse(evt.data);
  MsgFromBack = Msg;
  console.log('收到后端发送的消息：',Msg);
  switch(Msg.MsgType)
  {
    case 0:     //后端向前端报错
    //修改弹窗问题
      Msg_LastInfo_res = Msg_CurrentInfo_res;
        
      Msg_CurrentInfo_res = Msg.errInfo;
      
      if(Msg_CurrentInfo_res == Msg_LastInfo_res){

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
          case 4 :
            $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
              title: '阈值报警',
              content: Msg.errInfo,
              type:'red',
            });
            break;
          case 5:
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
    case 1:

      break;
    case 2:
      
      break;
    case 3:
    
      break; 
    case 4:
      if(Msg.SysStatus==0)  //0代表系统暂无结果数据（未开始实验或者实验未完成）
      {
        $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
          title: '暂无实验结果',
          content: '暂无实验结果，请实验完成后刷新重试',
          type:'red',
        });
      }
      
      //以上错误判断放在后端处理了，错误返回MsgType=0,errType=1的消息
      if(Msg.SysStatus==1) //1代表已有结果数据
      {
        // 更新自动模式与手动模式相同的元素
          // 更新概要表格         
          var table = document.getElementById('resultTable1');  // 获取表格元素          
          // 获取第2行的单元格  
          var row = table.getElementsByTagName('tr')[1];  
          var cells = row.getElementsByTagName('td');           
          // 更新单元格数据  
          cells[0].innerHTML = "利多卡因"; // 更新id为T1_1的单元格数据
          cells[1].innerHTML = Msg.Mode; // 更新id为T1_1的单元格数据  
          cells[2].innerHTML = Msg.StartTime; // 更新id为T1_2的单元格数据
          cells[3].innerHTML = Msg.StopTime; // 更新id为T1_3的单元格数据  
          cells[4].innerHTML = Msg.chanlv1; // 更新id为T1_4的单元格数据 
          // 获取第3行的单元格  
          row = table.getElementsByTagName('tr')[2];  
          cells = row.getElementsByTagName('td');  
          cells[0].innerHTML = "地西泮"; // 更新id为T1_1的单元格数据
          cells[1].innerHTML = Msg.Mode; // 更新id为T1_1的单元格数据  
          cells[2].innerHTML = Msg.StartTime; // 更新id为T1_2的单元格数据
          cells[3].innerHTML = Msg.StopTime; // 更新id为T1_3的单元格数据  
          cells[4].innerHTML = Msg.chanlv2; // 更新id为T1_5的单元格数据 
        
          //更新谱图
          var img = document.getElementById('img_putu');
          img.style.display = 'block';
          img.src = '/images/putu/putu.jpg';

        //更新echart
        DrawPressTempChart();

        // 根据自动模式还是手动模式调整界面显示元素，并更新相应数据
        var autoTableContainer = document.getElementById('resultTable2Container');
        var manuTableContainer = document.getElementById('resultTable3Container');
        if(Msg.Mode == '自动模式')
        {
          autoTableContainer.style.display = 'block';
          manuTableContainer.style.display = 'none';

          //表格展示自动模式配方
          var autotable = document.getElementById('resultTable2');
          //根据操作记录条数给表格插入新行
          const peifangNum = Msg.pifang.length;
          for(var i=0; i<peifangNum; i++)
          {
            var row = autotable.insertRow(i); // 插入新行
            // 获取新行的单元格并设置内容  
            var cell1 = row.insertCell(0);   
            cell1.innerHTML = Msg.pifang[i]; // 设置第一列的内容  
          }
          // // 更新自动模式表格
          // for(var i = 0; i < 7; i++) // 修改泵 
          // {
          //   for(var j = 0; j < 3; j++)
          //   {
          //     var cellID = `T2_${i+1}_${j+1}`;
          //     var cell = document.getElementById(cellID);  // 获取表格元素
          //     cell.innerHTML = Msg.Topology.Pumps[i][j];
          //   }          
          // } 
          
          // for(var i = 0; i< 3; i++) //修改芯片
          // {
          //   for(var j = 0; j<3; j++)
          //   {
          //     var cellID = `T2_${i+8}_${j+1}`;
          //     var cell = document.getElementById(cellID);  // 获取表格元素
          //     cell.innerHTML = Msg.Topology.Chips[i][j];
          //   }
          // }

          // for(var i = 0; i<3; i++)  //修改切换阀
          // {
          //   var cellID = `T2_${i+11}_1`;
          //   var cell = document.getElementById(cellID);  // 获取表格元素
          //   cell.innerHTML = Msg.Topology.SwValves[i];
          // }
                    
          // // 获取泵那一行的单元格  
          // var row = table.getElementsByTagName('tr')[2];  
          // var cells = row.getElementsByTagName('td');           
          // // 更新单元格数据  
          // cells[0].innerHTML = Msg.Mode; // 更新id为T1_1的单元格数据  
        }
        else if(Msg.Mode == '手动模式')
        {
          autoTableContainer.style.display = 'none';
          manuTableContainer.style.display = 'block';

          //修改手动模式的操作记录表格
          var manutable = document.getElementById('resultTable3');
          //根据操作记录条数给表格插入新行
          const manuSetNum = Msg.ManuSet.settings.length;
          for(var i=0; i<manuSetNum; i++)
          {
            var row = manutable.insertRow(i+1); // 在第i-1行下插入新行
            // 获取新行的两个单元格并设置内容  
            var cell1 = row.insertCell(0);  
            var cell2 = row.insertCell(1); 
            cell1.innerHTML = Msg.ManuSet.time[i]; // 设置第一列的内容  
            cell2.innerHTML = Msg.ManuSet.settings[i]; // 设置第二列的内容
          }
        }
      }
      break;
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
  //初始化echart
  echartdom = document.getElementById('echartDom');
  pressure_echart = echarts.init(document.getElementById('PressureEchartDom'));
  tempreture_echart = echarts.init(document.getElementById('TempretureEchartDom'));
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

// 使用echarts画压力传感器和温度探头的曲线
function DrawPressTempChart()
{
  // echart画表格 begin 
  echartdom.style.display = 'block';
  //使用后端数据更新option
  option1.xAxis.data = MsgFromBack.Pressure.time;
  option1.series[0].data = MsgFromBack.Pressure.pressure1;
  option1.series[1].data = MsgFromBack.Pressure.pressure2;
  // option2.xAxis.data = Msg.Tempreture.time;
  // option2.series[0].data = Msg.Tempreture.tempreture1;
  // option2.series[1].data = Msg.Tempreture.tempreture2;
  // option2.series[2].data = Msg.Tempreture.tempreture3;
  // option2.series[3].data = Msg.Tempreture.tempreture4;
  // 使用刚指定的配置项和数据显示图表。
  pressure_echart.setOption(option1);
  tempreture_echart.setOption(option2);
}


var ws_db = new WebSocket("ws://localhost:3005"); //与后端数据库相关的websocket
ws_db.onopen = function(){
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("websocket between resultpage with db opening...");
};

//处理接收到的信息
ws_db.onmessage = function(evt){
  console.log("received from db:" + evt.data);

};

//处理错误信息
ws_db.onerror = function(evt){
  console.log("websocket error:" + evt.error);
};

ws_db.onclose = function(){
  console.log("连接数据库已关闭...");
};

//保存数据到数据库
function InsertNewData(){
  //获取各项输入的内容
  ExperimentalPeriod = document.getElementById('ExperimentalPeriod').value;
  // console.log(ExperimentalPeriod);
  Experimenter = document.getElementById('Experimenter').value;
  ReagentName = document.getElementById('ReagentName').value;
  Concentration = document.getElementById('Concentration').value;
  FlowVelocity = document.getElementById('FlowVelocity').value;
  ReactorTemperature = document.getElementById('ReactorTemperature').value;
  ReactorVolume = document.getElementById('ReactorVolume').value;
  ReactionTime = document.getElementById('ReactionTime').value;
  ProductivityRate = document.getElementById('ProductivityRate').value;
  PercentConversion = document.getElementById('PercentConversion').value;

//构造实验记录数据库对象
  var ExperimentalRecord = {
    ExperimentalPeriod: ExperimentalPeriod,
    Experimenter: Experimenter,
    ReagentName: ReagentName,
    Concentration: Concentration,
    FlowVelocity: FlowVelocity,
    ReactorTemperature: ReactorTemperature,
    ReactorVolume: ReactorVolume,
    ReactionTime: ReactionTime,
    ProductivityRate: ProductivityRate,
    PercentConversion: PercentConversion
  };
//将实验记录数据库对象转成JSON格式通过websocket发送到后端
  var ExperimentalRecord_json = JSON.stringify(ExperimentalRecord);
  ws_db.send(ExperimentalRecord_json);

  // mongoose.connection.db.collection(success_data).insertOne(ExperimentalRecord);

}
