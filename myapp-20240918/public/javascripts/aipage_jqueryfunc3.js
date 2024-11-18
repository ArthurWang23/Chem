//-------------------------------------------------------

// const { data } = require("vis-network");

// 标志位
var Smiles_checked = false;    // 标示查询的SMILES是否在数据库中存在
var Excel_checked = false;      //标示EXCEL是否已正确导入

//canvas相关
var canvas_aiimg;
var ctx_aiimg;


//excel.js数据对象参考： https://zhuanlan.zhihu.com/p/95984128
//excel 读取相关全局变量
var fileInput;
var file ;
var reader = new FileReader();
var workbook;  //xsls.js 的重要object，看前端调试台就明白了
var worksheet;  //xsls.js 的重要object，看前端调试台就明白了
var Excel2Json;
var ExcelCount; //记录excel有多少行种药物
var startRow;   //记录excel起始行
var endRow;     //记录excel结束行
var imageContainer = document.getElementById('imageContainer');
//-------------------------------------------------------


//************************************************************************************************************************* */
//xy: jQuery 在文档加载后激活函数：
$(document).ready(function () {
  canvas_aiimg = document.getElementById('imageContainer');
  ctx_aiimg = canvas_aiimg.getContext("2d");
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

//tooltip 弹出提示框
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl)
})

// 上传excel文件后的数据操作
function readExcelFile()
{
  fileInput = document.getElementById('excelFile');  
  file = fileInput.files[0];    
  
  reader.onload = function(event) {  
    workbook = XLSX.read(event.target.result, {type: 'binary'}); 
    console.log("workbook:",workbook) ;
    worksheet = workbook.Sheets[workbook.SheetNames[0]];  
    console.log("worksheet:",worksheet) ;
    Excel2Json = XLSX.utils.sheet_to_json(worksheet);  
    // 获取工作表的引用范围  
    const range = worksheet['!ref'];  
    // 引用范围不存在 报错
    if(!range)  
    {
      $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
        title: '加载失败',
        content: '请检查需要加载的网络JSON文件或数据库xslx文件，确保其格式正确并非空',
        type:'red',
      });
      Excel_checked = false;
      return;
    }
    // 如果引用范围存在，则解析为行列索引范围  
    function getNumRows(rangeStr) {  
      // 解析范围字符串，例如 'B1:E69'  
      startRow = parseInt(rangeStr.split(':')[0].replace(/[A-Z]/, ''));  
      endRow = parseInt(rangeStr.split(':')[1].replace(/[A-Z]/, ''));  
      // 返回行数  
      return endRow - startRow + 1;  
    } 
    //获取excel中有多少种药物 
    ExcelCount = getNumRows(range) - 1;  //去除表头的那一行
    console.log("Medicine Count::",ExcelCount) ;
    var dialogContent = `数据库共有${ExcelCount}种药物`;
    $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
      title: '加载成功',
      content: dialogContent,
      type:'green',
    });
    Excel_checked = true;
  };  
  
  reader.readAsBinaryString(file);  

}


