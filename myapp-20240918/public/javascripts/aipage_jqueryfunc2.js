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

var ketcher = newketcher();
var result
var ws_ai = new WebSocket("ws://localhost:3004");  //需与逆合成服务器中设置的PORT相同才能建立websocket连接
ws_ai.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket with ai opening...");
  //ws_ai.send("SMILES is coming");
}
//处理接收到的信息
ws_ai.onmessage = async function (evt) {
  result = JSON.parse(evt.data);
  console.log("received from AI:" , result);
  // Generate hierarchical data 
  var reactants=result.reactants
  console.log(reactants+';;;;')
  var smiles = $("#inputSmiles").val();
  var data1= await getchildrendata(smiles,reactants)
  var rootImage = data1[0]
  const svgContainer = document.getElementById('selected_molecule_view');
  svgContainer.innerHTML = `<img src="${rootImage}" alt="SVG Image" Image" width="50" height="50">`;
  var childrenData = data1[1]
  console.log(childrenData)
  var netdata= generateHierarchicalData(rootImage, childrenData)
  // create a network
  console.log(";;;;",netdata)
  var ketchercontainer = document.getElementById('ketchercontainer');
  var imageContainer = document.getElementById('imageContainer1'); 
  ketchercontainer.style.display = 'none';
  imageContainer.style.display = 'flex';
  imageContainer.style.marginTop = '50px';
  imageContainer.style.width = '1000px';
  imageContainer.style.height = '500px';
  var options = {
    
    edges: {
      color: "lightgray",
    },
    layout: {
      hierarchical: {
        direction: "UD", // Up-Down layout
        sortMethod: "directed",
      },
    },
  };

    
  var network = new vis.Network(imageContainer, netdata, options);

  // var network = new vis.Network(imageContainer, netdata, options);
  
  // document.getElementById("AiServerMsg").innerHTML = evt.data;
};
//打印出错消息
ws_ai.onerror = function(evt){
  console.log("websocket error:" + evt.error);
};
ws_ai.onclose = function () {
  // 关闭 websocket
  console.log("连接ai已关闭...");
};

//监听按钮点击事件，当按钮被点击后，将输入的smiles式发送到逆合成服务器
document.addEventListener('DOMContentLoaded', function () {
var toggleButton = document.getElementById('StartProgressBtn');

toggleButton.addEventListener('click', async function StartProcess_1 (){ 
  var smiles = $("#inputSmiles").val();
  
  var smiles_json = JSON.stringify({smile:smiles, tag:'temp', topk:10});
  ws_ai.send(smiles_json);
 
  
})
})
//---------------------------------hl设置network---------------------------------------
var nodes = null;
var edges = null;
var network = null;

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}
//创建结果的图
// async function getsvg(smi){

//   const imageBlob = await ketcher.generateImage(smi, {outputFormat: 'svg',//backgroundColor:'rgb(255, 255, 255)
//     bondThickness: '2', });
//   var reader = new FileReader();
//   reader.readAsDataURL(imageBlob); 

//   return new Promise((resolve, reject) => {
//     reader.onloadend = function() {
//       // 直接赋值给外部函数中声明的 imageUrl 变量
//       var imageUrl = reader.result;
//       var svgWithSize = imageUrl.replace('<svg>', `<svg width="${20}" height="${20}"`);
//       resolve(svgWithSize);
//     }

//     reader.onerror = function(error) {
//       reject(error);
//     }
//   });
// }
//创建结果的图
async function getsvg(smi){

  const imageBlob = await ketcher.generateImage(smi, {outputFormat: "svg",//backgroundColor:'rgb(255, 255, 255)
    bondThickness: '2', });
  // img= await imageBlob.text()
  // 创建一个 URL 对象
  // const imageUrl = URL.createObjectURL(imageBlob);
  const imageElement = document.createElement("img");
  // imageElement.width = 20 ;  // Replace with your desired width
  // imageElement.height = 20;
  // // imageElement.style.backgroundColor='white' 
  // // imageElement.style.border = "2px solid blue"; // 设置图片边框样式

  // //  Replace with your desired height
  imageElement.src = URL.createObjectURL(imageBlob);
  // // imageurl = URL.createObjectURL(imageBlob);
  return imageElement.src
}

