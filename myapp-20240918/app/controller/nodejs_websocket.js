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
const Bump_type = 0;   
const Valve_type = 1;
const HeatTmp_type = 2;

// 配方状态全局变量
//0-init, 1~16对应dataAll.peifang.tcpPackage的1~16. 'error'为异常状态
global.peifangCS = 0;
// 清洗状态全局变量
//0~13对应dataAll.expInfo.cleanProc的0~13
global.cleanProcCS = 0;

//----------------------------前后端websocket连接  begin--------------------------------------------
// 引入WebSocket模块, 与前端通信的websocket
var ws = require('nodejs-websocket');
var io = require('socket.io-client');
var socket_graph = io('ws://219.228.149.80:3011',{ transports: ['websocket'] }); 
var PORT = 3002;     //xy:需与mainfunction.js中new WebSocket的PORT相同才能建立websocket连接

// 引入后端所维护的核心数据对象
var dataAll  = require('../data/dataAll.js');
// 引入前端界面显示所需要的数据对象
var {dataToProcessingPage,dataToResultPage} = require('../data/dataToFront.js');
//引入数据库模型
var mongoose = require('mongoose'); 
var SuccessDataSchema = require('../model/successdata.js');
//引入自动模式读取配方
var {AutoModePeiFang,cleanProc,generate_comms} = require('./ImportPeiFang.js');
//本文件的两个ws链接conn的全局变量，可以调用.sendText()等方法发送ws数据
var wsConnection = {};  //与前端链接的conn
var wsConnection2 = {}; //与matlab链接的conn
var wsConnection3 = {};  //与AI链接的conn 

//指示当前web界面在哪个界面 0: index 1:index_logged 2:AI 3:processing 4:result 5.1:database 5.2:database2 6:camera 7:login
var web_page = 0;
//指示压力传感器是否在传输数据
global.pressureSensor_flag = 0;    //0代表未启动关闭等，1代表正在初始化，2代表正常工作发送数据
var clientConnected = false;
// Scream server example:"hi"->"HI!!!",服务器把字母大写
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content:{type: String, default: 'No description'},
    status: { type: String, default: 'pending' },
    tag: { type: String, default: 'none' }
  });
const Task = mongoose.model('Task', taskSchema);
function save_to_DB(name,description,tag){
    const newTask = new Task({
      name: name,
      description: description,
      isCompleted: false,
      tag:tag
    });
    newTask.save()
      .then(() => console.log('Task saved successfully'))
      .catch((err) => console.error('Error saving task:', err));
    }