// 监听按钮点击事件，当按钮被点击后，检测是否导入了excel且找到了输入的smiles，则显示进度条，接着显示对应的逆反应框图
function StartProcess()
{
  //判断excel是否已导入
  if(Excel_checked == false)
  {
    $.dialog({ //xy:使用jquery-confirm 的dialog弹窗弹出消息
      title: '提示',
      content: '尚未检测到网络json文件或数据库excel文件，请点击右侧按钮导入文件',
      type:'red',
    });
    return;
  }
  // canvas隐藏
  canvas_aiimg.style.display = 'none';
  //标志位清除
  Smiles_checked = false; 
  // 读取输入的smiles
  var smiles = $("#inputSmiles").val();
  console.log("输入的SMILES为:"+smiles);
  var row_current = 0; 
  //遍历excel的smiles与输入的smiles比较
  for(var i = startRow+1; i<=endRow; i++)
  {
    //使用模板字符串 
    var Excel_C = `C${i}`;
    const cell = worksheet[Excel_C];
    // 读取单元格的文本内容  
    const cellValue = cell ? cell.v : null; // 如果单元格对象存在，则获取其文本内容，否则为null 

    //比较输入的smiles和当前cell的value是否一致
    if(cellValue == smiles)
    {
      row_current = i;
      console.log('数据库查询到匹配的SMILES!,在数据库的第'+row_current+'行');
      //设置标志位
      Smiles_checked = true; 
    }
    //未查询到与输入一致的smiles
    else if(i == endRow && Smiles_checked == false)
    {
      //设置标志位
      Smiles_checked = false;
      $.dialog({ //xy:使用c的dialog弹窗弹出消息
        title: '逆合成失败',
        content: '当前化合物尚未录入逆合成数据库！',
        type:'red',
      });
    }
  }

  // 标志位正确，执行进度条和图片显示
  if(Smiles_checked)
  {
    // 进度条显示
    var progress = $("#Progress")
    var progressBar = $("#ProgressBar");
    var progressPercentage = $("#ProgressPercentage"); 
    // 显示progress
    progress.css({display:'flex'})
    // 生成2秒到4秒之间的随机时长
    var duration_ms = Math.floor(Math.random() * (3000 - 1000)) + 1000;  //ms为单位
    var duration = duration_ms/1000;
    var step = Math.floor(100 / duration);
    var targetWidth = 100;
    
    // // 使用jquery的animate函数，将进度条均匀的增加到100%
    // var animate = setInterval(function() {  
    //   var currentWidth = progressBar.width();    
    //   // var percentage = Math.round((targetWidth - currentWidth) / duration * 100);  
    //   var percentage = Math.round(currentWidth / targetWidth * 100); 
    //   progressPercentage.text(percentage + "%");  
    //   // progressBar.animate({width: currentWidth + (targetWidth - currentWidth) / duration},10);
    //   var widthAfterStep = currentWidth + step > 100 ? 100 : currentWidth + step;
    //   progressBar.animate({width: widthAfterStep},120); 
    //   // 进度条绘制结束 
    //   if (currentWidth >= targetWidth) {  
    //     clearInterval(animate);  
    //     progress.css({display: 'none'}); 
    //     // 绘制canvas
    //     canvas_aiimg.style.display = 'block';
    //     var img_path = `/images/AI_analysis_img/${row_current}.jpg`;
    //     var AI_Analysis_img = new Image();  
    //     AI_Analysis_img.onload = function() {        
    //       ctx_aiimg.drawImage(AI_Analysis_img, 0, 0, canvas_aiimg.width, canvas_aiimg.height);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
    //     };  
    //     AI_Analysis_img.src = img_path;
    //   }  
    // }, duration); // 每10毫秒更新一次进度 

    // 绘制canvas
    canvas_aiimg.style.display = 'block';
    var img_path = `/images/AI_analysis_img/${row_current}.jpg`;
    var AI_Analysis_img = new Image();  
    AI_Analysis_img.onload = function() {        
      ctx_aiimg.drawImage(AI_Analysis_img, 0, 0, canvas_aiimg.width, canvas_aiimg.height);  // 在canvas上绘制图像，前两个参数是图像的左上角位置，后两个参数是图像的宽度和高度
    };  
    AI_Analysis_img.src = img_path;
    var btn = document.getElementById('TuopuAnalysisBtn');
    btn.style.display = "block";
  }   
}
//----------------------------------------------------hl-----------------------------------------------------------------
// var ketcher = newketcher()
var nodes = [];
var edges = [];
var network = null;
var clickedNode=null
// var ketcher1
var nodeoriginalnumber
var ws_ai = new WebSocket("ws://localhost:3004");  //需与逆合成服务器中设置的PORT相同才能建立websocket连接
var tag="Templete"
var condition='with conditions'
var topk=10

ws_ai.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket with ai opening...");
  //ws_ai.send("SMILES is coming");
}
//处理接收到的信息
ws_ai.onmessage = async function (evt) {
  var result = JSON.parse(evt.data);
  console.log("received from AI:" , result);
  var flag=result.flag
  var serve=result.serve
  switch (serve) {
    case "single":
        if (flag===1){
          response1(result)
        }else{
          response2(result,nodes,edges)
        }
        break;
    case "multi":
        console.log('......resilt',result)
        if (flag===1){
          response3(result)
        }else{
          response2(result,nodes,edges)
        }
        break;
    // 添加其他消息类型的处理逻辑
    default:
        console.log('Received unknown message type from client:', data);
        break;
} 




 

};  

ws_ai.onerror = function(evt){
  console.log("websocket error:" + evt.error);
};