async function getchildrendata(product,reactants){
  var rImage= await getsvg(product)
  var cdata=[]
  for (let index = 0; index < reactants.length; index++) {
    var gchild=[]
    if (reactants[index].includes('.')) {
      const splitItems = reactants[index].split('.');
      for (let i = 0; i < splitItems.length; i++) {
        const img = await getsvg(splitItems[i]);
        gchild.push({image:img})
      }
      cdata.push({label:index, grandchildren:gchild})

    } else {
      const img = await getsvg(reactants[index]);
      gchild.push({image:img})
      cdata.push({label:index, grandchildren:gchild})
    }
  }
  return [rImage,cdata]
}

function generateHierarchicalData(rootImage, childrenData) {
  var nodes = [];
  var edges = [];

  // nodes.push({ id: 1, 
  //   image:rootImage,
  //   label:'ggg',
  //   shape:'image',
  //   size:30,
  //   shapeProperties:{useBorderWithImage:true,useImageSize:false,interpolation: true},
  //   color:{border:'blue',background:"white"},
  //   borderWidth:'2',
  //   imagePadding:{top:5,right:15,buttbottom:10,left:15}

  // })
  var rootImage=rootImage
  nodes.push({
    id: 1, 
    label: 'Custom Node', 
    shape: 'custom',
    color:'white',
    ctxRenderer:ctxRenderer,
    style: {
      size: 100, // 设置节点的大小
      borderWidth: 2, // 设置边框宽度
      borderColor: 'black', // 设置边框颜色
    },
    svgImage:rootImage
  })
  
    
  for (var i = 0; i < childrenData.length; i++) {
    var childNode = childrenData[i];
    var childNodeId = edges.length + 2;

    nodes.push({ id: childNodeId, label: String(childNode.label), shape: 'circle', size: 10, font:5, labelPosition: 'center'});
    edges.push({ from: 1, to: childNodeId });

    if (childNode.grandchildren && childNode.grandchildren.length > 0) {
      for (var j = 0; j < childNode.grandchildren.length; j++) {
        var grandchildId = nodes.length+ 1;
        var grandchildNode = childNode.grandchildren[j];

        nodes.push({ id: grandchildId, image: grandchildNode.image });
        edges.push({ from: childNodeId, to: grandchildId });
      }
    }
  }
  console.log(nodes,edges)
  return { nodes: nodes, edges: edges };
}


// async function customShapeRenderer({ ctx, x, y, style, imageSource }) {
//   const r = style.size; // 根据节点的样式计算半径

//   // 创建一个 Image 元素
//   const img = new Image();
//   img.src = await imageSource; // 使用传入的图片来源

//   // 当图片加载完成后绘制到 Canvas 上
//   img.onload = function() {
//     // 绘制图片到节点上
//     ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r);

//     // 绘制边框
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, 2 * Math.PI); // 绘制一个圆形路径
//     ctx.lineWidth = 2; // 设置边框宽度
//     ctx.strokeStyle = 'black'; // 设置边框颜色
//     ctx.stroke(); // 绘制边框
//   };

//   // 返回节点的尺寸信息
//   return {
//     width: 2 * r, // 宽度为直径的两倍
//     height: 2 * r, // 高度为直径的两倍
//   };
// }
async function ctxRenderer({ ctx, id, x, y, style, label,svgImage }) {
  // 计算节点的宽度和高度
  const width = style.size * 2;
  const height = style.size * 2;

  // 绘制节点形状
  ctx.beginPath();
  ctx.arc(x, y, style.size, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();

  // 绘制节点标签
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + style.size + 10);

  return {
    drawNode() {
      // 绘制节点形状和内部元素
      ctx.beginPath();
      ctx.arc(x, y, style.size, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    },
    drawExternalLabel() {
      // 绘制节点外部标签
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + style.size + 10);
    },
    nodeDimensions: { width, height }, // 节点的尺寸
  };
}