var server = ws.createServer(function(conn){
    console.log('New connection with Front on Port',PORT);
    clientConnected = true;
    wsConnection = conn;
    console.log('wsconnection',wsConnection)
    conn.on("text",function(str){
            console.log("str from front121:",str,web_page);
            try{
                var received = JSON.parse(str);
                var additionalText = received.additionalText;//信息传输的标记信息
                var data = received.data
                }catch{
                    console.log('without additionalText')
                }
            var tcp_issend = 0;

            if(str=='index is open'){
                web_page = 0;
            }
            else if(str=='index_logged is open'){
                web_page = 1;
            }
            else if((str=="AI page is opened")){
                web_page = 2;              
                tcp_issend = 1
                wsConnection.sendText(JSON.stringify({MsgType: 4, data:data }));  
                console.log('web_page:',web_page,'data_AI:',data);              
            }
            else if(str=="processing page is opened"||additionalText=='3002'){
                // console.log(data)
                socket_graph.emit('message',str)
                so(socket_graph)
                web_page = 3;
                updateProcessingPageData();
                console.log('processingpage所维护的数据：',dataToProcessingPage);
                var jsonString = JSON.stringify(dataToProcessingPage);
                wsConnection.sendText(jsonString);
                tcp_issend = 1;   
            }
            else if(str=="resultpage is opened"){
                web_page = 4;
                console.log('resultpage所维护的数据：',dataToResultPage);
            }
            else if(str=="database1page is opened"){
                web_page = 5;
            }
            else if(str=="database2page is opened"){
                web_page = 6;
            }
            else if(str=="camerapage is opened"){
                web_page = 7;
            }
            else if(str=='loginpage is opened'){
                web_page = 8;
            }
            //非以上字符串，则为JSON字符串，str为后端websocket接收到的信息
            else{
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                if(global.tcpServer.checkTcpSocketConnect()){
                    let objFromFront = JSON.parse(str);
                    switch(web_page){
                        case 1:   
                            break;
                        case 2:
                            break;
                        case 3:
                            if(objFromFront.MsgType == 0){   //索要模式信息                                                        
                            }
                            else if(objFromFront.MsgType == 1){  //索要更新数据                           
                                if(objFromFront.FuncType == 0){                              
                                    var currentMode = {
                                        MsgType:1,
                                        FuncType:0,
                                        mode:dataAll.expInfo.expMode
                                    }
                                    var jsonString = JSON.stringify(currentMode);
                                    wsConnection.sendText(jsonString);
                                }
                                else if(objFromFront.FuncType == 1)
                                {
                                    // 维护框图界面数据对象
                                    //后端系统状态机CS
                                    dataToProcessingPage.BackCurrentState = dataAll.sysState;
                                    //更新dataToProcessingPage数据对象
                                    updateProcessingPageData();
                                    //将dataToProcessingPage转为json字符串发送到前端
                                    var jsonString = JSON.stringify(dataToProcessingPage);
                                    wsConnection.sendText(jsonString);
                                }                                
                            }
                            else if(objFromFront.MsgType == 2)  //自动模式控制数据包
                            {
                                //进入自动模式
                                if(objFromFront.FuncType==0)        
                                {
                                    //dataAll.Init();
                                    dataAll.expInfo.expMode = "自动模式";
                                    socket_graph.emit('message',objFromFront)
                                }
                                //web前端点击开始实验
                                else if(objFromFront.FuncType==1)    
                                {
                                    //读取并生成配方
                                    var row=[objFromFront.coms_valve,objFromFront.coms_chip,objFromFront.coms_pump_s,objFromFront.coms_pump_i,
                                        objFromFront.coms_pump_s_clean,objFromFront.coms_pump_i_clean
                                    ]
                                    generate_comms.init();
                                    // 调用 comms 方法生成指令
                                    generate_comms.comms(row);
                                    switch(dataAll.sysState)
                                    {
                                        //只有系统状态==0（初始停止）时向主控发送初始化数据包并记录试验开始时间信息
                                        case 0:
                                            // tcp客户端连接了
                                            if(global.tcpServer.checkTcpSocketConnect())
                                            {
                                                dataAll.Init();
                                                dataToResultPage.Init();
                                                AutoModePeiFang.init();
                                                AutoModePeiFang.importPeiFang();
                                                // //websocket2向matlab发送压力传感器启动指令
                                                // global.pressureSensor_flag = 2;
                                                // wsConnection2.sendText('start');
                                                
                                                dataAll.expInfo.expMode = "自动模式";
                                                //维护dataAll的实验信息expInfo
                                                var currentTime = new Date();
                                                const year = currentTime.getFullYear();
                                                const month = currentTime.getMonth()+1;
                                                const day = currentTime.getDate();
                                                const dateString = `${year}年${month}月${day}日`;
                                                dataAll.expInfo.date = dateString;
                                                const hours = String(currentTime.getHours()).padStart(2, '0');  
                                                const minutes = String(currentTime.getMinutes()).padStart(2, '0');  
                                                const seconds = String(currentTime.getSeconds()).padStart(2, '0');  
                                                const timeString = `${hours}:${minutes}:${seconds}`; 
                                                dataAll.expInfo.startTime = timeString;
                                                dataAll.sysState = 4;       //init
                                                console.log(dateString,timeString,"开始自动模式实验");
                                                // 按照配方开始发送tcp包，第一步初始化
                                                global.peifangCS = 0;
                                                // var tcpDataToController = dataAll.expInfo.peifang.tcpPackage[global.peifangCS];
                                                // const buffer = Buffer.from(tcpDataToController);
                                                // global.tcpServer.sendTcpData(buffer);
                                                var tcpDataToController = generate_comms.order[global.peifangCS];
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
                                            
                                            //向前端回复操作成功
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:true,
                                                MsgInfo:" Starting operation"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        // 系统正常运行
                                        case 1:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:false,
                                                MsgInfo:" 系统已开始运行！"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        //  系统错误紧急停止
                                        case 2:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:false,
                                                MsgInfo:" 系统发生错误，进入紧急停止状态！请排除故障后清洗仪器，重新开始实验"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        // 系统正在清洗
                                        case 3:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:false,
                                                MsgInfo:" 系统处于仪器清洗状态！请稍后再试"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        //系统正在初始化
                                        case 4:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:false,
                                                MsgInfo:" 系统已进入初始化状态！"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        //当前实验已完成
                                        case 5:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:false,
                                                MsgInfo:" 当前实验已完成！"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            break;
                                        //清洗已完成，处于贤者模式,当前状态下点击开始实验进入新实验，sysState归0；
                                        case 6:
                                            var MsgToFront = {
                                                MsgType:2,
                                                FuncType:1,
                                                success:true,
                                                MsgInfo:" 当前实验及清洗已完成！再次点击“开始实验”按钮开始新实验"
                                            }
                                            webSocket.sendData(0,MsgToFront);
                                            dataAll.sysState = 0;
                                        break;
                                        default:
                                            break;
                                        
                                    }                            
                                }
                                //web前端点击清洗仪器
                                else if(objFromFront.FuncType==2){
                                    //实验已完成，可以清洗仪器
                                    if(dataAll.sysState == 5)
                                    {    
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                            cleanProc.init();
                                            cleanProc.importCleanProc();
                                            //进入清洗模式
                                            dataAll.sysState = 3;
                                            // 发送第一句清洗tcp
                                            // 按照清洗流程开始发送tcp包，第一步关闭加热
                                            global.cleanProcCS = 0;
                                            // var tcpDataToController = dataAll.expInfo.cleanProc[global.cleanProcCS];
                                            // const buffer = Buffer.from(tcpDataToController);
                                            // global.tcpServer.sendTcpData(buffer);
                                            var tcpDataToController = cleanProc.order[global.cleanProcCS];
                                            global.tcpServer.sendTcpData(tcpDataToController);

                                            var MsgToFront = {
                                                MsgType : 2,
                                                FuncType:2,
                                                success:true,
                                                MsgInfo:"Cleaning"
                                            }
                                            webSocket.sendData(0,MsgToFront);
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
                                    //已经清洗过了还洗个屁
                                    else if(dataAll.sysState == 6)
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"已经完成清洗！"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //实验尚未开始，洗个屁
                                    else if(dataAll.sysState == 0)
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"实验尚未开始，请完成实验后清洗"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //正在清洗中
                                    else if(dataAll.sysState == 3)
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"当前正在清洗中"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统发生错误后，点击清洗按钮
                                    else if(dataAll.sysState == 2){   
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                            //进入清洗模式
                                            dataAll.sysState = 3;
                                            // 发送第一句清洗tcp
                                            // 按照清洗流程开始发送tcp包，第一步关闭加热
                                            global.cleanProcCS = 0;
                                            var tcpDataToController = dataAll.expInfo.cleanProc[global.cleanProcCS];
                                            const buffer = Buffer.from(tcpDataToController);
                                            global.tcpServer.sendTcpData(buffer);

                                            var MsgToFront = {
                                                MsgType : 2,
                                                FuncType:2,
                                                success:true,
                                                MsgInfo:"Cleaning"
                                            }
                                            webSocket.sendData(0,MsgToFront);
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
                                    //实验尚未完成，洗个屁
                                    else
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"实验正在进行中，请稍后重试"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                }
                                //web前端点击紧急停止
                                else if(objFromFront.FuncType==3)
                                {
                                    //系统还没开始或者清洗完毕进入贤者模式了，紧急停止个屁
                                    if(dataAll.sysState == 0 || dataAll.sysState == 6)
                                    {
                                        var MsgToFront = {
                                            MsgType:2,
                                            FuncType:3,
                                            success: false,
                                            MsgInfo:"当前实验尚未开始或已完全结束，无需紧急停止"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //进入紧急停止状态
                                    else
                                    {
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                            var tcpDataToController = [TcpUrgentStop];
                                            const buffer = Buffer.from(tcpDataToController);
                                            global.tcpServer.sendTcpData(buffer);
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
                                }
                                //web 前端点击退出自动模式
                                else if(objFromFront.FuncType==4)
                                {
                                    //系统尚未开始或者全部完成，可以退出自动模式
                                    if(dataAll.sysState == 0 || dataAll.sysState == 6)
                                    {
                                        // dataAll初始化
                                        dataAll.sysState = 0;
                                        dataAll.expInfo.expMode = "无";
                                        //反馈前端
                                        var MsgToFront = {
                                            MsgType:2,
                                            FuncType:4,
                                            success: true,
                                            MsgInfo:"system exits auto model"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统做完实验了，但还没有清洗
                                    else if(dataAll.sysState == 5)
                                    {
                                        var MsgToFront = {
                                            MsgType:2,
                                            FuncType:4,
                                            success: false,
                                            MsgInfo:"请先清洗实验仪器"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统进入紧急停止状态，需要清洗
                                    else if(dataAll.sysState == 2)
                                    {
                                        var MsgToFront = {
                                            MsgType:2,
                                            FuncType:4,
                                            success: false,
                                            MsgInfo:"请排除故障清洗仪器后退出自动模式"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    else
                                    {
                                        var MsgToFront = {
                                            MsgType:2,
                                            FuncType:4,
                                            success: false,
                                            MsgInfo:"系统正在运行中，请稍后重试"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                }
                            }
                            else if(objFromFront.MsgType == 3)  //手动模式控制数据包
                            {
                                //进入手动模式
                                if(objFromFront.FuncType==0){                                       
                                    //dataAll.Init();
                                    //dataAll.sysState = 0;
                                    dataAll.expInfo.expMode = "手动模式";
                                    socket_graph.emit('message',objFromFront)                                   
                                }
                                //web前端点击系统初始化
                                else if(objFromFront.FuncType==1){                                        
                                    //系统尚未启动或已经完成本次实验清洗完毕，开始初始化
                                    if(dataAll.sysState == 0 || dataAll.sysState == 6){                                      
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                            dataAll.Init();
                                            if(dataAll.sysState == 0)
                                            {
                                                dataToResultPage.Init();
                                            }
                                            dataAll.expInfo.expMode = "手动模式";
                                            dataAll.sysState = 4;
                                            // 按照配方开始发送tcp包，第一步初始化
                                            var tcpDataToController = [TcpStateMessage];
                                            const buffer = Buffer.from(tcpDataToController);
                                            global.tcpServer.sendTcpData(buffer);
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
                                    //系统正在初始化过程中
                                    else if(dataAll.sysState == 4)
                                    {
                                        var MsgToFront ={
                                            MsgType:3,
                                            FuncType:1,
                                            success:false,
                                            MsgInfo:"系统正在初始化中，请耐心等待"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    else
                                    {
                                        var MsgToFront ={
                                            MsgType:3,
                                            FuncType:1,
                                            success:false,
                                            MsgInfo:"请勿重复初始化，实验结束清洗仪器后再次初始化开启新实验吧"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    
                                }
                                //web前端点击清洗仪器
                                else if(objFromFront.FuncType==2)
                                {
                                    //当前处于运行阶段，第一次收到清洗指令，跳转至状态5等待再次清洗命令
                                    if(dataAll.sysState == 1)
                                    {
                                        dataAll.sysState = 5;
                                        var MsgToFront = {
                                            MsgType:3,
                                            FuncType:2,
                                            success:true,
                                            MsgInfo:"请再次点击“清洗仪器”按钮开始清洗仪器"
                                        }
                                        webSocket.sendData(0,MsgToFront);

                                    }
                                    //确认实验结束，开始清洗
                                    else if(dataAll.sysState == 5)
                                    {
                                        cleanProc.init();
                                        cleanProc.importCleanProc();
                                        dataToResultPage.SysStatus = 1;
                                        // 记录实验完成时间
                                        var currentTime = new Date();
                                        const hours = String(currentTime.getHours()).padStart(2, '0');  
                                        const minutes = String(currentTime.getMinutes()).padStart(2, '0');  
                                        const seconds = String(currentTime.getSeconds()).padStart(2, '0');  
                                        const timeString = `${hours}:${minutes}:${seconds}`; 
                                        dataAll.expInfo.stopTime = timeString;
                                        //告知前端试验完成
                                        var MsgToFront = {
                                            MsgType : 3,
                                            FuncType:2,
                                            success:true,
                                            MsgInfo:"Cleaning"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                        
                                        var MsgToFront = {
                                        MsgType:3,
                                        FuncType:1,
                                        success:true,
                                        MsgInfo:"本次手动模式实验已完成！"
                                        };
                                        webSocket.sendData(0,MsgToFront);
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                            //进入清洗模式
                                            dataAll.sysState = 3;
                                            // 发送第一句清洗tcp
                                            // 按照清洗流程开始发送tcp包，第一步关闭加热
                                            global.cleanProcCS = 0;
                                            // var tcpDataToController = dataAll.expInfo.cleanProc[global.cleanProcCS];
                                            // const buffer = Buffer.from(tcpDataToController);
                                            // global.tcpServer.sendTcpData(buffer);
                                            var tcpDataToController = cleanProc.order[global.cleanProcCS];
                                            global.tcpServer.sendTcpData(tcpDataToController);
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
                                    //已经清洗过了还洗个屁
                                    else if(dataAll.sysState == 6)
                                    {
                                        var MsgToFront = {
                                            MsgType : 3,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"已经完成清洗！"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //实验尚未开始，洗个屁
                                    else if(dataAll.sysState == 0)
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"实验尚未开始，请完成实验后清洗"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //正在清洗中
                                    else if(dataAll.sysState == 3)
                                    {
                                        var MsgToFront = {
                                            MsgType : 2,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"当前正在清洗中"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统发生错误后，点击清洗按钮
                                    else if(dataAll.sysState == 2){
                                        if(global.tcpServer.checkTcpSocketConnect())
                                        {
                                                //进入清洗模式
                                            dataAll.sysState = 3;
                                            // 发送第一句清洗tcp
                                            // 按照清洗流程开始发送tcp包，第一步关闭加热
                                            global.cleanProcCS = 0;
                                            var tcpDataToController = dataAll.expInfo.cleanProc[global.cleanProcCS];
                                            const buffer = Buffer.from(tcpDataToController);
                                            global.tcpServer.sendTcpData(buffer);

                                            var MsgToFront = {
                                                MsgType : 2,
                                                FuncType:2,
                                                success:true,
                                                MsgInfo:"Cleaning"
                                            }
                                            webSocket.sendData(0,MsgToFront);
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
                                    //实验尚未完成，洗个屁
                                    else if(dataAll.sysState == 4)
                                    {
                                        var MsgToFront = {
                                            MsgType : 3,
                                            FuncType:2,
                                            success:false,
                                            MsgInfo:"设备正在初始化，请稍后重试"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                }
                                //web前端点击退出手动模式
                                else if(objFromFront.FuncType==3)
                                {
                                    //系统尚未开始或者全部完成，可以退出自动模式
                                    if(dataAll.sysState == 0 || dataAll.sysState == 6)
                                    {
                                        // dataAll初始化
                                        dataAll.sysState = 0;
                                        dataAll.expInfo.expMode = "无";
                                        //反馈前端
                                        var MsgToFront = {
                                            MsgType:3,
                                            FuncType:3,
                                            success: true, 
                                            MsgInfo:"系统退出手动模式"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统做完实验了，但还没有清洗
                                    else if(dataAll.sysState == 5)
                                    {
                                        var MsgToFront = {
                                            MsgType:3,
                                            FuncType:3,
                                            success: false,
                                            MsgInfo:"请先清洗实验仪器"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    //系统正在手动模式实验，想要退出，提示先清洗
                                    else if(dataAll.sysState == 1)
                                    {
                                        var MsgToFront = {
                                            MsgType:3,
                                            FuncType:3,
                                            success: false,
                                            MsgInfo:"请结束实验清洗仪器后退出手动模式"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                    else
                                    {
                                        var MsgToFront = {
                                            MsgType:3,
                                            FuncType:3,
                                            success: false,
                                            MsgInfo:"系统正在运行中，请稍后重试"
                                        }
                                        webSocket.sendData(0,MsgToFront);
                                    }
                                }
                                //web前端点击单个仪器的启动
                                else if(objFromFront.FuncType==4){
                                    console.log('手动信息',objFromFront.data.id1)
                                    switch(objFromFront.data.id1){                                   
                                        case 'valve':
                                            var buffer = Buffer.alloc(6);
                                            buffer[0] = TcpControlMessage;
                                            buffer[1] = 0x40;                      //子网id
                                            buffer[2] = Valve_type;                     //设备类型id
                                            buffer[3] = objFromFront.data.id;        //设备编号
                                            buffer[4] = objFromFront.data.outlet_channel;   //设备使用端口
                                            buffer[5] = 0x40;
                                            console.log('手动信息',buffer)
                                            global.tcpServer                                                            .sendTcpData(buffer);
                                            break;
                                        case 'heat_chip':
                                            var buffer = Buffer.alloc(9); 
                                            var tmp = Number(objFromFront.data.react_temp___);                                              
                                            buffer[0] = TcpControlMessage;
                                            buffer[1] = 0x40;
                                            buffer[2] = HeatTmp_type;
                                            buffer[3] = objFromFront.data.id;  //第一个芯片
                                            buffer[4] = objFromFront.data.heating_rate;    //chip1 加热档位
                                            buffer[5] = tmp/100;
                                            buffer[6] = tmp/10%10;
                                            buffer[7] = tmp%10;
                                            buffer[8] = 0x40;
                                            global.tcpServer.sendTcpData(buffer);
                                            break;
                                        case 'pump'://
                                            break;
                                        default:
                                            console.log('device does not have run function' )
                                            break
                                    }
                                }
                                //web前端点击单个仪器的停止
                                else if(objFromFront.FuncType==5){
                                    var buffer = Buffer.alloc(5);
                                    buffer[0] = TcpStopMessage;
                                    buffer[1] = 0x40; 
                                    if(objFromFront.data.id1=='bump'){
                                        buffer[2]=Bump_type
                                        buffer[3]=objFromFront.data.id-1
                                    }
                                    else if(objFromFront.data.id1=='valve'){
                                        buffer[2]=Valve_type
                                        buffer[3]=objFromFront.data.id-1
                                    }
                                    else if(objFromFront.data.id1=='heat_chip'){
                                        buffer[2]=HeatTmp_type
                                        buffer[3]=objFromFront.data.id
                                    }
                                    else{
                                        console.log('can not find device')
                                    }
                                    buffer[4]=0x40
                                    global.tcpServer.sendTcpData(buffer);
                                }   
                                               
                                //web前端发送泵的串口指令
                                else if(objFromFront.FuncType == 6){
                                    //suction
                                    let devID_s=objFromFront.data.id
                                    let devPort_s=objFromFront.data.channel1
                                    let devVelocity_s=objFromFront.data.velocity1_step_s_
                                    let devPosition_s=objFromFront.data.position1_step_
                                    let devPort_i=objFromFront.data.channel2
                                    let devVelocity_i=objFromFront.data.velocity2_step_s_
                                    let devPosition_i=objFromFront.data.position2_step_
                                    // var command_s = `/${devID_s}I${devPort_s}V${devVelocity_s}A${devPosition_s}R\r\n`;
                                    // var command_i = `/${devID_s}I${devPort_i}V${devVelocity_i}A${devPosition_i}R\r\n`;
                                    // var uart = TcpManualCtrol+command_s+'@'+command_i;
                                    // global.tcpServer.sendTcpData(uart); //这里网络发包发的都是ascii
                                    // console.log("发送泵串口信息：",uart); 
                                    // if(objFromFront.data=='failure'){
                                    //     var command_terminal=`/${devID_s}T\r\n`
                                    //     var uart = TcpManualCtrol+command_terminal;
                                    //     global.tcpServer.sendTcpData(uart);
                                    //     console.log("发送泵中止串口信息：",uart);  
                                    // }  
                                    
                                    var buffer = Buffer.alloc(29); 
                                                                                         
                                    buffer[0] = TcpControlMessage;
                                    buffer[1] = 0x40;
                                    buffer[2] = 0;
                                    buffer[3] = devID_s;
                                    buffer[4] = devVelocity_s/1000;  //sudu
                                    buffer[5] = (devVelocity_s%1000)/100;
                                    buffer[6] = (devVelocity_s%100)/10;
                                    buffer[7] = devVelocity_s%10;
                                    buffer[8] = devPosition_s/10000;  //location
                                    buffer[9] = (devPosition_s%10000)/1000;
                                    buffer[10] = (devPosition_s%1000)/100;
                                    buffer[11] = (devPosition_s%100)/10;
                                    buffer[12] = devPosition_s%10;
                                    buffer[13] = devPort_s;
                                    buffer[14] = 0x40;
                                    buffer[15]= 0x40;
                                    buffer[16] = 0;
                                    buffer[17] = devID_s;
                                    buffer[18] = devVelocity_i/1000;  //sudu
                                    buffer[19] = (devVelocity_i%1000)/100;
                                    buffer[20] = (devVelocity_i%100)/10;
                                    buffer[21] = devVelocity_i%10;
                                    buffer[22] = devPosition_i/10000;  //location
                                    buffer[23] = (devPosition_i%10000)/1000;
                                    buffer[24] = (devPosition_i%1000)/100;
                                    buffer[25] = (devPosition_i%100)/10;
                                    buffer[26] = devPosition_i%10;
                                    buffer[27] = devPort_i;
                                    buffer[28] = 0x40;
                                    global.tcpServer.sendTcpData(buffer);
                                }
                            }
                            else if(objFromFront.MsgType == 5)  //设置拓扑参数数据包
                            {
                                //设备类型
                                const Bump = 0;   
                                const Valve = 1;
                                const Chip = 2;
                                const Bottle = 3;
                                const PressureSensor = 4;
                                switch(objFromFront.DevType)
                                {
                                    case Bump:
                                        break;
                                    case Valve:
                                        dataAll.topology.switchingValves[objFromFront.DevId][1][0] = objFromFront.data[0];      //设置切换阀输出通道
                                        dataAll.topology.switchingValves[objFromFront.DevId][0][0] = objFromFront.data[0];
                                        break;
                                    case Chip:
                                        if(objFromFront.chipType==0)    //普通芯片
                                        {
                                            dataAll.topology.chips[objFromFront.DevId][0] = objFromFront.data[0];   //容量
                                        }
                                        else if(objFromFront.chipType==1)   //加热芯片
                                        {
                                            dataAll.topology.chips[objFromFront.DevId][1][0] = objFromFront.data[0];   //容量
                                            dataAll.topology.chips[objFromFront.DevId][1][1] = objFromFront.data[1];   //芯片1的目标温度
                                            dataAll.topology.chips[objFromFront.DevId][1][2] = objFromFront.data[2];   //芯片1的加热速度
                                            dataAll.topology.chips[objFromFront.DevId][1][3] = objFromFront.data[3];   //芯片2的目标温度
                                            dataAll.topology.chips[objFromFront.DevId][1][4] = objFromFront.data[4];   //芯片2的加热速度
                                            dataAll.topology.chips[objFromFront.DevId][1][5] = objFromFront.data[5];    //阈值警报温度
                                            //修改界面实时显示的参数。按道理这里应该是发送给下位机接收到设置成功回复包之后在修改，but由于上下位机通信机制中，下位机没有针对设置包（control)回复哪个仪器设置成功，所以就在这儿写了。讲道理逻辑顺序不太对whaterver i don`t give a fu*k
                                            dataAll.topology.chips[objFromFront.DevId][0][1] = objFromFront.data[1];   //芯片1的目标温度
                                            dataAll.topology.chips[objFromFront.DevId][0][2] = objFromFront.data[2];   //芯片1的加热速度
                                            dataAll.topology.chips[objFromFront.DevId][0][4] = objFromFront.data[3];   //芯片2的目标温度
                                            dataAll.topology.chips[objFromFront.DevId][0][5] = objFromFront.data[4];   //芯片2的加热速度
                                        }
                                        break;
                                    case Bottle:
                                        if(objFromFront.BottleType == 0)    //底物
                                        {
                                            dataAll.topology.bottles[objFromFront.DevId][1] = objFromFront.data;
                                            dataAll.topology.bottles[objFromFront.DevId][0] = objFromFront.data;
                                        }
                                        else if(objFromFront.BottleType == 1)    //单个瓶子
                                        {
                                            dataAll.topology.bottles[objFromFront.DevId] = objFromFront.data;
                                        }
                                        break;
                                    case PressureSensor:
                                        dataAll.topology.pressuSensors[objFromFront.DevId][1][0] = objFromFront.data[0];        //设置压力传感器报警阈值
                                        dataAll.topology.pressuSensors[objFromFront.DevId][0][0] = objFromFront.data[0];
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else if(objFromFront.MsgType == 6){ //连接mongoose
                                headline=objFromFront.headline
                                description=objFromFront.description
                                tag=objFromFront.tag
                                save_to_DB(headline,description,tag)
                            }
                            break;
                        case 4:
                            if(objFromFront.MsgType == 4)   //试验结果界面向后端请求试验结果数据对象
                            {
                                if(dataToResultPage.SysStatus == 1) //试验已结束
                                {               
                                    //维护dataToResultPage对象
                                    updateResultPageData();
                                    //将dataToResultPage对象发送到前端
                                    var jsonString = JSON.stringify(dataToResultPage);  
                                    wsConnection.sendText(jsonString);
                                }
                                else if(dataToResultPage.SysStatus == 0)    //试验尚未结束
                                {
                                    var errMsgToFront={
                                        MsgType:0,
                                        errType:1,	//实验尚未结束就请求结果数据
                                        errInfo:"暂无实验结果，请稍后刷新"
                                    }
                                    var jsonString = JSON.stringify(errMsgToFront);  
                                    wsConnection.sendText(jsonString);
                                }
                                
                            }
                            break;
                        case 5:

                            break;
                        case 6:

                            break;
                        case 7:

                            break;
                        case 8:

                            break;
                        default:
                            break;
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
            //使用global.tcpServer.sendTcpData（）发送tcp数据包。
            console.log('tcp',tcp_issend)
            if(tcp_issend){
                //模板：经测试ok
                // var a = [0xfe,1,0];
                // const buffer = Buffer.from(a); 
                // global.tcpServer.sendTcpData(buffer);
            }
            else{
                console.log("TCP socket not connected",tcp_issend);  
            }       
    })
 
    conn.on("close",function(code,reason){
        console.log("web front connection closed");
        clientConnected = false;
        wsConnection = {};
    })

    conn.on("error",function(err){
        console.log("AI front ws handle err");
        console.log(err);
        clientConnected = false;
        wsConnection = {};
    })
}).listen(PORT,(ws)=>{
    wsConnection=ws
    console.log("web front websocket server listening",PORT)
})

//----------------------------前后端websocket连接  end--------------------------------------------


//----------------------------nodejs与MATLAB websocket连接  begin--------------------------------------------
//nodejs与matlab 建立websocket连接，获取压力传感器数据

//与matlab 建立websocket连接，获取压力传感器的数据
var PORT2 = 3003;        //xy:需与matlab中PORT相同才能建立websocket连接
var clientConnected2 = false;
// on就是addListener，添加一个监听事件调用回调函数
var server3002 = ws.createServer(function(conn){
    console.log('New connection with matlab ws client on Port',PORT2);
    clientConnected2 = true;
    wsConnection2 = conn;
    var i = 1;
    conn.on("text",function(str){
        i = i+1;
        if(i==10)
        {
            console.log("str from MATLAB:",str);
            console.log("1");
            i = 0;
        }
        var tcp_issend = 0;
        if(str=="sensor websocket connect"){    //接收到matlab发送来的websocket建立连接的消息
            //向matlab发送传感器初始化信号
            conn.sendText("init");
            global.pressureSensor_flag = 0;
            tcp_issend = 1;
        }
        else if(str=="sensor init finish"){
            // 压力传感器初始化完毕，下个状态发送
            global.pressureSensor_flag = 1;
        }   
        else{   // 压力传感器正在传输数据，使用传输的数据维护数据对象
            updatePressureSensorData(str);
        }      
    })
    //xy:  监听websocket断开链接
    conn.on("close",function(code,reason){
        console.log("matlab ws client connection closed");
        clientConnected2 = false;
        wsConnection2 = {};
    })
    //xy: 监听websocket异常信息
    conn.on("error",function(err){
        console.log("matlab ws handle err");
        console.log(err);
        clientConnected2 = false;
        wsConnection2 = {};
    })
}).listen(PORT2,()=>{
    console.log("matlab pressure sensor websocket server listening",PORT2)
})

//----------------------------nodejs与MATLAB websocket连接  end--------------------------------------------


//----------------------------jyh:nodejs与AI websocket连接  begin--------------------------------------------
//nodejs与AI部分建立websocket连接，获取生成的合成配方
var PORT3 = 3004;        //需与逆合成中PORT相同才能建立websocket连接
var clientConnected3 = false;
// var input
var graph_ai 
var server3004 = ws.createServer(function(conn){
    console.log('New connection with Retrosynthesis Module ws client on Port',PORT3);
    clientConnected3 = true;
    wsConnection3 = conn;
    conn.on("text",function(str){
        // str from front: index is open
        var input = JSON.parse(str);
        //ws.send(str);
        messageType=input.serve
        console.log('fg',input)
        switch (messageType) {
            case "single":
                console.log('Received text from single client:',str);
                var socket = io('ws://219.228.149.80:3012/single_retro',{ transports: ['websocket'] })
                // 执行相关的计算操作
                socket.emit('calculate', input);
                so(socket)
                break;
            case "multi":
                console.log('Received text from multi client:',str);
                socket = io('ws://219.228.149.80:3012/multi_retro',{ transports: ['websocket'] });
                socket.emit('calculate', input);
                so(socket)
                break;
            // 添加其他消息类型的处理逻辑
            case 'graph':
                
                input['info']=3004
                // socket_graph.emit(input)          
            default:
                console.log('Received text from condition client:',str);
                socket = io('ws://219.228.149.80:3012/condition_predict',{ transports: ['websocket'] });
                socket.emit('calculate', input);
                so(socket)
                break;
        }
    })
 
    conn.on("close",function(code,reason){
        console.log("ai ws client connection closed");
        clientConnected3 = false;
        wsConnection3 = {};
        
    })
    //xy: 监听websocket异常信息
    conn.on("error",function(err){
        console.log("ai ws handle err");
        console.log(err);
        clientConnected3 = false;
        wsConnection3 = {};
    })
}).listen(PORT3,()=>{
    console.log("ai websocket server listening",PORT3)
})

function so(socket){
    socket.on('connect', () => {
        console.log('Connected to server!');
        // socket.emit('calculate', input);
    });
    socket.on('result', (data) => {
        console.log('Received result from server:', data);
        wsConnection3.send(JSON.stringify(data))
    });
    // 监听断开连接事件
    socket.on('disconnect', (reason) => {
        console.log('Disconnected from server',reason);
    });

    socket.on('message', (data) => {
        console.log('Received message from server:', data);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    socket.on('graph_mapping', (data) => {
        console.log('mapped--------------------',data)
        wsConnection.send(JSON.stringify({
            MsgType:4,
            data:data}))
    });
}

//----------------------------------------------------------------------------------------------------------------------

var PORT4 = 3005;        //需与resultpage_jqueryfunc.js中new WebSocket的PORT相同才能建立websocket连接
var wsConnection4 = {};  //与数据库链接的conn
//标记客户端是否已连接
var clientConnected4 = false;
//创建websocket服务器
var server = ws.createServer(function(conn){
    console.log('New connection with Front on Port',PORT4);
    clientConnected4 = true;
    // 将连接对象保存到wsConnection4变量中
    wsConnection4 = conn;
    // 当收到文本消息时，执行以下函数
    conn.on("text",function(str){
        if(str == 'database1page is opened'){
            // 定义一个变量用于存储返回给前端的数据
            var objBack;
            SuccessDataSchema.find({}).sort({'_id':-1}).limit().exec(function(err,docs){
                objBack = docs;
                // 将数据以JSON字符串的形式发送给前端 
                conn.sendText(JSON.stringify(objBack));
                console.log('New connection with Front on Port',JSON.stringify(objBack));
            })
        }
        // 如果收到的消息不是'database1page is opened' 则是resultPage页面输入的实验记录
        else{
            var ReceivedDatabase = JSON.parse(str);
            console.log("str from front1:" + ReceivedDatabase.ExperimentalPeriod);         
            // 使用解析后的数据创建一个新的SuccessDataSchema实例 
            const newData = new SuccessDataSchema({  
                ExperimentalPeriod: ReceivedDatabase.ExperimentalPeriod,  
                Experimenter: ReceivedDatabase.Experimenter,  
                ReagentName: ReceivedDatabase.ReagentName,  
                Concentration: ReceivedDatabase.Concentration,  
                FlowVelocity: ReceivedDatabase.FlowVelocity,  
                ReactorTemperature: ReceivedDatabase.ReactorTemperature,  
                ReactorVolume: ReceivedDatabase.ReactorVolume,  
                ReactionTime: ReceivedDatabase.ReactionTime,  
                ProductivityRate: ReceivedDatabase.ProductivityRate,  
                PercentConversion: ReceivedDatabase.PercentConversion   
            });  
            // 保存新创建的实例到数据库中 
            newData.save()  
                .then(doc => {  
                    console.log('Saved document:', doc);  
                })  
                .catch(err => {  
                    console.error('Error saving document:', err);  
                }); 

        }

    })

    conn.on("close",function(code,reason){
        console.log("db ws client connection closed");
        clientConnected4 = false;
        wsConnection4 = {};
    })

    conn.on("error",function(err){
        console.log("db ws handle err");
        console.log(err);
        clientConnected4 = false;
        wsConnection4 = {};
    })
}).listen(PORT4,()=>{
    console.log("db websocket server listening",PORT4)
})
 



//----------------------------nodejs与AI websocket连接  end--------------------------------------------


//将2个websocket封装在一起，export出去方便外部调用
class WebSocket{
    constructor(){
        console.log("WebSocket建立完毕");
    }
    sendData(num,data){ //通过num来区分在哪个websocket连接上发消息,data为对象
        switch(num)
        {
            case 0: //与前端websocket通信
            {
                if(clientConnected){
                    console.log(`Sending: ${JSON.stringify(data)} to Front`);
                    // 将data对象转换为字符串，接收端通过JSON.parse()方法将字符串还原成对象
                    wsConnection.send(JSON.stringify(data));
                }else{
                    console.log("WTF?! 前后端websocket竟然失去连接···究竟是人性的扭曲还是道德的沦丧！");
                }
                
            }  
                break;
            case 1:    //与matlab ws 通信
            {
                if(clientConnected2){
                    //console.log(`Sending: ${JSON.stringify(data)}`);
                    wsConnection2.send(data);
                }else{
                    var MsgToFront = {
                        MsgType:0,
                        errType:3,
                        errInfo:"请检查主机与压力传感器的软硬件连接！"
                    }
                    wsConnection.send(JSON.stringify(MsgToFront));
                }
            }  
                break;
            default:
            {
                
            }
            
        }
        
    }
    CheckWsConn(socketId){  //检查前后端和matlab的连接
        if(socketId==0)
        {
            if(clientConnected)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if(socketId==1)
        {
            if(clientConnected2)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else{
            console.log("CheckWsConn()请输入正确参数")
        }
        
    }
    closeSocket(num){//通过num来区分关闭哪个websocket
        switch(num)
        {
            case'0':    //关闭与前端的websocket
            {
                if(clientConnected){
                    // console.log(`webSocket关闭`);  //xy
                    wsConnection.close();
                    console.log(`webSocket关闭`);
                }else{
                    return
                }
                break;
            }
            case'1':    //关闭与matlab1的websocket
            {
                if(clientConnected2){
                    // console.log(`webSocket关闭`);  //xy
                    wsConnection2.close();
                    console.log(`webSocket关闭`);
                }else{
                    return
                }
                break;
            }
            case'2':    //关闭与matlab2的websocket
            {
                if(clientConnected3){
                    // console.log(`webSocket关闭`);  //xy
                    wsConnection3.close();
                    console.log(`webSocket关闭`);
                }else{
                    return
                }
            }
        }
        
    }
    setMaxBufLength(len)
    {
        ws.setMaxBufferLength(len);
    }
}

//更新dataToProcessingPage数据对象
function updateProcessingPageData()
{
     //瓶子数据
    //bottle1, elem1
    dataToProcessingPage.Bottles.bottle1.Val1 = dataAll.topology.bottles[0][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle1.Val2 = dataAll.topology.bottles[0][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle1.Val3 = dataAll.topology.bottles[0][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle1.Val4 = dataAll.topology.bottles[0][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle1.Val5 = dataAll.topology.bottles[0][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle1.Val6 = dataAll.topology.bottles[0][0][5];  //红瓶试剂当前含量ml
    //bottle2, elem2
    dataToProcessingPage.Bottles.bottle2.Val1 = dataAll.topology.bottles[1][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle2.Val2 = dataAll.topology.bottles[1][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle2.Val3 = dataAll.topology.bottles[1][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle2.Val4 = dataAll.topology.bottles[1][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle2.Val5 = dataAll.topology.bottles[1][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle2.Val6 = dataAll.topology.bottles[1][0][5];  //红瓶试剂当前含量ml
    //bottle3, elem6
    dataToProcessingPage.Bottles.bottle3.Val1 = dataAll.topology.bottles[2];        //试剂名称
    //bottle4, elem8
    dataToProcessingPage.Bottles.bottle4.Val1 = dataAll.topology.bottles[3][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle4.Val2 = dataAll.topology.bottles[3][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle4.Val3 = dataAll.topology.bottles[3][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle4.Val4 = dataAll.topology.bottles[3][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle4.Val5 = dataAll.topology.bottles[3][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle4.Val6 = dataAll.topology.bottles[3][0][5];  //红瓶试剂当前含量ml
    //bottle5, elem11
    dataToProcessingPage.Bottles.bottle5.Val1 = dataAll.topology.bottles[4][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle5.Val2 = dataAll.topology.bottles[4][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle5.Val3 = dataAll.topology.bottles[4][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle5.Val4 = dataAll.topology.bottles[4][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle5.Val5 = dataAll.topology.bottles[4][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle5.Val6 = dataAll.topology.bottles[4][0][5];  //红瓶试剂当前含量ml
    //bottle6, elem16
    dataToProcessingPage.Bottles.bottle6.Val1 = dataAll.topology.bottles[5][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle6.Val2 = dataAll.topology.bottles[5][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle6.Val3 = dataAll.topology.bottles[5][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle6.Val4 = dataAll.topology.bottles[5][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle6.Val5 = dataAll.topology.bottles[5][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle6.Val6 = dataAll.topology.bottles[5][0][5];  //红瓶试剂当前含量ml
    //bottle7, elem18
    dataToProcessingPage.Bottles.bottle7.Val1 = dataAll.topology.bottles[6][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle7.Val2 = dataAll.topology.bottles[6][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle7.Val3 = dataAll.topology.bottles[6][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle7.Val4 = dataAll.topology.bottles[6][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle7.Val5 = dataAll.topology.bottles[6][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle7.Val6 = dataAll.topology.bottles[6][0][5];  //红瓶试剂当前含量ml
    //bottle8, elem19
    dataToProcessingPage.Bottles.bottle8.Val1 = dataAll.topology.bottles[7];        //试剂名称
    //bottle9, elem21
    dataToProcessingPage.Bottles.bottle9.Val1 = dataAll.topology.bottles[8];        //试剂名称
    //bottle10, elem22
    dataToProcessingPage.Bottles.bottle10.Val1 = dataAll.topology.bottles[9];        //试剂名称 
    //bottle11, elem25
    dataToProcessingPage.Bottles.bottle11.Val1 = dataAll.topology.bottles[10][0][0];  //Reagent
    dataToProcessingPage.Bottles.bottle11.Val2 = dataAll.topology.bottles[10][0][1];  //蓝瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle11.Val3 = dataAll.topology.bottles[10][0][2];  //绿瓶试剂名称
    dataToProcessingPage.Bottles.bottle11.Val4 = dataAll.topology.bottles[10][0][3];  //绿瓶试剂当前含量ml
    dataToProcessingPage.Bottles.bottle11.Val5 = dataAll.topology.bottles[10][0][4];  //红瓶试剂名称
    dataToProcessingPage.Bottles.bottle11.Val6 = dataAll.topology.bottles[10][0][5];  //红瓶试剂当前含量ml
    //bottle12, elem28
    dataToProcessingPage.Bottles.bottle12.Val1 = dataAll.topology.bottles[11];        //试剂名称
    //bottle13, elem29
    dataToProcessingPage.Bottles.bottle13.Val1 = dataAll.topology.bottles[12];        //试剂名称
    
    //泵数据
    //pump1, elem3
    dataToProcessingPage.Pumps.pump1.Val1 = dataAll.topology.pumps[0][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump1.Val2 = dataAll.topology.pumps[0][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump1.Val3 = dataAll.topology.pumps[0][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump1.Val4 = dataAll.topology.pumps[0][0][3];    //完成进度（0~100）
    //pump2, elem4
    dataToProcessingPage.Pumps.pump2.Val1 = dataAll.topology.pumps[1][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump2.Val2 = dataAll.topology.pumps[1][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump2.Val3 = dataAll.topology.pumps[1][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump2.Val4 = dataAll.topology.pumps[1][0][3];    //完成进度（0~100）
    //pump3, elem9
    dataToProcessingPage.Pumps.pump3.Val1 = dataAll.topology.pumps[2][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump3.Val2 = dataAll.topology.pumps[2][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump3.Val3 = dataAll.topology.pumps[2][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump3.Val4 = dataAll.topology.pumps[2][0][3];    //完成进度（0~100）
    //pump4, elem10
    dataToProcessingPage.Pumps.pump4.Val1 = dataAll.topology.pumps[3][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump4.Val2 = dataAll.topology.pumps[3][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump4.Val3 = dataAll.topology.pumps[3][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump4.Val4 = dataAll.topology.pumps[3][0][3];    //完成进度（0~100）
    //pump5,elem24
    dataToProcessingPage.Pumps.pump5.Val1 = dataAll.topology.pumps[4][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump5.Val2 = dataAll.topology.pumps[4][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump5.Val3 = dataAll.topology.pumps[4][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump5.Val4 = dataAll.topology.pumps[4][0][3];    //完成进度（0~100）
    //pump6, elem15
    dataToProcessingPage.Pumps.pump6.Val1 = dataAll.topology.pumps[5][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump6.Val2 = dataAll.topology.pumps[5][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump6.Val3 = dataAll.topology.pumps[5][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump6.Val4 = dataAll.topology.pumps[5][0][3];    //完成进度（0~100）
    //pump7, elem17
    dataToProcessingPage.Pumps.pump7.Val1 = dataAll.topology.pumps[6][0][0];    //流速（ul/min)
    dataToProcessingPage.Pumps.pump7.Val2 = dataAll.topology.pumps[6][0][1];    //通道（1~6）
    dataToProcessingPage.Pumps.pump7.Val3 = dataAll.topology.pumps[6][0][2];    //状态(吸取，注射)
    dataToProcessingPage.Pumps.pump7.Val4 = dataAll.topology.pumps[6][0][3];    //完成进度（0~100）

    //芯片数据
    //chip1 elem5
    dataToProcessingPage.chips.chip1.Val1 = dataAll.topology.chips[0];          //容量（ml)
    //chips1 elem12
    dataToProcessingPage.chips.chip2.Val1 = dataAll.topology.chips[1][1][0];    //容量（ml)
    dataToProcessingPage.chips.chip2.Val2 = dataAll.topology.chips[1][0][0];    //芯片1当前温度（摄氏度）
    dataToProcessingPage.chips.chip2.Val3 = dataAll.topology.chips[1][0][2];    //芯片1加热速度（1~10档）
    dataToProcessingPage.chips.chip2.Val4 = dataAll.topology.chips[1][0][3];    //芯片2当前温度（摄氏度）
    dataToProcessingPage.chips.chip2.Val5 = dataAll.topology.chips[1][0][5];    //芯片2加热速度（1~10档）
    dataToProcessingPage.chips.chip2.Val6 = dataAll.topology.chips[1][1][5];    //阈值警报温度，单位摄氏度
    dataToProcessingPage.chips.chip2.Val7 = dataAll.topology.chips[1][0][1];    //芯片1设置温度 unit: 摄氏度
    dataToProcessingPage.chips.chip2.Val8 = dataAll.topology.chips[1][0][4];    //芯片2设置温度 unit: 摄氏度
    //chips2 elem23
    dataToProcessingPage.chips.chip3.Val1 = dataAll.topology.chips[2][1][0];    //容量（ml)
    dataToProcessingPage.chips.chip3.Val2 = dataAll.topology.chips[2][0][0];    //芯片1当前温度（摄氏度）
    dataToProcessingPage.chips.chip3.Val3 = dataAll.topology.chips[2][0][2];    //芯片1加热速度（1~10档）
    dataToProcessingPage.chips.chip3.Val4 = dataAll.topology.chips[2][0][3];    //芯片2当前温度（摄氏度）
    dataToProcessingPage.chips.chip3.Val5 = dataAll.topology.chips[2][0][5];    //芯片2加热速度（1~10档）
    dataToProcessingPage.chips.chip3.Val6 = dataAll.topology.chips[2][1][5];    //阈值警报温度，单位摄氏度
    dataToProcessingPage.chips.chip3.Val7 = dataAll.topology.chips[2][0][1];    //芯片1设置温度 unit: 摄氏度
    dataToProcessingPage.chips.chip3.Val8 = dataAll.topology.chips[2][0][4];    //芯片2设置温度 unit: 摄氏度

    //压力传感器数据
    //sensor1 elem13
    dataToProcessingPage.PressureSensors.pressensor1.Val1 = dataAll.topology.pressuSensors[0][0][0];    //当前压力值,单位mbar
    dataToProcessingPage.PressureSensors.pressensor1.Val2 = dataAll.topology.pressuSensors[0][1][0];    //阈值警报压力，单位mbar
    //sensor2 elem26
    dataToProcessingPage.PressureSensors.pressensor2.Val1 = dataAll.topology.pressuSensors[1][0][0];
    dataToProcessingPage.PressureSensors.pressensor2.Val2 = dataAll.topology.pressuSensors[1][1][0];    //阈值警报压力，单位mbar

    //切换阀数据
    //swValve1 elem7
    dataToProcessingPage.SwitchingValves.swvalve1.Val1 = dataAll.topology.switchingValves[0][0][0]; //当前输出通道（1~6）
    //swValve2 elem20
    dataToProcessingPage.SwitchingValves.swvalve2.Val1 = dataAll.topology.switchingValves[1][0][0]; //当前输出通道（1~6）
    //swValve3 elem27
    dataToProcessingPage.SwitchingValves.swvalve3.Val1 = dataAll.topology.switchingValves[2][0][0]; //当前输出通道（1~6）

    //总线电压
    dataToProcessingPage.ElectricalParameters.busVoltage.ValNum = dataAll.topology.electricalParameters[0][0];
    //总线电流
    dataToProcessingPage.ElectricalParameters.busCurrent.ValNum = dataAll.topology.electricalParameters[0][1];
    //系统功率
    dataToProcessingPage.ElectricalParameters.systemPower.ValNum = dataAll.topology.electricalParameters[0][2];
}

//维护dataToResultPage数据对象
function updateResultPageData()//运用dataall作为数据
{
    dataToResultPage.Mode = dataAll.expInfo.expMode;
    dataToResultPage.StartTime = dataAll.expInfo.startTime;
    dataToResultPage.StopTime = dataAll.expInfo.stopTime;
    dataToResultPage.Pressure.time = dataAll.expInfo.dataHistory.pressure.time;
    dataToResultPage.Pressure.pressure1 = dataAll.expInfo.dataHistory.pressure.data1;
    dataToResultPage.Pressure.pressure2 = dataAll.expInfo.dataHistory.pressure.data2;
    dataToResultPage.Tempreture.time = dataAll.expInfo.dataHistory.tempreture.time;
    dataToResultPage.Tempreture.tempreture1 = dataAll.expInfo.dataHistory.tempreture.data1;
    dataToResultPage.Tempreture.tempreture2 = dataAll.expInfo.dataHistory.tempreture.data2;
    dataToResultPage.Tempreture.tempreture3 = dataAll.expInfo.dataHistory.tempreture.data3;
    dataToResultPage.Tempreture.tempreture4 = dataAll.expInfo.dataHistory.tempreture.data4;
}

// 压力传感器正在传输数据，使用传输的数据维护数据对象
function updatePressureSensorData(str)
{
    if(global.pressureSensor_flag == 2)
    {          
        // 使用正则表达式匹配A和B的数据  
        const regex = /([A-Za-z]+)([0-9.-]+),([A-Za-z]+)([0-9.-]+)/;  
        const match = str.match(regex);  
        
        if (match)
        {  
            const str1 = match[1];  
            const num1 = match[2];  
            const str2 = match[3];  
            const num2 = match[4]; 

            if(str1 == 'A' && str2 == 'B')
            {
                // 维护后端核心数据对象
                const now = new Date();  
                const hours = String(now.getHours()).padStart(2, '0');  
                const minutes = String(now.getMinutes()).padStart(2, '0');  
                const seconds = String(now.getSeconds()).padStart(2, '0');  
                const timeString = `${hours}:${minutes}:${seconds}`;
                //只在实验进行中把压力传感器数据记录到dataAll和dataToProcessingPage对象 
                if(dataAll.sysState == 1)
                {
                    dataAll.expInfo.dataHistory.pressure.time.push(timeString);
                    dataAll.expInfo.dataHistory.pressure.data1.push(num1);
                    dataAll.expInfo.dataHistory.pressure.data2.push(num2);
                    dataAll.topology.pressuSensors[0][0][0] = num2;
                    //dataAll.topology.pressuSensors[1][0][0] = num2;
                    dataAll.topology.pressuSensors[1][0][0] = 0;

                    dataToProcessingPage.PressTempChart.Pressure.time.push(timeString);
                    dataToProcessingPage.PressTempChart.Pressure.pressure1.push(num1);
                    dataToProcessingPage.PressTempChart.Pressure.pressure2.push(num2);
                }
                //在紧急错误停止、实验结束和清洗之间的过渡、清洗阶段实时更新dataToProcessingPage表格
                else if(dataAll.sysState == 2 || dataAll.sysState == 3 || dataAll.sysState == 5  )
                {
                    dataToProcessingPage.PressTempChart.Pressure.time.push(timeString);
                    dataToProcessingPage.PressTempChart.Pressure.pressure1.push(num1);
                    dataToProcessingPage.PressTempChart.Pressure.pressure2.push(num2);
                }
            }
        

        }
    

    }
}

//拿出温度的个位，十位，百位
function getDigits(n) {  
    if (n < 10) { // 如果是1位数  
        return [n, 0, 0];  
    } else if (n < 100) { // 如果是2位数  
        return [n % 10, n / 10 % 10, 0];  
    } else { // 如果是3位数  
        return [n % 10, n / 10 % 10, n / 100];  
    }  
}


let webSocket = new WebSocket();
module.exports = webSocket;