ws_ai.onclose = function () {
  // 关闭 websocket
  console.log("连接ai已关闭...");
};



//监听按钮点击事件，当按钮被点击后，将输入的smiles式发送到逆合成服务器
// document.addEventListener('DOMContentLoaded', function () {
// var toggleButton = document.getElementById('StartProgressBtn');
// toggleButton.addEventListener('click', async function
function StartProcess_1(){ 
var smiles = $("#inputSmiles").val();
var smiles_json = JSON.stringify({smile:smiles, tag:tag, topk:topk,condition:condition,flag:1,serve:'single'});
console.log(smiles_json)
ws_ai.send(smiles_json);
ketcher=newketcher()
}

function StartProcess_2(){ 
  var smiles = $("#inputSmiles2").val();
  var smiles_json = JSON.stringify({smile:smiles, tag:tag, topk:topk,condition:condition,flag:1,serve:'multi'});
  console.log(smiles_json)
  ws_ai.send(smiles_json);
  ketcher= newketcher_multi()
  }

document.addEventListener("DOMContentLoaded", function() {
  var radios = document.querySelectorAll('input[name="exampleRadios"]');
  radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
          if(this.checked) {
              tag = document.querySelector('label[for="' + this.id + '"]').innerText;
              console.log("Selected option: " + tag); 
             // 这里可以执行您希望的操作，例如将所选选项的内容显示在页面上
          }
      });
  });
  console.log("Selected option: " + tag);
});

document.addEventListener("DOMContentLoaded", function() {
  var radios = document.querySelectorAll('input[name="exampleRadios1"]');
  radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
          if(this.checked) {
              condition = document.querySelector('label[for="' + this.id + '"]').innerText;
              console.log("Selected option: " + condition); 
             // 这里可以执行您希望的操作，例如将所选选项的内容显示在页面上
          }
      });
  });
  console.log("Selected option: " + condition);
});

document.addEventListener("DOMContentLoaded", function() {
  var input = document.getElementById('topinput');

  input.addEventListener('input', function() {
      topk = input.value;
      console.log("Input value: " + topk);
      // 这里可以执行您希望的操作，例如根据输入内容进行其他操作
  });

  console.log("Input value: " + topk);
});

