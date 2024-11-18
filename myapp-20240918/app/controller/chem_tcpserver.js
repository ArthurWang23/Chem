// switch(global.peifangCS)
          // {
          //   case 1:

          //     break;
          //   case 2:

          //     break;
          //   case 3:

          //     break;
          //   case 4:

          //     break;
          //   case 5:

          //     break;
          //   case 6:

          //     break;
          //   case 7:

          //     break;
          //   case 8:

          //     break;
          //   case 9:

          //     break;
          //   case 10:

          //     break;
          //   case 11:

          //     break;
          //   case 12:

          //     break;
          //   case 13:

          //     break;
          //   case 14:

          //     break;
          //   case 15:

          //     break;
          //   case 16:

          //     break;
          //     default:
          //       break;

          // }


//xy:
//使用nodejs自带的net模块构建tcp服务端，与板子进行网口tcp通信
var webSocket = require('./nodejs_websocket.js');
var mongoose = require('mongoose');
var process = require('process');

// 引入后端所维护的核心数据对象
var dataAll  = require('../data/dataAll.js');

//引入自动模式读取配方
var {AutoModePeiFang,cleanProc} = require('./ImportPeiFang.js');

//Node.js提供了net、http、dgram等模块，分别用来实现TCP、HTTP、UDP的通信
//引入net模块，实现TCP
const net = require('net');
const { dataToResultPage, dataToProcessingPage } = require('../data/dataToFront.js');

let globalSocket;

// 全局变量，标识当前时刻手动模式是否可设置。
//操作逻辑： 手动模式下发送TcpControlMessage到接收到TcpControlReplySuccess之间为false，其他时刻为true
global.ManuSetAvaliable = true;


// tcp数据宏定义
//包头
const TcpStateMessage = 0;
const TcpUpdateMessage = 1;
const TcpControlMessage = 2;
const TcpStopMessage = 3;
const TcpControlReplySuccess = 4;
const TcpControlReplyComplete = 5;
const TcpControlReplyFailure = 6;
const TcpUrgentStop = 7;
const TcpDeviceError = 8;
const TcpManualCtrol = 9;
const TcpManualReply=10;
//子网id
const NetId0 = 0x40;
const NetId1 = 0x40;
const NetId2 = 0x40;
const NetId3 = 0x40;
//设备类型
const Bump = 0;   
const Valve = 1;
const Tmp = 2;

const mlperstep = 5/24000;

