// xy:
// 本文件定义web前端界面需要显示的数据

// 引入后端所维护的核心数据对象
var dataAll  = require('../data/dataAll.js');

// processingPage所需的数据
// 使用多级结构对象，每个对象的id与前端设置ChemElemx中的'x'对应
// 对象的参数数据顺序与前端jade文件的ChemElemx_Valy中的'y'顺序对应，便于维护
var dataToProcessingPage = {
    //标志本对象的type, 前端会根据不同的type对数据进行不同的处理
    MsgType: 1,
    FuncType:1,
    BackCurrentState:0,
    // 当前拓扑中所有元素的总个数，更新拓扑后需要手动维护（或者查查js如何多级对象的对象个数，来不及了我就先手动设定了....
    TotalElemNum: 29,

    // Elem1 & Elem2 & Elem6 & Elem8 & Elem11 & Elem16 & Elem18 & Elem19 & Elem21 & Elem22 & Elem25 & Elem28 & Elem29
    Bottles:{
        ElemNum: 13,    //总共有几个Bottle 暂时需要手动维护              
        bottle1:{
            id: "ChemElem1",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"Cleaning",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"Waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle2:{
            id: "ChemElem2",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"Cleaning",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle3:{
            id: "ChemElem6",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
        bottle4:{
            id: "ChemElem8",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"Cleaning",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle5:{
            id: "ChemElem11",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"绿瓶试剂名称",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle6:{
            id: "ChemElem16",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"Cleaning",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle7:{
            id: "ChemElem18",
            ValNum: 6, //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"绿瓶试剂名称",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle8:{
            id: "ChemElem19",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
        bottle9:{
            id: "ChemElem21",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
        bottle10:{
            id: "ChemElem22",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
        bottle11:{
            id: "ChemElem25",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"Reagent",
            Val2: 0,    //蓝瓶试剂含量，单位ml
            Val3:"Cleaning",
            Val4: 0,    //蓝瓶试剂含量，单位ml
            Val5:"waste",
            Val6: 0    //蓝瓶试剂含量，单位ml
        },
        bottle12:{
            id: "ChemElem28",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
        bottle13:{
            id: "ChemElem29",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:"试剂名称"
        },
    },

    Pumps:{
        ElemNum : 7,
        pump1:{
            id:"ChemElem3",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump2:{
            id:"ChemElem4",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump3:{
            id:"ChemElem9",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump4:{
            id:"ChemElem10",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump5:{
            id:"ChemElem24",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump6:{
            id:"ChemElem15",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        },
        pump7:{
            id:"ChemElem17",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        }
    },

    chips:{
        ElemNum:3,
        chip1:{
            id:"ChemElem5",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0.125    // 芯片容量，unit:ml
        },
        chip2:{
            id:"ChemElem12",
            ValNum: 8,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 3.4,    // 芯片组总容量，unit:ml
            Val2: 30,   //芯片1当前温度 unit: 摄氏度
            Val3: 5,    //芯片1加热速度，共10档，第1档最慢，第10档最快
            Val4: 30,   //芯片2当前温度 unit: 摄氏度
            Val5: 5,    //芯片2加热速度，共10档，第1档最慢，第10档最快
            Val6: 150,   //阈值警报温度，单位摄氏度
            Val7: 100,   //芯片1设置温度 unit: 摄氏度
            Val8: 100   //芯片2设置温度 unit: 摄氏度
        },
        chip3:{
            id:"ChemElem23",
            ValNum: 8,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 3.4,    // 芯片组总容量，unit:ml
            Val2: 30,   //芯片1当前温度 unit: 摄氏度
            Val3: 5,    //芯片1加热速度，共10档，第1档最慢，第10档最快
            Val4: 30,   //芯片2当前温度 unit: 摄氏度
            Val5: 5,    //芯片2加热速度，共10档，第1档最慢，第10档最快
            Val6: 150,   //阈值警报温度，单位摄氏度
            Val7: 100,   //芯片1设置温度 unit: 摄氏度
            Val8: 100   //芯片2设置温度 unit: 摄氏度
        }
    },

    PressureSensors:{
        ElemNum:2,
        pressensor1:{
            id:"ChemElem13",
            ValNum: 2,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 69,    //当前压力值,单位mbar
            Val2: 7000   //阈值警报压力，单位mbar
        },
        pressensor2:{
            id:"ChemElem26",
            ValNum: 2,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 69,    //当前压力值,单位mbar
            Val2: 7000   //阈值警报压力，单位mbar
        }
    },

    SwitchingValves:{
        ElemNum:3,
        swvalve1:{
            id:"ChemElem7",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        },
        swvalve2:{
            id:"ChemElem20",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        },
        swvalve3:{
            id:"ChemElem27",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        }
    },

    PressTempChart:{
        Pressure:{
            time:[],    //数组,存储时间字符串
            pressure1:[],   //数组，存储sensor1压力
            pressure2:[]    //数组，存储sensor2压力
        },
    
        Tempreture:{
            time:[],    //数组,存储时间字符串
            tempreture1:[],   //芯片组1，芯片1 温度
            tempreture2:[],   //芯片组1，芯片2 温度
            tempreture3:[],   //芯片组2，芯片1 温度
            tempreture4:[]   //芯片组2，芯片2 温度
        },
    },

    ElectricalParameters:{
        ElemNum:3,
        busVoltage:{
            id:"voltage",
            ValNum: 0
        },
        busCurrent:{
            id:"current",
            ValNum: 0
        },
        systemPower:{
            id:"power",
            ValNum: 0
        }


    },

    UartText:"",

    Init:function(){
        this.BackCurrentState = 0;
        this.UartText="";
        this.PressTempChart.Pressure.time = [];
        this.PressTempChart.Pressure.pressure1 = [];
        this.PressTempChart.Pressure.pressure2 = [];
        this.PressTempChart.Tempreture.time = [];
        this.PressTempChart.Tempreture.tempreture1 = [];
        this.PressTempChart.Tempreture.tempreture2 = [];
        this.PressTempChart.Tempreture.tempreture3 = [];
        this.PressTempChart.Tempreture.tempreture4 = [];
        this.Bottles.bottle1 = {
            id: "ChemElem1",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[0][1][0],
            Val2:dataAll.topology.bottles[0][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[0][1][2],
            Val4:dataAll.topology.bottles[0][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[0][1][4],
            Val6:dataAll.topology.bottles[0][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle2 = {
            id: "ChemElem2",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[1][1][0],
            Val2:dataAll.topology.bottles[1][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[1][1][2],
            Val4:dataAll.topology.bottles[1][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[1][1][4],
            Val6:dataAll.topology.bottles[1][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle3 = {
            id: "ChemElem6",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[2][0][0]
        };
        this.Bottles.bottle4 = {
            id: "ChemElem8",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[3][1][0],
            Val2:dataAll.topology.bottles[3][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[3][1][2],
            Val4:dataAll.topology.bottles[3][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[3][1][4],
            Val6:dataAll.topology.bottles[3][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle5 = {
            id: "ChemElem11",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[4][1][0],
            Val2:dataAll.topology.bottles[4][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[4][1][2],
            Val4:dataAll.topology.bottles[4][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[4][1][4],
            Val6:dataAll.topology.bottles[4][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle6 = {
            id: "ChemElem16",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[5][1][0],
            Val2:dataAll.topology.bottles[5][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[5][1][2],
            Val4:dataAll.topology.bottles[5][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[5][1][4],
            Val6:dataAll.topology.bottles[5][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle7 = {
            id: "ChemElem18",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[6][1][0],
            Val2:dataAll.topology.bottles[6][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[6][1][2],
            Val4:dataAll.topology.bottles[6][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[6][1][4],
            Val6:dataAll.topology.bottles[6][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle8 = {
            id: "ChemElem19",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[7][0][0]
        };
        this.Bottles.bottle9 = {
            id: "ChemElem21",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[8][0][0]
        };
        this.Bottles.bottle10 = {
            id: "ChemElem22",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[9][0][0]
        };
        this.Bottles.bottle11 = {
            id: "ChemElem25",
            ValNum:6,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[10][1][0],
            Val2:dataAll.topology.bottles[10][1][1],//蓝瓶试剂含量，单位ml
            Val3:dataAll.topology.bottles[10][1][2],
            Val4:dataAll.topology.bottles[10][1][3],//蓝瓶试剂含量，单位ml
            Val5:dataAll.topology.bottles[10][1][4],
            Val6:dataAll.topology.bottles[10][1][5] //蓝瓶试剂含量，单位ml
        };
        this.Bottles.bottle12 = {
            id: "ChemElem28",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[11][0][0]
        };
        this.Bottles.bottle13 = {
            id: "ChemElem29",
            ValNum:1,   //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1:dataAll.topology.bottles[12][0][0]
        };

        this.Pumps.pump1 = {
            id:"ChemElem3",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump2 = {
            id:"ChemElem4",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump3 = {
            id:"ChemElem9",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump4 = {
            id:"ChemElem10",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump5 = {
            id:"ChemElem24",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump6 = {
            id:"ChemElem15",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };
        this.Pumps.pump7 = {
            id:"ChemElem17",
            ValNum: 4,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 0,    //流速，unit:ul/min
            Val2: 1,    //通道，1~6可选
            Val3:"状态", //吸取 or 注射 or stop
            Val4: 0     //完成进度，0~100表示
        };

        this.chips.chip1 = {
            id:"ChemElem5",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: dataAll.topology.chips[0][0][0]// 芯片容量，unit:ml    // 芯片容量，unit:ml
        };
        this.chips.chip2 = {
            id:"ChemElem12",
            ValNum: 8,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: dataAll.topology.chips[1][1][0],    // 芯片组总容量，unit:ml
            Val2: dataAll.topology.chips[1][0][0],   //芯片1当前温度 unit: 摄氏度
            Val3: dataAll.topology.chips[1][0][2],    //芯片1加热速度，共10档，第1档最慢，第10档最快
            Val4: dataAll.topology.chips[1][0][3],   //芯片2当前温度 unit: 摄氏度
            Val5: dataAll.topology.chips[1][0][5],    //芯片2加热速度，共10档，第1档最慢，第10档最快
            Val6: dataAll.topology.chips[1][1][5],   //阈值警报温度，单位摄氏度
            Val7: dataAll.topology.chips[1][0][1],   //芯片1设置温度 unit: 摄氏度
            Val8: dataAll.topology.chips[1][0][4]   //芯片2设置温度 unit: 摄氏度
        };
        this.chips.chip3 = {
            id:"ChemElem23",
            ValNum: 8,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: dataAll.topology.chips[2][1][0],    // 芯片组总容量，unit:ml
            Val2: dataAll.topology.chips[2][0][0],   //芯片1当前温度 unit: 摄氏度
            Val3: dataAll.topology.chips[2][0][2],    //芯片1加热速度，共10档，第1档最慢，第10档最快
            Val4: dataAll.topology.chips[2][0][3],   //芯片2当前温度 unit: 摄氏度
            Val5: dataAll.topology.chips[2][0][5],    //芯片2加热速度，共10档，第1档最慢，第10档最快
            Val6: dataAll.topology.chips[2][1][5],   //阈值警报温度，单位摄氏度
            Val7: dataAll.topology.chips[2][0][1],   //芯片1设置温度 unit: 摄氏度
            Val8: dataAll.topology.chips[2][0][4]   //芯片2设置温度 unit: 摄氏度
        };

        this.PressureSensors.pressensor1 = {
            id:"ChemElem13",
            ValNum: 2,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 69,    //当前压力值,单位mbar
            Val2: 7000   //阈值警报压力，单位mbar
        };
        this.PressureSensors.pressensor2 = {
            id:"ChemElem26",
            ValNum: 2,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 69,    //当前压力值,单位mbar
            Val2: 7000   //阈值警报压力，单位mbar
        };

        this.SwitchingValves.swvalve1 = {
            id:"ChemElem7",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        };
        this.SwitchingValves.swvalve2 = {
            id:"ChemElem20",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        };
        this.SwitchingValves.swvalve3 = {
            id:"ChemElem27",
            ValNum: 1,  //当前元素共有ValNum个数值元素,暂时需要手动维护
            Val1: 1    //输出通道，1~6可选
        };

    }

};



//resultPage所需的数据
var dataToResultPage={
    MsgType: 4,
    SysStatus:0,    //0代表系统暂无结果数据（未开始实验或者实验未完成），1代表已有结果数据

    Mode:"",        // 实验模式：自动模式 or 手动模式
    StartTime:"",
    StopTime:"",

    putu:"",        //谱图，使用base64编码字符串接收
    chanlv1: "",      //利多卡因产率
    chanlv2: "",      //地西泮产率

    //Topology数据没有用上也没有维护
    Topology:{
        TopologyPic:"",     //拓扑结构图，base64编码字符串
        Pumps:[
            //pump1
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },

            //pump2
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },

            //pump3
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },

            //pump4
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },
            
            //pump5
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },

            //pump6
            ["",0,""],
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // },

            //pump7
            ["",0,""]
            // {
            //     Val1:"",    //底物名称
            //     Val2:0, //流速，ul/min             
            //     Val3:"",    //状态
            // }
        ],
        Chips:[
            [0.125,"",""],
            // chip1:{
            //     Val1:0.125, //容量，ml               
            // },

            [3.4, "100,100","5,5"],
            // chip2:{
            //     Val1: 3.4,    // 芯片组总容量，unit:ml
            //     Val2: "100,100",   //芯片组1设置温度 unit: 摄氏度
            //     Val4: "5,5"    //芯片组1加热速度，共10档，第1档最慢，第10档最快             
            // },

            [3.4, "100,100","5,5"]
            // chip3:{
            //     Val1: 3.4,    // 芯片组总容量，unit:ml
            //     Val2: "100,100",   //芯片组2设置温度 unit: 摄氏度
            //     Val4: "5,5"    //芯片组2加热速度，共10档，第1档最慢，第10档最快
                
            // },
        ],
        SwValves:[
            [1],
            // swvalve1:{
            //     Val1:1      //输出通道
            // },

            [2],
            // swvalve2:{
            //     Val1:1      //输出通道
            // },

            [3]
            // swvalve3:{
            //     Val1:1      //输出通道
            // }
        ]
    },

    //自动模式配方，定死不需要维护
    pifang:[
        "泵1二号口快速吸取原料液吸到2400；泵2二号口快速吸取原料液吸到2400",
        "泵1六号口快速排出；泵2六号口快速排出",
        "切换阀1切换至六号口",
        "泵1二号口快速吸取原料液，吸满24000；泵2二号口快速吸取原料液，吸满24000",
        "泵1五号口缓慢排出；泵2五号口缓慢排出",
        "切换阀1切换至二号口",
        "泵3二号口快速吸取原料液吸到2400；泵4二号口快速吸取原料液吸到2400",
        "泵3六号口快速排出；泵4六号口快速排出",
        "泵3二号口快速吸取原料液，吸满24000；泵4二号口快速吸取原料液，吸满24000",
        "加热芯片组1缓慢加热至100°C",
        "切换阀2切换至二号口",
        "泵3五号口缓慢排出；泵4五号口缓慢排出",
        "切换阀2切换至六号口",
        "泵6二号口快速吸取原料液吸到2400；泵7二号口快速吸取原料液吸到2400",
        "泵6六号口快速排出；泵7六号口快速排出",
        "泵6二号口快速吸取原料液，吸满24000；泵7二号口快速吸取原料液，吸满24000",
        "泵6五号口缓慢排出；泵7五号口缓慢排出"

    ],

    Pressure:{
        time:[],    //数组,存储时间字符串
        pressure1:[],   //数组，存储sensor1压力
        pressure2:[]    //数组，存储sensor2压力
    },

    Tempreture:{
        time:[],    //数组,存储时间字符串
        tempreture1:[],   //芯片组1，芯片1 温度
        tempreture2:[],   //芯片组1，芯片2 温度
        tempreture3:[],   //芯片组2，芯片1 温度
        tempreture4:[]   //芯片组2，芯片2 温度
    },

    ManuSet:{
        time:[],    //数组,存储时间字符串
        settings:[],//数组，存储操作字符串
    },

    Init:function()
    {
        this.SysStatus = 0;
        this.Mode = "";
        this.StartTime = "";
        this.StopTime = "";
        this.chanlv1 = "";
        this.chanlv2 = "";
        this.Pressure.time = [];
        this.Pressure.pressure1 = [];
        this.Pressure.pressure2 = [];
        this.Tempreture.time = [];
        this.Tempreture.tempreture1 = [];
        this.Tempreture.tempreture2 = [];
        this.Tempreture.tempreture3 = [];
        this.Tempreture.tempreture4 = [];
        this.ManuSet.time = [];
        this.ManuSet.settings = [];

    }
};

module.exports = {
    dataToProcessingPage,
    dataToResultPage,
};