//---------------------------------hl设置network---------------------------------------
async function response1(result){
  var ketchercontainer = document.getElementById('ketchercontainer');
  ketchercontainer.style.display = 'none';
  var reactants=result.reactants
  console.log(reactants+';;;;')
  var smiles = $("#inputSmiles").val();
  var data1= await getchildrendata(smiles,reactants,result)
  var rootImage = data1[0]
  // const svgContainer = document.getElementById('selected_molecule_view');
  // svgContainer.innerHTML = `<img src="${rootImage}" alt="SVG Image" Image" width="50" height="50" viewBox>`;
  var childrenData = data1[1]
  console.log(childrenData)
  var netdata=generateHierarchicalData(rootImage, childrenData)
  // create a network
  console.log(";;;;",netdata)
  nodes = new vis.DataSet(netdata[0])
  console.log("mm",nodes)
  edges = new vis.DataSet(netdata[1])
  var data = {
    nodes: nodes,
    edges: edges
  };
  var imageContainer = document.getElementById('imageContainer1'); 
  imageContainer.style.display = 'flex';
  imageContainer.style.marginTop = '50px';
  imageContainer.style.marginleft = '0px';
  // imageContainer.style.width = '1100px';
  imageContainer.style.height = '600px';
  var options = {
    nodes:{mass:1,
    // value:40,
      // scaling: {
      // min: 10,
      // max: 30,},
    },
    edges: {
      color: "gray",
      width:2
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: "UD", // Up-Down layout
        sortMethod: "directed",
        // levelSeparation: 100, // 层级之间的距离
        nodeSpacing: 200, // 节点之间的距离
        shakeTowards:'roots'
      },
    },
    physics: {
      repulsion: {
        centralGravity: 0.2, // 中心引力
        springLength: 300,   // 弹簧长度
        springConstant: 0.05, // 弹簧常数
        nodeDistance: 300,    // 节点间距
        damping: 0.1        // 阻尼
      }
    }
  //   physics: {
  //     enabled: true,
  //     hierarchicalRepulsion: {
  //       nodeDistance: 100 // Adjust the minimum distance between nodes to prevent overlap
  //     },
  //     stabilization: {
  //       enabled: true,
  //       iterations: 2000 // Increase the number of iterations for stabilization
  //     }
  //   }
  };

  network = new vis.Network(imageContainer, data, options);
  createtable()
  document.getElementById("table1").style.display = "block";
  nodeoriginalnumber=nodes.length
  network.on("click",async function (params) {
    // 如果点击了节点
    if (params.nodes.length > 0) {
      var nodeId = params.nodes[0];
      console.log(nodeId)
      if (network.isCluster(nodeId) == true) {
                // 调用 openCluster 方法展开聚类节点
                network.openCluster(nodeId);
      }else{
      if (nodeId !== undefined) {
        clickedNode = nodes.get(nodeId); // 使用节点 ID 获取节点的详细信息
        console.log('Clicked Node:', clickedNode);
        
        // 检查面板是否已存在
        if(panelClosed){
          // await createPanel()
          panelClosed =false
        }
        var ketcherFrame1 =  document.getElementById('ketcherframe1')
        ketcher1 = await ketcherFrame1.contentWindow.ketcher;
        var element = document.querySelector('b[data-v-f309917d]')
        
        console.log(',,,,',ketcher1)
        
        if ((clickedNode.title)[0]==='1'){
          // var connectedNodes = network.getConnectedNodes(nodeId)
          // p=nodes.get(connectedNodes[0]).label
          var react=(clickedNode.title)[2]
          console.log("Nodes directly connected to node " ,react);
          ketcher1.setMolecule(react)
          element.textContent=clickedNode.label+'\n'+react
          if (condition=='with conditions'){
            
            var tbody = document.getElementById('tbody1')
            tbody.innerHTML = '';
            var pre_condition=(clickedNode.title)[5]

            Object.entries(pre_condition).forEach(function([key, value], index) {
              var row = document.createElement('tr');
              var item = value.slice(0,-1)
              var score= value.slice(-1)
              row.innerHTML = `
              <td scope="row" class="editable" style="padding: 8px; cursor: pointer;">${key}</td> 
              <td class="editable" style="padding: 8px; cursor: pointer;">${item}</td>
              <td class="editable" style="padding: 8px; cursor: pointer;">${score}</td>
              `;
              tbody.appendChild(row);
            })
            document.getElementById('condition-table').style.display='block'
          }          
        }else{
          document.getElementById('condition-table').style.display='none'
          ketcher1.setMolecule(clickedNode.label)
          element.textContent=clickedNode.label
        }
        document.getElementById("jsPanelContainer").style.display = "block";       
      }
    }
  }
})
}

async function response2(result,nodes,edges){
  // var nodesData = network.body.data.nodes.get();
  // var edgesData = network.body.data.edges.get();
  // console.log('//////////////',nodesData)
  // var numberOfNodes = nodesData.length;
  // var numberOfNodes=nodes.length
  var reactants=result.reactants
  var data= await getchildrendata1(clickedNode,reactants,result)
  var netdata=generateHierarchicalData1(clickedNode, data,nodeoriginalnumber)
  nodes.add(netdata[0]);
  console.log('//////////////',nodes)
  // 在数据集中添加从父节点到子节点的边
  edges.add(netdata[1]);
  createtable()
  
  // network.off('click')
  // 更新 vis-network
  // network=await network.setData({nodes:nodesData,edges:edgesData});
  // network.off("click")
  // await network.on("click", function (params) {
  //   // 如果点击了节点
  //   if (params.nodes.length > 0) {
  //     var nodeId = params.nodes[0];
  //     console.log(nodeId)
      
  //     if (network.isCluster(nodeId) == true) {
  //         // 调用 openCluster 方法展开聚类节点
  //         network.openCluster(nodeId);
  //     }else{
  //     if (nodeId !== undefined && nodeId !== null) {
  //       clickedNode = nodes.get(nodeId); // 使用节点 ID 获取节点的详细信息
  //       console.log('Clicked Node:', clickedNode);
  //       var element = document.querySelector('b[data-v-f309917d]')
  //       var Frame = document.getElementById('ketcherframe1');
  //       var ketcher1 = Frame.contentWindow.ketcher;
  //       element.textContent=clickedNode.label
  //       ketcher1.setMolecule(clickedNode.label)
  //       document.getElementById("jsPanelContainer").style.display = "block";
  //     }}

  //   }
  // }) 
}