var tem_EnSure = 0;
function tcpServer()
{
  //TCP服务器端口号
  var localTcpPort = 8001;

  //TCP服务器IP
  var localIpAdd = '192.168.1.100';

  //接收到的tcp数据缓存
  var tcpData = 'initial';

  //一个tcp连接对应一个socket，若需多个socket连接可以使用链表数据结构
  //本项目由于只有网口和板子一个TCP连接，所以写死只有一个socket，方便在外部调用这个socket的方法。
  
  //创建Tcp服务器
  //运行本工程的电脑需要设置网络防火墙全部关闭，以太网IPV4地址为192.168.1.100
  //在用户登录后，加载index——logged.jade文件完毕，通过ajax方法启动本服务器，即global.tcpServer =new tcpServer();
  //之后使用global.tcpServer.sendTcpData();方法即可在net.createServer方法的回调函数之外调用tcp发包函数，是不是很爽~多亏网络组前人的智慧！
  var server = net.createServer(function(socket){
    //使用globalSocket变量来copy socket,使得在本函数之外包装一个sendTcpData函数，调用socket.write()方法，方便在本回调函数之外调用tcp发包程序
    globalSocket = socket;
    console.log(globalSocket);
    console.log('有新的TCP客户端接入！'+globalSocket);
    // //建立连接向板子发包确认
    // socket.write("TCP CONNECT");
    //设置最大连接数量
    server.maxConnections = 1;
    server.getConnections(function (err, count) {
        console.log("当前连接的客户端个数为：" + count);
    });

    //监听data事件
    socket.on("data",function(TcpRecvData){   
      console.log("主控发来的tcp包",TcpRecvData);
      // console.log("接收到的TCP数据为：",data.toString());
      if(webSocket.CheckWsConn(1))
      {
        switch(TcpRecvData[0])
        {
          //主控回复初始化结果
          case TcpStateMessage:
            //系统处于初始化阶段
            if(dataAll.sysState == 4)   //自动模式手动模式初始化成功均跳转至状态1，初始化失败均跳转至状态0
            {
              //四个子网初始化正常
              if(TcpRecvData[1]==1 && TcpRecvData[2]==1 &&TcpRecvData[3]==1 &&TcpRecvData[4]==1 ) 
              {
                console.log("子网全部初始化成功！");
                //初始化完毕，系统进入正常运行状态
                dataAll.sysState = 1;
                dataToProcessingPage.Init();
                dataToResultPage.Init();
                // // 开始每5s询问一次数据更新
                // const Updatetimer = setInterval(sendUpdateReq, 5000);  //使用clearInterval(Updatetimer);函数停止该定时器
                //websocket2向matlab发送压力传感器启动指令
                global.pressureSensor_flag = 2;
                webSocket.sendData(1,"start");
                
                // 自动模式下开始执行配方第一步
                if(dataAll.expInfo.expMode == "自动模式")
                {
                  // 1.	3二号口快速吸取原料液吸到2400, 4二号口快速吸取原料液吸到2400
                  // global.peifangCS = 1;
                  global.peifangCS++;   
                  peifang_AutoMode_SeriesFunc(global.peifangCS);    //global.peifangCS==1
                }
                // 手动模式下向前端反馈初始化完毕
                else if(dataAll.expInfo.expMode == "手动模式")
                {
                  var MsgToFront = {
                    MsgType:3,
                    FuncType:1,
                    success:true,
                    MsgInfo:"设备初始化完成"
                  }
                  webSocket.sendData(0,MsgToFront);
                }  

              }
              //有子网初始化失败
              else  
              {
                let str1 = "子网"
                let str2 = "初始化失败！请检查硬件连接后重新点击“开始实验”按钮"
                let ErrNet = []; // 用于存储初始化失败（为0）的元素索引  
                for(var i=1; i<TcpRecvData.length; i++)
                {
                  if (TcpRecvData[i] == 0) {  
                    ErrNet.push(i); 
                  } 
                }
                let newStr = str1 + ErrNet.join(", ") + str2;  //join(", ")会将数组的元素用逗号和空格连接起来
                console.log(newStr); 
                var errMsgToFront={
                  MsgType:0,
                  errType:0,	//子网初始化失败
                  errInfo:newStr
                }
                webSocket.sendData(0,errMsgToFront);    //sendData我封装的时候把JSON.stringfy封装进去了，所以只需传入对象即可
                //sysState回到初始状态
                dataAll.sysState = 0;

              }
            }
            else
            {
              console.log("系统跑飞了，在非初始化阶段收到初始化回复的tcp包");
            }
            
            break;
          //主控数据更新
          case TcpUpdateMessage:
            if(dataAll.sysState==1 || dataAll.sysState==5 || dataAll.sysState==3)
            {
              // 检测特定位置是否为指定的子网ID。 数据更新包一包包含拓扑所有更新数据
              // update数据包格式正确，维护dataAll的realtimeData
              if(TcpRecvData.length == 105 && TcpRecvData[1]==NetId0 && TcpRecvData[37]==NetId0)
              {    
                updateDataAllRealtimeData(TcpRecvData);
                CalculateAndCheck();
              }
              // 特定位置不是指定的子网ID。
              else{
                console.log("主控update TcpPackage格式错误！");
              }
            }
            else
            {
              console.log("系统跑飞了，在非1,3,5状态下向下位机询问更新数据");
            }
            

            break;
          //主控成功接收到指令
          case TcpControlReplySuccess:
            // if(dataAll.expInfo.expMode == "自动模式")
            // {
            //   // 将dataAll中settingdata的设置数据更新到realtimedata中的设置数据。
            //   // 泵的流速，通道，状态
            //   dataAll.topology.pumps[0][0][0] = dataAll.topology.pumps[0][1][0];  //流速
            //   dataAll.topology.pumps[0][0][1] = dataAll.topology.pumps[0][1][1];  //通道
            //   dataAll.topology.pumps[0][0][2] = dataAll.topology.pumps[0][1][2];  //状态
            //   dataAll.topology.pumps[1][0][0] = dataAll.topology.pumps[1][1][0];  //流速
            //   dataAll.topology.pumps[1][0][1] = dataAll.topology.pumps[1][1][1];  //通道
            //   dataAll.topology.pumps[1][0][2] = dataAll.topology.pumps[1][1][2];  //状态
            //   dataAll.topology.pumps[2][0][0] = dataAll.topology.pumps[2][1][0];  //流速
            //   dataAll.topology.pumps[2][0][1] = dataAll.topology.pumps[2][1][1];  //通道
            //   dataAll.topology.pumps[2][0][2] = dataAll.topology.pumps[2][1][2];  //状态
            //   dataAll.topology.pumps[3][0][0] = dataAll.topology.pumps[3][1][0];  //流速
            //   dataAll.topology.pumps[3][0][1] = dataAll.topology.pumps[3][1][1];  //通道
            //   dataAll.topology.pumps[3][0][2] = dataAll.topology.pumps[3][1][2];  //状态
            //   dataAll.topology.pumps[4][0][0] = dataAll.topology.pumps[4][1][0];  //流速
            //   dataAll.topology.pumps[4][0][1] = dataAll.topology.pumps[4][1][1];  //通道
            //   dataAll.topology.pumps[4][0][2] = dataAll.topology.pumps[4][1][2];  //状态
            //   dataAll.topology.pumps[5][0][0] = dataAll.topology.pumps[5][1][0];  //流速
            //   dataAll.topology.pumps[5][0][1] = dataAll.topology.pumps[5][1][1];  //通道
            //   dataAll.topology.pumps[5][0][2] = dataAll.topology.pumps[5][1][2];  //状态
            //   dataAll.topology.pumps[6][0][0] = dataAll.topology.pumps[6][1][0];  //流速
            //   dataAll.topology.pumps[6][0][1] = dataAll.topology.pumps[6][1][1];  //通道
            //   dataAll.topology.pumps[6][0][2] = dataAll.topology.pumps[6][1][2];  //状态
            //   //芯片当前目标温度，当前加热速度，
            //   dataAll.topology.chips[1][0][1] = dataAll.topology.chips[1][1][1];  //当前目标温度
            //   dataAll.topology.chips[1][0][4] = dataAll.topology.chips[1][1][3];  //当前目标温度
            //   dataAll.topology.chips[1][0][2] = dataAll.topology.chips[1][1][2];  //当前加热速度档位
            //   dataAll.topology.chips[1][0][5] = dataAll.topology.chips[1][1][4];  //当前加热速度档位
            //   //切换阀当前输出通道
            //   dataAll.topology.switchingValves[0][0][0] = dataAll.topology.switchingValves[0][1][0];  //输出通道
            //   dataAll.topology.switchingValves[1][0][0] = dataAll.topology.switchingValves[1][1][0];  //输出通道
            //   dataAll.topology.switchingValves[2][0][0] = dataAll.topology.switchingValves[2][1][0]; 
            // }
            if(dataAll.expInfo.expMode == "手动模式")
            {
              global.ManuSetAvaliable = true;
            }
            

            break;
          //主控接收到停止消息的回复
          case TcpStopMessage:
            //自动模式下接收到停止回复
            if(dataAll.expInfo.expMode == "手动模式")
            {
              //清洗模式下收到第一个停止加热指令的回复，继续按顺序执行清洗程序
              if(dataAll.sysState == 3 && global.cleanProcCS ==0)
              {
                global.cleanProcCS = 1;
                CleanSeriesFunc(global.cleanProcCS);
              }
              //正常运行模式下收到单个停止指令的回复
              else if(dataAll.sysState == 1)
              {

              }
              //其他模式下收到单个停止指令的回复
              else
              {
                console.log("跑飞了，其他模式下收到单个停止指令的回复");
              }
            }
            //手动模式下接收到停止回复
            else if(dataAll.expInfo.expMode == "自动模式")
            {
              //清洗状态执行完第一步停止加热
              if(dataAll.sysState == 3 && global.cleanProcCS ==0)
              {
                global.cleanProcCS = 1;
                CleanSeriesFunc(global.cleanProcCS);
              }
              else 
              {
                console.log("清洗模式跑飞了，私密马赛八嘎呀路酱");
              }
            }
            break;    
          // 自动模式下配方执行完毕
          case TcpControlReplyComplete:
            // 如果还在配方执行期间
            if(dataAll.sysState == 1 && dataAll.expInfo.expMode == "自动模式")
            {
              //指令没执行完
              if(global.peifangCS<AutoModePeiFang.num)
              {
                //配方指令的最后一句
                if(global.peifangCS == AutoModePeiFang.num-1)
                {
                  //配方执行完毕
                  global.peifangCS = 0;
                  // 配方流程全部完毕，系统进入实验完成状态
                  dataAll.sysState = 5;
                  
                  // 记录实验完成时间
                  var currentTime = new Date();
                  const hours = String(currentTime.getHours()).padStart(2, '0');  
                  const minutes = String(currentTime.getMinutes()).padStart(2, '0');  
                  const seconds = String(currentTime.getSeconds()).padStart(2, '0');  
                  const timeString = `${hours}:${minutes}:${seconds}`; 
                  dataAll.expInfo.stopTime = timeString;
                  //设置实验结果界面数据为可读
                  dataToResultPage.SysStatus = 1;
                  //告知前端试验完成
                  var MsgToFront = {
                    MsgType:2,
                    FuncType:1,
                    success:true,
                    MsgInfo:"Completed!"
                  };
                  webSocket.sendData(0,MsgToFront);
                }
                //执行下一条指令
                else{
                  global.peifangCS ++;
                  peifang_AutoMode_SeriesFunc(global.peifangCS);
                }
                
              }

            }
            //处于清洗阶段，自动模式和手动模式都是本流程
            else if(dataAll.sysState == 3)
            {
              if(global.cleanProcCS<cleanProc.num)
              {
                //配方指令的最后一句
                if(global.cleanProcCS == cleanProc.num-1)
                {
                  console.log("清洗完毕，进入贤者模式");
                  global.cleanProcCS=0;
                  //向前端反馈仪器清洗完毕
                  if(dataAll.expInfo.expMode == "自动模式")
                  {
                    var MsgToFront ={
                      MsgType:2,
                      FuncType:2,
                      success:true,
                      MsgInfo:"Cleaned"
                    }
                    webSocket.sendData(0,MsgToFront);
                  }
                  else if(dataAll.expInfo.expMode == "手动模式")
                  {
                    var MsgToFront ={
                      MsgType:3,
                      FuncType:2,
                      success:true,
                      MsgInfo:"Cleaned"
                    }
                    webSocket.sendData(0,MsgToFront);
                  }               
                  //清洗已完成，处于贤者模式,当前状态下点击开始实验进入新实验，sysState归0；
                  dataAll.sysState = 6;
                  //matlab websocket停止更新数据
                  global.pressureSensor_flag = 0;
                  var str = "stop";
                  webSocket.sendData(1,str);
                }
                //执行下一条指令
                else{
                  global.cleanProcCS++;
                  CleanSeriesFunc(global.cleanProcCS);
                }
              }
            }
            
            break;
          // 紧急停止
          case TcpUrgentStop:
            dataAll.sysState = 2;
            var MsgToFront = {
                MsgType:2,
                FuncType:3,
                success: false,
                MsgInfo:"系统紧急停止，请立刻排查故障！"
            }
            webSocket.sendData(0,MsgToFront);

            break;
          //设备故障
          case TcpDeviceError:
            // dataAll.sysState = 2;
            var errDevnum = TcpRecvData[2];
            var errDevType;
            switch(TcpRecvData[1])
            {
              case Bump:
                errDevType='泵'
                break;
              case Valve:
                errDevType='切换阀'
                break;
              case Tmp:
                errDevType='加热芯片'
                break;
              default:
                break;
            }
            var errMsg = `设备故障！请检查${errDevnum}号${errDevType}`;
            var MsgToFront = {
              MsgType:0,
              errType:5,
              errInfo:errMsg
            }
            webSocket.sendData(0,MsgToFront);
              // 以下是根据@分隔，定位到子网、设备类型、设备
              // // 创建一个新的Buffer，其内容是0x40  
              // let delimiter = Buffer.from([0x40]);    
              // // 创建一个新的空Buffer数组来存储结果  
              // let resultBuffers = [];  
              // let start = 0; 
              // // 遍历输入的Buffer，查找分隔符的位置  
              // for (let i = 0; i < TcpRecvData.length; i++) {  
              //   // 检查当前位置是否是分隔符  
              //   if (TcpRecvData[i] === delimiter[0]) {  
              //     // 如果找到分隔符，创建一个新的Buffer对象，并添加到结果数组中  
              //     resultBuffers.push(TcpRecvData.slice(start, i));  
              //     // 更新start位置为当前位置+1，以便下一次迭代从下一个位置开始  
              //     start = i + 1;  
              //   }  
              // }      
              // // 添加最后一个从最后一个分隔符到结尾的Buffer对象  
              // resultBuffers.push(inputBuffer.slice(start));  

            break;
          //手动模式串口回复
          case TcpManualReply:
            var uart_r = TcpRecvData.slice(1,TcpRecvData.length);
            console.log("收到下位机串口消息：",uart_r.toString('ascii'));
            var MsgToFront = {
              MsgType:3,
              FuncType:4,
              MsgInfo:uart_r.toString('ascii')
            }
            webSocket.sendData(0,MsgToFront);
            break;
          default:

            break;



        }
      }

      else
      {
        dataAll.sysState = 0;
        var MsgToFront = {
          MsgType:0,
          errType:3,
          errInfo:"请检查主机与压力传感器的软硬件连接！"
        }
        webSocket.sendData(0,MsgToFront);
      }
      

      //缓存接收到的数据
      // tcpData = TcpRecvStr;
      //socket.write('hello client');
    });

    //监听end事件
    socket.on("end",()=>{
      console.log('Client 断开连接'); 
    })

    
  })
  //检查当前socket是否连接
  this.checkTcpSocketConnect = function(){
    if(globalSocket)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  this.getTcpServer = server;

  this.getData = function () {
    return tcpData;
  };

  this.sendTcpData = function(msg)
  {
    globalSocket.write(msg);
  }

  //serverStatus表明目前的服务器工作情况
  var serverStatus = new Array();
  serverStatus['status'] = "stopped";
  serverStatus['address'] = localIpAdd;
  serverStatus['port'] = localTcpPort;

  //改变ServerStatusFlag，并将改变完的值返回
  this.getServerStatus = function () {
    return serverStatus;
  }

  this.getSocketInfo = function(){
    console.log('本地端口的地址:',socket.localPort);
    console.log('本地IP地址:',socket.socket.localAddress);
    console.log('进程端口地址:',socket.remotePort);
    console.log('进程IP协议族:',socket.remoteFamily);
    console.log('进程IP地址:',socket.remoteAddress);
  }

  this.closeTcpServer = function (){
    server.close();
    console.log("TCP Server is closed");
  }

  /*设置监听端口
  server.listen(port[, host][, backlog][, callback]);
  port：为需要监听的端口号，参数值为0的时候将随机分配一个端口号；
  host：服务器地址；如果省略 host，服务器将在 IPv6 可用时接受 未指定的 IPv6 地址 (::) 上的连接，否则接受 未指定的 IPv4 地址 (0.0.0.0) 上的连接。
  backlog：连接等待队列的最大长度；
  callback：回调函数。*/
  server.listen(localTcpPort);

  //监听connection事件
  server.on('connection', function (socket) {
    console.log('有新的客户端接入');
  });

  //设置监听时的回调函数
  server.on('listening', function () {
      console.log('TCP服务端',localIpAdd,'PORT',localTcpPort,'正在监听');
      //获取地址信息
      let address = server.address();
      //获取地址详细信息
      console.log("服务器监听的端口是：" + address.port);
      console.log("服务器监听的地址是：" + address.address);
      console.log("服务器监听的地址类型是：" + address.family);

  });

  //设置关闭时的回调函数
  server.on('close', function () {
      console.log('TCP服务已关闭');
  });

  //设置出错时的回调函数
  server.on('error', function (err) {
      console.log('服务运行异常', err);
  });

  
  

  //将服务器IP的字符串转换为数组
  var localIpArray = localIpAdd.split(".");
  console.log("local ip is:" + localIpArray);

  

  //dev为每个Client的对象
  var dev = new Object();
  dev.ip = "";
  dev.port = "";
  //临时存储读到的Client信息
  var devTemp = new Array();


  


}

// 开始每5s询问一次数据更新
const Updatetimer = setInterval(sendUpdateReq, 2000);  //使用clearInterval(Updatetimer);函数停止该定时器

//向主控发送更新数据请求
function sendUpdateReq()
{
  if(dataAll.sysState == 1 || dataAll.sysState == 3 ||dataAll.sysState==5)
  {
    if(global.tcpServer.checkTcpSocketConnect())
    {
      var tcpUpdateDataReq = [TcpUpdateMessage];
      const buffer = Buffer.from(tcpUpdateDataReq);
      global.tcpServer.sendTcpData(buffer);
    }
    else
    {
      var MsgToFront = {
        MsgType:0,
        errType:2,
        errInfo:"请检查主机与主控制器的网线连接！"
      }
      webSocket.sendData(0,MsgToFront);
    }
    
  }
  
}

//接收到主控发来的update数据包后，更新dataAll的realtime data
function updateDataAllRealtimeData(TcpRecvData)
{
  const now = new Date();  
  const hours = String(now.getHours()).padStart(2, '0');  
  const minutes = String(now.getMinutes()).padStart(2, '0');  
  const seconds = String(now.getSeconds()).padStart(2, '0');  
  const timeString = `${hours}:${minutes}:${seconds}`; 
  dataToProcessingPage.PressTempChart.Tempreture.time.push(timeString);

  var slicedBuffer;
  //pump1 elem3 泵位置
  dataAll.topology.pumps[0][0][4] = dataAll.topology.pumps[0][0][3];
  slicedBuffer = TcpRecvData.slice(2,7); // 从索引位置1开始，到索引位置4（不包括）结束 
  dataAll.topology.pumps[0][0][3] = Buffer2PumpPosition(slicedBuffer);
  //pump2 elem4 泵位置
  dataAll.topology.pumps[1][0][4] = dataAll.topology.pumps[1][0][3];
  slicedBuffer = TcpRecvData.slice(7,12); // 从索引位置1开始，到索引位置4（不包括）结束 
  dataAll.topology.pumps[1][0][3] = Buffer2PumpPosition(slicedBuffer);
  //pump4, elem10 泵位置
  dataAll.topology.pumps[3][0][4] = dataAll.topology.pumps[3][0][3] ;
  slicedBuffer = TcpRecvData.slice(12,17); // 从索引位置1开始，到索引位置4（不包括）结束 
  dataAll.topology.pumps[3][0][3] = Buffer2PumpPosition(slicedBuffer);
  //pump3, elem9 泵位置+
  dataAll.topology.pumps[2][0][4] = dataAll.topology.pumps[2][0][3];
  slicedBuffer = TcpRecvData.slice(17,22); // 从索引位置1开始，到索引位置4（不包括）结束 
  dataAll.topology.pumps[2][0][3] = Buffer2PumpPosition(slicedBuffer);
  
  // chip2, elem12-1 温度
  // slicedBuffer = TcpRecvData.slice(23, 28);  
  slicedBuffer = TcpRecvData.slice(38, 43);             //slice(1, 4)方法会从索引1开始（即第二个元素），直到索引4（不包括索引4） 
  dataAll.topology.chips[1][0][0] = Buffer2TempFloat(slicedBuffer);
  dataToProcessingPage.PressTempChart.Tempreture.tempreture1.push(Buffer2TempFloat(slicedBuffer));
  // var tmp = 0;
  // if(slicedBuffer[3] == 43)//温度为正数
  //   {tmp = Number((slicedBuffer[0]*100+slicedBuffer[1]*10+slicedBuffer[2]+slicedBuffer[4]*0.1).toFixed(2));}
  // else if(slicedBuffer[3] == 45)//温度为负数
  //   {tmp = Number((slicedBuffer[0]*100+slicedBuffer[1]*10+slicedBuffer[2]+slicedBuffer[4]*0.1).toFixed(2))*-1;}
  // dataAll.topology.chips[1][0][0] = tmp;
  // dataToProcessingPage.PressTempChart.Tempreture.tempreture1.push(tmp);
    
  //chip2, elem12-2 温度
  // slicedBuffer = TcpRecvData.slice(28, 33);   //slice(1, 4)方法会从索引1开始（即第二个元素），直到索引4（不包括索引4）
  slicedBuffer = TcpRecvData.slice(43, 48);
  dataAll.topology.chips[1][0][3] = Buffer2TempFloat(slicedBuffer);
  dataToProcessingPage.PressTempChart.Tempreture.tempreture2.push(Buffer2TempFloat(slicedBuffer));
  // var tmp = 0;
  // if(slicedBuffer[3] == 43)//温度为正数
  //   {tmp = Number((slicedBuffer[0]*100+slicedBuffer[1]*10+slicedBuffer[2]+slicedBuffer[4]*0.1).toFixed(2));}
  // else if(slicedBuffer[3] == 45)//温度为负数
  //   {tmp = Number((slicedBuffer[0]*100+slicedBuffer[1]*10+slicedBuffer[2]+slicedBuffer[4]*0.1).toFixed(2))*-1;}
  // dataAll.topology.chips[1][0][3] = tmp;
  // dataToProcessingPage.PressTempChart.Tempreture.tempreture2.push(tmp);
  
  //pump6, elem15 泵位置
  dataAll.topology.pumps[5][0][4] = dataAll.topology.pumps[5][0][3];
  // slicedBuffer = TcpRecvData.slice(34, 39);
  slicedBuffer = TcpRecvData.slice(22, 27);
  dataAll.topology.pumps[5][0][3] = Buffer2PumpPosition(slicedBuffer);
  //pump7, elem17 泵位置
  dataAll.topology.pumps[6][0][4] = dataAll.topology.pumps[6][0][3];
  // slicedBuffer = TcpRecvData.slice(39, 44);
  slicedBuffer = TcpRecvData.slice(27, 32);
  dataAll.topology.pumps[6][0][3] = Buffer2PumpPosition(slicedBuffer);
  //pump5, elem24 泵位置
  dataAll.topology.pumps[4][0][4] = dataAll.topology.pumps[4][0][3];
  // slicedBuffer = TcpRecvData.slice(45, 50);
  slicedBuffer = TcpRecvData.slice(32, 37);
  dataAll.topology.pumps[4][0][3] = Buffer2PumpPosition(slicedBuffer);
  //chips2 elem23-1 温度
  // slicedBuffer = TcpRecvData.slice(50, 55);
  slicedBuffer = TcpRecvData.slice(48, 53);
  dataAll.topology.chips[2][0][0] = Buffer2TempFloat(slicedBuffer);
  dataToProcessingPage.PressTempChart.Tempreture.tempreture3.push(Buffer2TempFloat(slicedBuffer));
  //chips2 elem23-2 温度
  // slicedBuffer = TcpRecvData.slice(55, 60);
  slicedBuffer = TcpRecvData.slice(53, 58);
  dataAll.topology.chips[2][0][3] = Buffer2TempFloat(slicedBuffer);
  dataToProcessingPage.PressTempChart.Tempreture.tempreture4.push(Buffer2TempFloat(slicedBuffer));

  //总线电压
  slicedBuffer = TcpRecvData.slice(62, 66);
  dataAll.topology.electricalParameters[0][0] = Buffer2ElectricalParameters(slicedBuffer);
  //总线电流
  slicedBuffer = TcpRecvData.slice(66, 70);
  dataAll.topology.electricalParameters[0][1] = Buffer2ElectricalParameters(slicedBuffer);
  //系统功率
  slicedBuffer = TcpRecvData.slice(70, 74);
  dataAll.topology.electricalParameters[0][2] = Buffer2ElectricalParameters(slicedBuffer);
}

//自动模式下按顺序发送配方tcp数据包
function peifang_AutoMode_SeriesFunc(peifangId)
{
    if(global.tcpServer.checkTcpSocketConnect())
    {
      //根据peifangId发送配方tcp包
      var data = AutoModePeiFang.order[peifangId];
      global.tcpServer.sendTcpData(data);

      //解析配方tcp包，维护dataAll的某些变量
      var buffer = data.slice(1,data.length); 
      var resultToAnalyze = extractSubBuffers(buffer);
      // console.log(resultToAnalyze);
      for(var i=0; i<resultToAnalyze.length; i++)
      {
        if(resultToAnalyze[i][0] == 0)  //泵的指令
        {
          var pumpNum = resultToAnalyze[i][1];
          var speed = (resultToAnalyze[i][2]*1000+resultToAnalyze[i][3]*100+resultToAnalyze[i][4]*10+resultToAnalyze[i][5])*1000*mlperstep/60; //unit:ul/min
          var aimedPos = (resultToAnalyze[i][6]*10000+resultToAnalyze[i][7]*1000+resultToAnalyze[i][8]*100+resultToAnalyze[i][9]*10+resultToAnalyze[i][10]);
          var ch = resultToAnalyze[i][11];
          //如果当前结构体泵设置信息中的位置小于等于要执行配方的aimedPos，则为吸取
          if(dataAll.topology.pumps[pumpNum-1][1][3]<=aimedPos)
          {
            dataAll.topology.pumps[pumpNum-1][1][2] = "吸取";
            dataAll.topology.pumps[pumpNum-1][0][2] = "吸取";
          }
          else{//如果当前结构体泵设置信息中的位置大于要执行配方的aimedPos，则为注射
            dataAll.topology.pumps[pumpNum-1][1][2] = "注射";
            dataAll.topology.pumps[pumpNum-1][0][2] = "注射";
          }
          dataAll.topology.pumps[pumpNum-1][1][3] = aimedPos;
          dataAll.topology.pumps[pumpNum-1][1][0] = speed;
          dataAll.topology.pumps[pumpNum-1][0][0] = speed;
          dataAll.topology.pumps[pumpNum-1][1][1] = ch;
          dataAll.topology.pumps[pumpNum-1][0][1] = ch;
        }
        else if(resultToAnalyze[i][0] == 1) //阀的指令
        {
          var valveNum = resultToAnalyze[i][1];
          var ch = resultToAnalyze[i][2];
          dataAll.topology.switchingValves[valveNum-1][1][0] = ch;
          dataAll.topology.switchingValves[valveNum-1][0][0] = ch;
        }
        else if(resultToAnalyze[i][0] == 2) //加热指令
        {
          var speed = resultToAnalyze[i][2];
          var tmp = resultToAnalyze[i][3]*100 + resultToAnalyze[i][4]*10 + resultToAnalyze[i][5];
          switch(resultToAnalyze[i][1]) //区分不同加热芯片（以后dataAll的chips不要用芯片组的概念
          {
            case 1: //chips1-1 elem12
              dataAll.topology.chips[1][1][1] = tmp;
              dataAll.topology.chips[1][0][1] = tmp;
              dataAll.topology.chips[1][1][2] = speed;
              dataAll.topology.chips[1][0][2] = speed;
              break;
            case 2://chips1-2 elem12
              dataAll.topology.chips[1][1][3] = tmp;
              dataAll.topology.chips[1][0][4] = tmp;
              dataAll.topology.chips[1][1][4] = speed;
              dataAll.topology.chips[1][0][5] = speed;
              break;
            case 3://chips2-1 elem23
              dataAll.topology.chips[2][1][1] = tmp;
              dataAll.topology.chips[2][0][1] = tmp;
              dataAll.topology.chips[2][1][2] = speed;
              dataAll.topology.chips[2][0][2] = speed;
              break;
            case 4://chips2-2 elem23
              dataAll.topology.chips[2][1][3] = tmp;
              dataAll.topology.chips[2][0][4] = tmp;
              dataAll.topology.chips[2][1][4] = speed;
              dataAll.topology.chips[2][0][5] = speed;
              break;
            default:
              break;

          }
        }
        else{
          console.log("震惊！分析配方竟然分析出神秘器件...编号",resultToAnalyze[i][0]);
        }
      }
    }
    else{
      var MsgToFront = {
        MsgType:0,
        errType:2,
        errInfo:"请检查主机与主控制器的网线连接！"
      }
      webSocket.sendData(0,MsgToFront);
    }
    

}

//清洗步骤
function CleanSeriesFunc(CleanId)
{
  if(global.tcpServer.checkTcpSocketConnect())
  {
    //根据CleanId发送配方tcp包
    // var tcpDataToController = dataAll.expInfo.cleanProc[CleanId];
    // const buffer = Buffer.from(tcpDataToController);
    // global.tcpServer.sendTcpData(buffer);
    var tcpDataToController = cleanProc.order[CleanId];
    global.tcpServer.sendTcpData(tcpDataToController);
  }
  else
  {
    var MsgToFront = {
      MsgType:0,
      errType:2,
      errInfo:"请检查主机与主控制器的网线连接！"
    }
    webSocket.sendData(0,MsgToFront);
  }
  
}

// function bufferArrayToStringArray(bufferArray) {  
//   return bufferArray.map(buffer => {  
//       let str = buffer.toString(); // 将Buffer转换为字符串  
//       str = str.replace(/0x40/g, '@'); // 替换0x40为@  
//       return str;  
//   });  
// } 

//返回一个包含所有提取出的子Buffer的数组,即@和@中间的部分。
function extractSubBuffers(buffer) {  
  var subBuffers = [];  
  let start = -1; // 上一个64的位置  
  let end = -1; // 下一个64的位置  
  
  for (let i = 0; i < buffer.length; i++) {  
    if (buffer[i] === 64) {  
      if (start === -1) {  
        start = i; // 记录当前位置为起始位置  
      } else if (end === -1) {  
        end = i; // 记录当前位置为结束位置 
         // 如果已经有两个64，则提取中间的子串并添加到结果中  
        const subBuffer = buffer.slice(start + 1, end); // 注意: 不包括开始和结束的64  
        subBuffers.push(subBuffer);  
        start = -1; // 重置开始位置  
        end = -1; // 重置结束位置 
      } else {  

      }  
    }  
  }  
  
  return subBuffers;  
}  

//将buffer转换成字符串，@替换0x40.方便解析指令
function bufferToStringWithReplacement(buffer) {  
  // 将Buffer对象转换为字符串  
  const str = buffer.toString('hex');  
  // 使用正则表达式替换字符串中的0x40为@  
  const replacedStr = str.replace(/40/g, '@');  
  return replacedStr;  
} 

//将字符串中的@开头@结尾的中间部分取出
function getBetweenAt(str) {  
  // 使用正则表达式匹配以@开头和结尾的字符串  
  const matches = str.match(/@([0-9A-Fa-f]+)@/g);  
  return matches ? matches.map(match => match.slice(1, -1)) : [];  
}  

//将字符数组转为带小数点的数字
function convertStringToFloat(str) {  
  const array = str.split('');  
  array.pop(); // 移除最后一个空字符串  
  const numberStr = array.join('');  
  const parts = numberStr.split('.');  
  const integerPart = parseInt(parts[0], 10);  
  const decimalPart = parts[1] ? parseFloat(parts[1]) : 0;  
  return integerPart + decimalPart;  
}  

//将buffer里的位置数据转为num
function Buffer2PumpPosition(slicedBuffer)
{
  return slicedBuffer.readInt8(0)*10000+slicedBuffer.readInt8(1)*1000+slicedBuffer.readInt8(2)*100+slicedBuffer.readInt8(3)*10+slicedBuffer.readInt8(4);
}

//将buffer里的温度数据转为float(根据第四位正负号ascii判断温度正负值)
function Buffer2TempFloat(buf)
{
  var tmp = 0;
  
  if(buf[3] == 43)  //温度为正数
    tmp = Number((buf.readInt8(0)*100 + buf.readInt8(1)*10+buf.readInt8(2)+buf.readInt8(4)*0.1).toFixed(2));
  else if(buf[3] == 45)  //温度为负数
    tmp = -1*Number((buf.readInt8(0)*100 + buf.readInt8(1)*10+buf.readInt8(2)+buf.readInt8(4)*0.1).toFixed(2));
  if(typeof tmp === 'number' && !Number.isInteger(tmp)){
    tem_EnSure = tmp;
    return tmp;
  }
  else{
    return tem_EnSure;
  }

}

//根据dataAll的数据计算瓶子剩余容量和各种阈值检测警报
function CalculateAndCheck()
{
  if(dataAll.sysState==1 || dataAll.sysState==5 || dataAll.sysState==3)
  {
    // 计算底物剩余容量
    var pumpNum=[0,1,2,3,4,5,6];
    var bottleNum=[0,1,3,4,5,6,10];
    for(var i=0; i<pumpNum.length;i++)
    {
      if( dataAll.topology.pumps[pumpNum[i]][0][2] == "吸取")
      {
        if(dataAll.topology.pumps[pumpNum[i]][0][1] == 2)  //吸取原料
        {
          //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
          var delta = (dataAll.topology.pumps[pumpNum[i]][0][3] - dataAll.topology.pumps[pumpNum[i]][0][4])*mlperstep;
          dataAll.topology.bottles[bottleNum[i]][0][1] = Number((dataAll.topology.bottles[bottleNum[i]][0][1] - delta).toFixed(3));
        }
        else if(dataAll.topology.pumps[pumpNum[i]][0][1] == 3) //吸取清洗液
        {
          var delta = (dataAll.topology.pumps[pumpNum[i]][0][3] - dataAll.topology.pumps[pumpNum[i]][0][4])*mlperstep;
          dataAll.topology.bottles[bottleNum[i]][0][3] = Number((dataAll.topology.bottles[bottleNum[i]][0][3] - delta).toFixed(3));
        }
      }
      else if(dataAll.topology.pumps[pumpNum[i]][0][2] == "注射")
      {
        if(dataAll.topology.pumps[pumpNum[i]][0][1] == 6)  //注射废液
        {
          var delta = Math.abs((dataAll.topology.pumps[pumpNum[i]][0][4] - dataAll.topology.pumps[pumpNum[i]][0][3]))*mlperstep;
          dataAll.topology.bottles[bottleNum[i]][0][5] = Number((dataAll.topology.bottles[bottleNum[i]][0][5] + delta).toFixed(3));
        }
      }
    }

    // //泵1
    // pumpNum = 0; bottleNum = 0;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }

    // //泵2
    // pumpNum = 1; bottleNum = 1;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }

    // //泵4
    // pumpNum = 3; bottleNum = 4;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }

    // //泵5
    // pumpNum = 4; bottleNum = 5;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }

    // //泵6
    // pumpNum = 5; bottleNum = 7;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }

    // //泵7
    // pumpNum = 6; bottleNum = 11;
    // if( dataAll.topology.pumps[0][pumpNum][2] == "吸取")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 2)  //吸取原料
    //   {
    //     //差值法，计算两次泵位置的差值，+-通过泵当前的状态判断（吸取状态是这一次比上一次位置大）
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][1] = dataAll.topology.bottles[0][bottleNum][1] - delta;
    //   }
    //   else if(dataAll.topology.pumps[0][pumpNum][1] == 3) //吸取清洗液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][3] - dataAll.topology.pumps[0][pumpNum][4])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][3] = dataAll.topology.bottles[0][bottleNum][3] - delta;
    //   }
    // }
    // else if(dataAll.topology.pumps[0][pumpNum][2] == "注射")
    // {
    //   if(dataAll.topology.pumps[0][pumpNum][1] == 6)  //注射废液
    //   {
    //     var delta = (dataAll.topology.pumps[0][pumpNum][4] - dataAll.topology.pumps[0][pumpNum][3])*mlperstep;
    //     dataAll.topology.bottles[0][bottleNum][5] = dataAll.topology.bottles[0][bottleNum][5] + delta;
    //   }
    // }
    

    // 判断是否有各种阈值错误
    var errMsg = "警告：";
    var err1 = "加热芯片组1温度过高！";
    var err2 = "加热芯片组2温度过高！";
    var err3 = "压力传感器1压力过高！";
    var err4 = "压力传感器2压力过高！";
    // var err4 = "底物1含量不足";
    // var err5 = "底物2含量不足";
    // var err6 = "底物4含量不足";
    // var err7 = "底物5含量不足";
    // var err8 = "底物6含量不足";
    // var err9 = "底物7含量不足";

    if(dataAll.topology.chips[1][0][0]>dataAll.topology.chips[1][1][5] || dataAll.topology.chips[1][0][3]>dataAll.topology.chips[1][1][5])
    {
      errMsg = errMsg + err1;
    }
    if(dataAll.topology.chips[2][0][0]>dataAll.topology.chips[2][1][5] || dataAll.topology.chips[2][0][3]>dataAll.topology.chips[2][1][5])
    {
      errMsg = errMsg + err2;
    }
    if(dataAll.topology.pressuSensors[0][0][0]>dataAll.topology.pressuSensors[0][1][0])
    {
      errMsg = errMsg + err3;
    }
    if(dataAll.topology.pressuSensors[1][0][0]>dataAll.topology.pressuSensors[1][1][0])
    {
      errMsg = errMsg + err4;
    }

    //出现错误
    if(errMsg != "警告：")
    {
      var MsgToFront = {
        MsgType:0,
        errType:4,
        errInfo:errMsg
      };
      webSocket.sendData(0,MsgToFront);
    }

  }
}

function Buffer2ElectricalParameters(buf){
  var elecPara = 0;
  elecPara = buf[0] << 24 | buf[1] << 16 | buf[2] << 8 | buf[3];
  elecPara = elecPara/10000;
  return elecPara;
}

module.exports = tcpServer;











