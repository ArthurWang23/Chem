//  上位机整个系统最核心的数据结构，
//  所有发送给前端界面和下位机的数据均从此获得

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


var dataAll = {
    //系统状态，0初始停止，1正常运行，2错误紧急停止,3清洗，4init, 5当前试验已完成，6清洗完成，可以开始新实验
    sysState:0, 
    
    //实验数据
    expInfo:{
        //实验类型："自动模式"，"手动模式","无"
        expMode:"无",   
        //实验日期（自动模式以点击“开始实验”时间为准，手动模式以点击“进入手动模式”为准)
        date:"",
        //实验开始时间（自动模式以点击“开始实验”时间为准，手动模式以点击“进入手动模式”为准)
        startTime:"",
        //实验结束时间（自动模式以点击“结束实验”时间为准，手动模式以点击“退出手动模式”为准
        stopTime:"",
        //利多卡因产率
        chanlv1:"",
        // 地西泮产率
        chanlv2:"",
        // 手动模式操作记录
        manuSettings:{
            //操作时间
            time: [],
            //操作明细
            settings:[]
        },
        // 自动模式下载的配方
        peifang:{
            // //自动模式配方，按顺序将这些指令组包tcp发送
            // tcpPackage:[
            //     //初始化
            //     [TcpStateMessage],
            //     //1.	3二号口快速吸取原料液吸到2400, 4二号口快速吸取原料液吸到2400,   @写成0x40, #写成0x40
            //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40,NetId0,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40],
            //     //2.	3六号口快速排出,4六号口快速排出
            //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
            //     //3.	7切换到6号口
            //     [TcpControlMessage,NetId0,Valve,0,6],
            //     //4.	3二号口快速吸取原料液，吸满24000；4二号口快速吸取原料液，吸满24000
            //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40],
            //     //5.	开始计时30min, 时间到7切换到2号口
            //     [TcpControlMessage,NetId0,Valve,0,2,0x40],
            //     //6.	9二号口快速吸取原料液吸到2400，10二号口快速吸取原料液吸到2400
            //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40,NetId1,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40],
            //     //7.	9六号口快速排出,10六号口快速排出
            //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40],
            //     //8.    9二号口快速吸取原料液，吸满24000；10二号口快速吸取原料液，吸满24000
            //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40],
            //     //9.	12温度升高到100°C，缓慢升高。
            //     [TcpControlMessage,NetId1,Tmp,0,1,1,0,0,0x40,NetId1,Tmp,1,1,1,0,0,0x40],
            //     //10.	20切换到2号口
            //     [TcpControlMessage,NetId2,Valve,0,2,0x40],
            //     //11.	9五号口以速度6排出；10五号口以速度8排出。
            //     [TcpControlMessage,NetId1,Bump,1,0,0,0,6,0,0,0,0,0,5,0x40,NetId1,Bump,0,0,0,0,8,0,0,0,0,0,5,0x40],
            //     //12.	检测12温度到达100开始计时半小时，时间到20切换到6号口
            //     [TcpControlMessage,NetId2,Valve,0,6,0x40],
            //     //13.	15二号口快速吸取原料液吸到2400，17二号口快速吸取原料液吸到2400
            //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40,NetId2,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40],
            //     //14.	15六号口快速排出,17六号口快速排出
            //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
            //     //15.	15二号口快速吸取原料液，吸满24000；17二号口快速吸取原料液，吸满24000
            //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40],
            //     //16.	15五号口以速度15排出；17五号口以速度15排出
            //     [TcpControlMessage,NetId2,Bump,0,0,0,1,5,0,0,0,0,0,5,0x40,NetId2,Bump,1,0,0,1,5,0,0,0,0,0,5,0x40]
            // ],
            Pumps:[
                //["底物名称"，num（流速，ul/min),"状态"]
                //pump1,
                ["",0,""],
    
                //pump2
                ["",0,""],
    
                //pump3
                ["",0,""],
    
                //pump4
                ["",0,""],
                // {
                
                //pump5
                ["",0,""],
    
                //pump6
                ["",0,""],
    
                //pump7
                ["",0,""]
            ],
            Chips:[
                //[num(容量，ml),"芯片1设置温度，芯片2设置温度（单位摄氏度）"，"芯片1设置的加热速度，芯片2设置的加热速度（单位 档）"]
                // chip1, 只有容量不加热
                [0.125,"",""],
                
                // 芯片组1
                [3.4, "100,100","5,5"],
                
                //芯片组2
                [3.4, "100,100","5,5"]
            ],
            SwValves:[
                //[num(输出通道，范围1~6)]
                // 流通切换阀1
                [1],

                // 流通切换阀2
                [1],
                
                // 流通切换阀3
                [1]
            ]
        },
        // //清洗指令
        // cleanProc:[
        //     //0.关闭加热
        //     [TcpStopMessage,NetId1,Tmp,0,0x40,NetId1,Tmp,1,0x40],
        //     //1.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //2.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //3.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //4.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //5.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //6.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //7.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //8.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //9. 7切换到6号口；20切换到2号口
        //     [TcpControlMessage,NetId0,Valve,0,6,0x40,NetId2,Valve,0,2,0x40],
        //     //10. 泵1泵2五号口以速度30排出。
        //     [TcpControlMessage,NetId0,Bump,0,0,0,3,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,0,0,3,0,0,0,0,0,0,5,0x40],
        //     //11. 泵3泵4泵5泵6五号口以速度80排出。
        //     [TcpControlMessage,NetId1,Bump,0,0,0,8,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,0,0,8,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,0,0,8,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,0,0,8,0,0,0,0,0,0,5,0x40],
        //     //12. 泵1泵2泵3泵4泵5泵6 一号口快速吸取空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40],
        //     //13. 泵1泵2泵3泵4泵5泵6 五号口快速排出空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40],
        //     //14. 泵1泵2泵3泵4泵5泵6 一号口快速吸取空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40],
        //     //15. 泵1泵2泵3泵4泵5泵6 五号口快速排出空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40]
        // ],
        //压力传感器和温度记录
        dataHistory:{
            // 压力记录
            pressure:{
                //时间
                time:[],  //字符串数组
                //压力传感器1压力
                data1:[],    //数据数组
                //压力传感器2压力
                data2:[]    //数据数组
            },
            // 温度记录
            tempreture:{
                //时间
                time:[""],  //字符串数组
                //芯片组1芯片1温度
                data1:[],    //数据数组
                //芯片组1芯片2温度
                data2:[],    //数据数组
                //芯片组2芯片1温度
                data3:[],    //数据数组
                //芯片组2芯片2温度
                data4:[]    //数据数组
            }
        }
    },

    //拓扑数据
    topology:{
        //瓶子
        bottles:[
            //bottle1, elem1
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle2, elem2
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],
            
            //bottle3, elem6
            //["试剂名称"]
            ["waste"],

            //bottle4, elem8
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",20,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",20,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle5, elem11
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle6, elem16
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle7, elem18
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle8, elem19
            //["试剂名称"]
            ["水相"],

            //bottle9, elem21
            //["试剂名称"]
            ["waste"],

            //bottle10, elem22
            //["试剂名称"]
            ["有机相"],

            //bottle11, elem25
            [
                //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
                ["Reagent",50,"Cleaning",50,"waste",0],
                //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
                [1,10,2,10,3,10],
                //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
                [1,1,1]
            ],

            //bottle12, elem28
            //["试剂名称"]
            ["waste"],

            //bottle13, elem29
            //["试剂名称"]
            ["地西泮"]
        ],

        //泵
        pumps:[
            //pump1, elem3
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1000,2,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump2, elem4
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1000,2,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump3, elem9
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1500,6,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump4, elem10
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1500,6,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump5, elem24
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1000,2,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump6, elem15
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1000,5,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ],
            //pump7, elem17
            [
                //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num上一次的位置, num完成进度（0~100）]
                [1000,5,"吸取",0,0,0],
                //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
                [0,0,"吸取",0],
                //state[num状态] 0停止，1正常工作，2初始化，3错误
                [0]
            ]
        ],

        //芯片
        chips:[
            //chip1 elem5
            //[num容量（ml)]
            [0.125],

            //chips1 elem12
            [
                //realtime data [num芯片1当前温度（摄氏度），num芯片1当前目标温度（摄氏度）,num芯片1当前加热速度（1~10档），num芯片2当前温度（摄氏度），，num芯片2当前目标温度（摄氏度）,num芯片2当前加热速度（1~10档）]
                [30,100,1,30,100,1],
                //setting data [num芯片容量（ml),num芯片1目标温度（摄氏度），num芯片1加热速度（1~10档），num芯片2目标温度（摄氏度），num芯片2加热速度（1~10档），警报阈值温度上限（摄氏度）]
                [3.4,100,1,100,1,180],
                //state [ num1状态，num2警报状态] num1=0静止，=1加热； num2=0非阈值警报，=1阈值警报
                [0,0]
            ],
            
            //chips2 elem23
            [
               //realtime data [num芯片1当前温度（摄氏度），num芯片1当前目标温度（摄氏度）,num芯片1当前加热速度（1~10档），num芯片2当前温度（摄氏度），，num芯片2当前目标温度（摄氏度）,num芯片2当前加热速度（1~10档）]
               [30,100,1,30,100,1],
               //setting data [num芯片容量（ml),num芯片1目标温度（摄氏度），num芯片1加热速度（1~10档），num芯片2目标温度（摄氏度），num芯片2加热速度（1~10档），警报阈值温度上限（摄氏度）]
               [3.4,100,1,100,1,180],
                //state [ num1状态，num2警报状态] num1=0静止，=1加热； num2=0非阈值警报，=1阈值警报
                [0,0]
            ]
        ],

        //压力传感器
        pressuSensors:[
            //sensor1 elem13
            [
                //realtime data [num压力值（mabr)]
                [0],
                //setting data [num阈值压力值（mabr)]
                [2000],
                //state [num1状态，num2压力阈值状态] num1=0停止，=1正常工作 =2初始化， =3错误； num2=0未超过阈值，num2=1阈值警报
                [0,0]
            ],
            //sensor2 elem26
            [
                //realtime data [num压力值（mabr)]
                [0],
                //setting data [num阈值压力值（mabr)]
                [2000],
                //state [num1状态，num2压力阈值状态] num1=0停止，=1正常工作 =2初始化， =3错误； num2=0未超过阈值，num2=1阈值警报
                [0,0]
            ]

        ],

        //切换阀
        switchingValves:[
            //swValve1 elem7
            [
                //realtime channel [num当前输出通道（1~6）]
                [1],
                //setting channel [num设置的输出通道（1~6）]
                [1],
                //state [num状态] =0异常 =1正常
                [1],
            ],

            //swValve2 elem20
            [
                //realtime channel [num当前输出通道（1~6）]
                [1],
                //setting channel [num设置的输出通道（1~6）]
                [1],
                //state [num状态] =0异常 =1正常
                [1],
            ],

            //swValve3 elem27
            [
                //realtime channel [num当前输出通道（1~6）]
                [1],
                //setting channel [num设置的输出通道（1~6）]
                [1],
                //state [num状态] =0异常 =1正常
                [1],
            ]
        ],

        //电学参数
        electricalParameters:[
            //总线电压，总线电流，系统功率
            [
                //总线电压
                [0],
                //总线电流
                [0],
                //系统功率
                [0],
            ]

        ]
    },

    Init:function()
    {
        this.sysState = 0;
        this.expInfo.expMode = "无";
        this.expInfo.date = "";
        this.expInfo.startTime = "";
        this.expInfo.stopTime = "";
        this.expInfo.chanlv1 = "";
        this.expInfo.chanlv2 = "";
        this.expInfo.manuSettings.time = "";
        this.expInfo.manuSettings.settings = "";
        // this.expInfo.peifang.tcpPackage = [
        //     //初始化
        //     [TcpStateMessage],
        //     //1.	3二号口快速吸取原料液吸到2400, 4二号口快速吸取原料液吸到2400,   @写成0x40, #写成0x40
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40,NetId0,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40],
        //     //2.	3六号口快速排出,4六号口快速排出
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //3.	7切换到6号口
        //     [TcpControlMessage,NetId0,Valve,0,6],
        //     //4.	3二号口快速吸取原料液，吸满24000；4二号口快速吸取原料液，吸满24000
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40],
        //     //5.	开始计时30min, 时间到7切换到2号口
        //     [TcpControlMessage,NetId0,Valve,0,2,0x40],
        //     //6.	9二号口快速吸取原料液吸到2400，10二号口快速吸取原料液吸到2400
        //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40,NetId1,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40],
        //     //7.	9六号口快速排出,10六号口快速排出
        //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //8.    9二号口快速吸取原料液，吸满24000；10二号口快速吸取原料液，吸满24000
        //     [TcpControlMessage,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40],
        //     //9.	12温度升高到100°C，缓慢升高。
        //     [TcpControlMessage,NetId1,Tmp,0,1,1,0,0,0x40,NetId1,Tmp,1,1,1,0,0,0x40],
        //     //10.	20切换到2号口
        //     [TcpControlMessage,NetId2,Valve,0,2,0x40],
        //     //11.	9五号口以速度6排出；10五号口以速度8排出。
        //     [TcpControlMessage,NetId1,Bump,1,0,0,0,6,0,0,0,0,0,5,0x40,NetId1,Bump,0,0,0,0,8,0,0,0,0,0,5,0x40],
        //     //12.	检测12温度到达100开始计时半小时，时间到20切换到6号口
        //     [TcpControlMessage,NetId2,Valve,0,6,0x40],
        //     //13.	15二号口快速吸取原料液吸到2400，17二号口快速吸取原料液吸到2400
        //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,0,2,4,0,0,2,0x40,NetId2,Bump,1,1,0,0,0,0,2,4,0,0,2,0x40],
        //     //14.	15六号口快速排出,17六号口快速排出
        //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //15.	15二号口快速吸取原料液，吸满24000；17二号口快速吸取原料液，吸满24000
        //     [TcpControlMessage,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,2,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,2,0x40],
        //     //16.	15五号口以速度15排出；17五号口以速度15排出
        //     [TcpControlMessage,NetId2,Bump,0,0,0,1,5,0,0,0,0,0,5,0x40,NetId2,Bump,1,0,0,1,5,0,0,0,0,0,5,0x40]
        // ];
        this.expInfo.dataHistory.pressure.time = [];
        this.expInfo.dataHistory.pressure.data1 = [];
        this.expInfo.dataHistory.pressure.data2 = [];
        this.expInfo.dataHistory.tempreture.time = [];
        this.expInfo.dataHistory.tempreture.data1 = [];
        this.expInfo.dataHistory.tempreture.data2 = [];
        this.expInfo.dataHistory.tempreture.data3 = [];
        this.expInfo.dataHistory.tempreture.data4 = [];
        // this.expInfo.cleanProc = [
        //     //0.关闭加热
        //     [TcpStopMessage,NetId1,Tmp,0,0x40,NetId1,Tmp,1,0x40],
        //     //1.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //2.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //3.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //4.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //5.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //6.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //7.泵1泵2泵3泵4泵5泵6 六号口快速排出试剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,6,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,6,0x40],
        //     //8.泵1泵2泵3泵4泵5泵6 三号口快速吸取清洗剂
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,3,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,3,0x40],
        //     //9. 7切换到6号口；20切换到2号口
        //     [TcpControlMessage,NetId0,Valve,0,6,0x40,NetId2,Valve,0,2,0x40],
        //     //10. 泵1泵2五号口以速度30排出。
        //     [TcpControlMessage,NetId0,Bump,0,0,0,3,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,0,0,3,0,0,0,0,0,0,5,0x40],
        //     //11. 泵3泵4泵5泵6五号口以速度80排出。
        //     [TcpControlMessage,NetId1,Bump,0,0,0,8,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,0,0,8,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,0,0,8,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,0,0,8,0,0,0,0,0,0,5,0x40],
        //     //12. 泵1泵2泵3泵4泵5泵6 一号口快速吸取空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40],
        //     //13. 泵1泵2泵3泵4泵5泵6 五号口快速排出空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40],
        //     //12. 泵1泵2泵3泵4泵5泵6 一号口快速吸取空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId0,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId1,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,0,1,0,0,0,2,4,0,0,0,1,0x40,NetId2,Bump,1,1,0,0,0,2,4,0,0,0,1,0x40],
        //     //13. 泵1泵2泵3泵4泵5泵6 五号口快速排出空气
        //     [TcpControlMessage,NetId0,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId0,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId1,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,0,1,0,0,0,0,0,0,0,0,5,0x40,NetId2,Bump,1,1,0,0,0,0,0,0,0,0,5,0x40]
        // ];
        
        // this.topology.bottles[2] = ["waste"];
        // this.topology.bottles[8] = ["waste"];
        // this.topology.bottles[11] = ["waste"];
        // this.topology.bottles[7] = ["水相"];
        // this.topology.bottles[9] = ["有机相"];
        // this.topology.bottles[12] = ["地西泮"];
        // this.topology.chips[0] = [0.125];
    },

    InitRtdataBySettingdata:function(){
        var bottleClass1id = [0,1,3,4,5,6,10];
        for(var i=0; i<bottleClass1id.length; i++ )
        {
            // this.topology.bottles[bottleClass1id[i]] = [
            //     //realtimedata,["Reagent"，蓝瓶试剂当前含量ml，"绿瓶试剂名称"，绿瓶试剂当前含量ml，"红瓶试剂名称"，红瓶瓶试剂当前含量ml]
            //     ["Reagent",50,"Cleaning",50,"红瓶试剂名称",0],
            //     //settings,["蓝瓶设置的试剂名称"，蓝瓶设置的试剂含量ml，"绿瓶设置的试剂名称"，绿瓶设置的试剂含量ml，"红瓶设置的试剂名称"，红瓶设置的试剂含量ml]
            //     ["Reagent",50,"Cleaning",50,"红瓶试剂名称",0],
            //     //三个瓶子含量的阈值，[蓝瓶低阈值num(ml),蓝瓶高阈值num(ml),绿瓶低阈值num(ml),绿瓶高阈值num(ml)，红瓶低阈值num(ml),红瓶高阈值num(ml)]
            //     [1,10,2,10,3,10],
            //     //state,[蓝瓶状态num,绿瓶状态num,红瓶状态num]，1则当前在设置的阈值内，0则当前含量低于设置的小阈值，1则当前含量高于设置的大阈值
            //     [1,1,1]
            // ];            
            this.topology.bottles[bottleClass1id[i]][0] = this.topology.bottles[bottleClass1id[i]][1];
        }
        
        // for(var i=0; i<7; i++)
        // {
        //     this.topology.pumps[i] = [
        //         //realtime data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num当前位置, num完成进度（0~100）]
        //         [0,0,"吸取",0,0],
        //         //setting data [num流速（ul/min),num通道（1~6）,str状态(吸取，注射),num目标位置(0~24000)]
        //         [0,0,"吸取",0],
        //         //state[num状态] 0停止，1正常工作，2初始化，3错误
        //         [0]
        //     ];
        // }
        
        this.topology.chips[1] = [
            //realtime data [num芯片1当前温度（摄氏度），num芯片1当前目标温度（摄氏度）,num芯片1当前加热速度（1~10档），num芯片2当前温度（摄氏度），，num芯片2当前目标温度（摄氏度）,num芯片2当前加热速度（1~10档）]
            [30,100,1,30,100,1],
            //setting data [num芯片容量（ml),num芯片1目标温度（摄氏度），num芯片1加热速度（1~10档），num芯片2目标温度（摄氏度），num芯片2加热速度（1~10档），警报阈值温度上限（摄氏度）]
            [3.4,100,1,100,1,180],
            //state [ num1状态，num2警报状态] num1=0静止，=1加热； num2=0非阈值警报，=1阈值警报
            [0,0]
        ];
        this.topology.chips[2] = [
            //realtime data [num芯片1当前温度（摄氏度），num芯片1当前目标温度（摄氏度）,num芯片1当前加热速度（1~10档），num芯片2当前温度（摄氏度），，num芯片2当前目标温度（摄氏度）,num芯片2当前加热速度（1~10档）]
            [30,100,1,30,100,1],
            //setting data [num芯片容量（ml),num芯片1目标温度（摄氏度），num芯片1加热速度（1~10档），num芯片2目标温度（摄氏度），num芯片2加热速度（1~10档），警报阈值温度上限（摄氏度）]
            [3.4,100,1,100,1,180],
            //state [ num1状态，num2警报状态] num1=0静止，=1加热； num2=0非阈值警报，=1阈值警报
            [0,0]
        ];
        this.topology.pressuSensors[0] = [
            //realtime data [num压力值（mabr)]
            [0],
            //setting data [num阈值压力值（mabr)]
            [10000],
            //state [num1状态，num2压力阈值状态] num1=0停止，=1正常工作 =2初始化， =3错误； num2=0未超过阈值，num2=1阈值警报
            [0,0]
        ];
        this.topology.pressuSensors[1] = [
            //realtime data [num压力值（mabr)]
            [0],
            //setting data [num阈值压力值（mabr)]
            [10000],
            //state [num1状态，num2压力阈值状态] num1=0停止，=1正常工作 =2初始化， =3错误； num2=0未超过阈值，num2=1阈值警报
            [0,0]
        ];
        for(var i=0; i<3; i++)
        {
            this.topology.switchingValves[i] = [
                //realtime channel [num当前输出通道（1~6）]
                [1],
                //setting channel [num设置的输出通道（1~6）]
                [1],
                //state [num状态] =0异常 =1正常
                [1],
            ];
        }
    }
}


module.exports = dataAll;
    