async function response3(result){
  var ketchercontainer = document.getElementById('multiketchercontainer');
  ketchercontainer.style.display = 'none';
  var data=await multi_reaction(result)
  console.log(";;;;",data)
  nodes = new vis.DataSet(data[0])
  edges = new vis.DataSet(data[1])
  var data1 = {
    nodes: nodes,
    edges: edges
  };
  var imageContainer = document.getElementById('imageContainer1'); 
  imageContainer.style.display = 'flex';
  imageContainer.style.marginTop = '50px';
  imageContainer.style.marginleft = '0px';
  // imageContainer.style.width = '1100px';
  imageContainer.style.height = '600px';
  var options = {
    nodes:{mass:1,
    // value:40,
      // scaling: {
      // min: 10,
      // max: 30,},
    },
    edges: {
      color: "gray",
      width:2
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: "UD", // Up-Down layout
        sortMethod: "directed",
        // levelSeparation: 100, // 层级之间的距离
        nodeSpacing: 200, // 节点之间的距离
        shakeTowards:'roots'
      },
    },
    physics: {
      repulsion: {
        centralGravity: 0.2, // 中心引力
        springLength: 120,   // 弹簧长度
        springConstant: 0.05, // 弹簧常数
        nodeDistance: 300,    // 节点间距
        damping: 0.1        // 阻尼
      }
    }
    // physics: {
    //   enabled: true,
    //   hierarchicalRepulsion: {
    //     nodeDistance: 100 // Adjust the minimum distance between nodes to prevent overlap
    //   },
    //   stabilization: {
    //     enabled: true,
    //     iterations: 2000 // Increase the number of iterations for stabilization
    //   }
    // }
  };

  network = new vis.Network(imageContainer, data1, options);
  createtable()
  document.getElementById("table1").style.display = "block";
  nodeoriginalnumber=nodes.length
  network.on("click",async function (params) {
    // 如果点击了节点
    if (params.nodes.length > 0) {
      var nodeId = params.nodes[0];
      console.log(nodeId)
      if (network.isCluster(nodeId) == true) {
                // 调用 openCluster 方法展开聚类节点
                network.openCluster(nodeId);
      }else{
      if (nodeId !== undefined) {
        clickedNode = nodes.get(nodeId); // 使用节点 ID 获取节点的详细信息
        console.log('Clicked Node:', clickedNode);
        
        // 检查面板是否已存在
        if(panelClosed){
          // await createPanel()
          panelClosed =false
        }
        var ketcherFrame1 =  document.getElementById('ketcherframe1')
        ketcher1 = await ketcherFrame1.contentWindow.ketcher;
        var element = document.querySelector('b[data-v-f309917d]')
        
        console.log(',,,,',ketcher1)
        
        if ((clickedNode.title)[0]==='1'){
          // var connectedNodes = network.getConnectedNodes(nodeId)
          // p=nodes.get(connectedNodes[0]).label
          var react=(clickedNode.title)[2]
          console.log("Nodes directly connected to node " ,react);
          ketcher1.setMolecule(react)
          element.textContent=clickedNode.label+'\n'+react
          if (condition=='with conditions'){
            
            var tbody = document.getElementById('tbody1')
            tbody.innerHTML = '';
            var pre_condition=(clickedNode.title)[5]

            Object.entries(pre_condition).forEach(function([key, value], index) {
              var row = document.createElement('tr');
              var item = value.slice(0,-1)
              var score= value.slice(-1)
              row.innerHTML = `
              <td scope="row" class="editable" style="padding: 8px; cursor: pointer;">${key}</td> 
              <td class="editable" style="padding: 8px; cursor: pointer;">${item}</td>
              <td class="editable" style="padding: 8px; cursor: pointer;">${score}</td>
              `;
              tbody.appendChild(row);
            })
            document.getElementById('condition-table').style.display='block'
          }          
        }else{
          document.getElementById('condition-table').style.display='none'
          ketcher1.setMolecule(clickedNode.label)
          element.textContent=clickedNode.label
        }
        document.getElementById("jsPanelContainer").style.display = "block";       
      }
    }
  }
})
}

async function getsvg(smi){
  // var ketcher = await newketcher()
  await ketcher.setMolecule(smi)
  await new Promise(resolve => setTimeout(resolve, 80));
  var inchI = await ketcher.getInchi()
  var smi1 = await ketcher.getSmiles()
  console.log('ppppppppp',smi1)
  var imageBlob = await ketcher.generateImage(smi1,{outputFormat: "svg",//backgroundColor:'rgb(255, 255, 255)
    bondThickness: '2'});
  // img= await imageBlob.text()
  // 创建一个 URL 对象
  var imageUrl = URL.createObjectURL(imageBlob);
  
  // const imageElement = document.createElement("img");
  // imageElement.width = 30 ;  // Replace with your desired width
  // imageElement.height = 30;
  // // // // imageElement.style.backgroundColor='white' 
  // // // // imageElement.style.border = "2px solid blue"; // 设置图片边框样式
  // // // //  Replace with your desired height
  // imageElement.src = URL.createObjectURL(imageBlob);
  // console.log('mmmmmmmmmmm',imageElement)
  // imageurl = URL.createObjectURL(imageBlob);
  console.log('?????????',[smi ,imageUrl, inchI])
  return [imageUrl, inchI]
}

async function getchildrendata(product,reactants,result){
  var rImage= await getsvg(product)
  var cdata=[]
  for (let index = 0; index < reactants.length; index++) {
    var gchild=[]
    if (reactants[index].includes('.')) {
      const splitItems = reactants[index].split('.');
      for (let i = 0; i < splitItems.length; i++) {
        console.log('jjjjj',splitItems)
        const img = await getsvg(splitItems[i]);
        gchild.push({image:img[0],smi:splitItems[i],title:img[1]})
      }
      if ('condition' in result){
        cdata.push({label:index, grandchildren:gchild,react:[product+'>>'+reactants[index],result.scores[index],result.template[index],result.condition[index]]})
      }else{
        cdata.push({label:index, grandchildren:gchild,react:[product+'>>'+reactants[index],result.scores[index],result.template[index]]})
      } 
    } else {
      const img = await getsvg(reactants[index])
      gchild.push({image:img[0],smi:reactants[index],title:img[1]})
      if ('condition' in result){
        cdata.push({label:index, grandchildren:gchild,react:[product+'>>'+reactants[index],result.scores[index],result.template[index],result.condition[index]]})//label是节点信息，即路线排名号，grandchildrens是子节点，即具体的路线反应物
      }else{
        cdata.push({label:index, grandchildren:gchild,react:[product+'>>'+reactants[index],result.scores[index],result.template[index],]})
      }
    }
  }
  return [rImage,cdata]
}

async function getchildrendata1(clickedNode,reactants,result){
  // var rImage= await getsvg(product)
  var cdata=[]
  for (let index = 0; index < reactants.length; index++) {
    var gchild=[]
    if (reactants[index].includes('.')) {
      const splitItems = reactants[index].split('.');
      for (let i = 0; i < splitItems.length; i++) {
        const img = await getsvg(splitItems[i]);
        gchild.push({image:img[0],smi:splitItems[i],title:img[1]})
      }
      if ('condition' in result){
        cdata.push({label:index, grandchildren:gchild,react:[clickedNode.label+'>>'+reactants[index],result.scores[index],result.template[index],result.condition[index]]})
      }else{
        cdata.push({label:index, grandchildren:gchild,react:[clickedNode.label+'>>'+reactants[index],result.scores[index],result.template[index],]})
      }
    } else {
      const img = await getsvg(reactants[index])
      gchild.push({image:img[0],smi:reactants[index],title:img[1]})
      if ('condition' in result){
        cdata.push({label:index, grandchildren:gchild,react:[clickedNode.label+'>>'+reactants[index],result.scores[index],result.template[index],result.condition[index]]})//label是节点信息，即路线排名号，grandchildrens是子节点，即具体的路线反应物
      }else{
        cdata.push({label:index, grandchildren:gchild,react:[clickedNode.label+'>>'+reactants[index],result.scores[index],result.template[index],]})
      }
    }
  }
  return cdata
}

function generateHierarchicalData(rootImage, childrenData) {
  var nodes = [];
  var edges = [];
  nodes.push({ id: 1, 
    title:['2', rootImage[1]],
    label:'ggg',
    shape:'image',
    image:rootImage[0],
    size:30,
    shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
    color:{border:'lightskyblue',background:"white"},
    borderWidth:'2',
    imagePadding:10
  })
 
  for (var i = 0; i < childrenData.length; i++) {
    var childNode = childrenData[i];
    var childNodeId = edges.length + 2;

    if (condition == 'with conditions'){
      nodes.push({ id: childNodeId,title:['1','#'+childNode.label,childNode.react[0],childNode.react[1],childNode.react[2],childNode.react[3]], label: String('#'+childNode.label),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }else{
      nodes.push({ id: childNodeId,title:['1','#'+childNode.label,childNode.react[0],childNode.react[1],childNode.react[2],], label: String('#'+childNode.label),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }
    
    edges.push({ from: 1, to: childNodeId }); //title 1代表篇子节点，2代表孙节点

    if (childNode.grandchildren && childNode.grandchildren.length > 0) {
      for (var j = 0; j < childNode.grandchildren.length; j++) {
        var grandchildId = nodes.length+ 1;
        var grandchildNode = childNode.grandchildren[j];
        nodes.push({ id: grandchildId, image: grandchildNode.image,shape:'image',label:grandchildNode.smi,
        title:['2',grandchildNode.title],
        size:30,
        shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
        color:{border:'orange',background:"white"},
        borderWidth:'2',
        imagePadding:10 });
        edges.push({ from: childNodeId, to: grandchildId });
      }
    }
  }
  console.log(nodes,edges)
  return [nodes, edges ];
}

function generateHierarchicalData1(clickedNode, childrenData, nodesnumber) {
  var nodes = [];
  var edges = [];
  for (var i = 0; i < childrenData.length; i++) {
    var childNode = childrenData[i];
    var childNodeId = edges.length+nodesnumber+1;

    if (condition == 'with conditions'){
      nodes.push({ id: childNodeId,title:['1','#'+childNode.label,childNode.react[0],childNode.react[1],childNode.react[2],childNode.react[3]], label: String('#'+childNode.label),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }else{
      nodes.push({ id: childNodeId,title:['1','#'+childNode.label,childNode.react[0],childNode.react[1],childNode.react[2],], label: String('#'+childNode.label),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }
    
    edges.push({ from: clickedNode.id, to: childNodeId });

    if (childNode.grandchildren && childNode.grandchildren.length > 0) {
      for (var j = 0; j < childNode.grandchildren.length; j++) {
        var grandchildId = nodes.length+ 1+nodesnumber;
        var grandchildNode = childNode.grandchildren[j];
        nodes.push({ id: grandchildId, image: grandchildNode.image,shape:'image',label:grandchildNode.smi,
        title:['2',grandchildNode.title],
        size:30,
        shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
        color:{border:'orange',background:"white"},
        borderWidth:'2',
        imagePadding:10 });
        edges.push({ from: childNodeId, to: grandchildId });
      }
    }
  }
  nodeoriginalnumber=nodeoriginalnumber+nodes.length
  console.log('new',nodes,edges)
  return [nodes, edges ];
}

async function multi_reaction(result){
  var reactions=[]
  var react=result['routes']
  var nodes = []
  var edges = []
  for (var j = 0; j < react.length; j++) {
    var react1={}
    var new_reactants=[]
    var new_products=[]
    var reactants=react[j].split('>')[2].split('.')
    for (var i = 0; i < reactants.length; i++) {
      var img = await getsvg(reactants[i])
      img.unshift(reactants[i])
      console.log('imageq',img1)
      new_reactants.push(img)
    }
    var products=react[j].split('>')[0].split('.')
    for (var i = 0; i < products.length; i++) {
      var img1 = await getsvg(products[i])
      console.log('imageq',img1)
      img1.unshift(products[i])
      new_products.push(img1)
    }
    var score=react[j].split('>')[1]
    react1['reactants']=new_reactants //列表中的每一个item，包含元素
    react1['products']=new_products
    react1['score']=score
    react1['id']=j
    react1['React']=react[j].split('>')[0]+'>>'+react[j].split('>')[2]
    react1['template']=result['templates'][j]
    if (condition == 'with conditions'){
      react1['condition']=result['condition'][j]
    }  
    reactions.push(react1)
  }
  console.log('bbbb',reactions)
    // 遍历反应路线数据，创建节点和
  reactions.forEach(function(reaction) {
    // 添加反应物和产物节点
    var product_node=0

    reaction.products.forEach(function(product) {
      const foundNode = nodes.find(node => node.label === product[0]);
      if (foundNode) {
        product_node=foundNode.id
      }else{
        product_node=nodes.length
        nodes.push({ id: product_node, label: product[0],image:product[1],shape:'image', 
        title:['2',product[2]],
        size:30,
        shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
        color:{border:'orange',background:"white"},
        borderWidth:'2',
        imagePadding:10 });
      }
    });

    var react_node=nodes.length
    if (condition == 'with conditions'){
      nodes.push({ id:react_node,title:['1','#'+reaction.id,reaction.React,reaction.score,reaction.template,reaction.condition], label: String('#'+reaction.id),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }else{
      nodes.push({ id:react_node,title:['1','#'+reaction.id,reaction.React,reaction.score,reaction.template], label: String('#'+reaction.id),borderWidth:'2', color:{background:"white"},shape: 'circle',opacity: 1, size: 10, font:5,align: 'center', });
    }
    edges.push({ from: product_node, to: react_node });
   
    reaction.reactants.forEach(function(reactant) {
      var reactant_node=nodes.length
      nodes.push({ id:reactant_node, image:reactant[1],shape:'image',label:reactant[0],
        title:['2',reactant[2]],
        size:30,
        shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
        color:{border:'orange',background:"white"},
        borderWidth:'2',
        imagePadding:10 });
      edges.push({ from: react_node, to: reactant_node });
    });
  });
  return [nodes,edges]
}




 
function findparentnodes(nodeId){
  var connectedNodes = [];
    // 定义一个递归函数来进行深度优先搜索
  function dfs(nodeId) {
    var node = nodes.get(nodeId);
    if(node.title[0]==='1'){
      var label = node.label;
      connectedNodes.unshift(label);
    }
    var parentNode = network.getConnectedNodes(nodeId, 'from')[0];
    // 如果存在父节点，则递归调用 dfs 函数
    if (parentNode !== undefined) {
      dfs(parentNode);
    }}
  dfs(nodeId)
  return connectedNodes.join('-')
}

function createtable(){
  var nodesWithTitle1 = nodes.get({
    filter: function(item) {
      return (item.title)[0] === '1';
    }
  });
  console.log('nodewith1',nodesWithTitle1)
  var tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  nodesWithTitle1.forEach(function(node,index) {
    var step = findparentnodes(node.id)
    var row = document.createElement('tr');
    var react = (node.title)[2]
    var parts = react.split('>>')
    if (condition=='with conditions'){
      var values = Object.values((node.title)[5]);
      var stringValues = values.join('\n');
    }else{
      var stringValues =''
    }
        
    if((node.title)[6]==='changed'){
      row.innerHTML = `
      <th scope="row" style="color: red;">${index}</th> 
      <td style="color: red;">${step}</td>
      <td style="color: red;">${Number((node.title)[3]).toFixed(2)}</td>
      <td style="color: red;">${parts[0]}</td>
      <td style="color: red;">${parts[1]}</td>
      <td style="color: red; white-space: pre;">${stringValues}</td>
      <td style="color: red;">${react}</td>
      <td style="color: red;">${(node.title)[4]}</td>
    `}else{
      row.innerHTML = `
      <th scope="row">${index}</th> 
      <td>${step}</td>
      <td>${Number((node.title)[3]).toFixed(2)}</td>
      <td>${parts[0]}</td>
      <td>${parts[1]}</td>
      <td style='white-space:pre;'>${stringValues}</td>
      <td>${react}</td>
      <td>${(node.title)[4]}</td>
    `;
    }
    tbody.appendChild(row);
  });
}

function reloadPage() {
  location.reload(); // 重新加载页面
}
// function resetCategory(categoryId) {
//   var contentDiv = document.getElementById("content");
//   // 根据分类ID执行相应的操作
//   switch (categoryId) {
//     case 1:
//       contentDiv.innerHTML = "Content for Category 1";
//       break;
//     case 2:
//       contentDiv.innerHTML = "Content for Category 2";
//       break;
//     case 3:
//       contentDiv.innerHTML = "Content for Category 3";
//       break;
//     default:
//       // 如果没有匹配的分类ID，重置内容为初始状态
//       contentDiv.innerHTML = "Initial content for the website.";
//       break;
//   }
// }


