
// // 获取可移动容器元素
var container = document.getElementById('jsPanelContainer');
var isFullScreen = false;
// 初始化拖动功能
var isDragging = false;
var offsetX, offsetY;
var isResizing = false;
var originalX;
var originalY;
var originalWidth;
var originalHeight;
var onboard=false
var ketcher1

// container.addEventListener('mousedown', function(e) {
//   isDragging = true;
//   offsetX = e.clientX - container.offsetLeft;
//   offsetY = e.clientY - container.offsetTop;
  
//   // isResizing = true;
//   // startX = e.clientX;
//   // startY = e.clientY;
//   // startWidth = container.offsetWidth;
//   // startHeight = container.offsetHeight;
//   // // 阻止默认事件，避免选择文本等行为
//   // e.preventDefault();
  
// });

// container.addEventListener('mousemove', function(e) {
//   var cursorType = e.target.style.cursor;
//   var rect = container.getBoundingClientRect();
//   var borderWidth = 3; // 边框宽度
//   var mouseX = e.clientX - rect.left; // 鼠标相对于容器左边界的距离
//   var mouseY = e.clientY - rect.top; //
//   var isTopLeft = mouseX <= borderWidth && mouseY <= borderWidth;
//   var isTopRight = mouseX >= rect.width - borderWidth && mouseY <= borderWidth;
//   var isBottomLeft = mouseX <= borderWidth && mouseY >= rect.height - borderWidth;
//   var isBottomRight = mouseX >= rect.width - borderWidth && mouseY >= rect.height - borderWidth;

//   if (isDragging&&cursorType === "move") {
//     container.style.left = (e.clientX - offsetX) + 'px';
//     container.style.top = (e.clientY - offsetY) + 'px';
//   }else if(isDragging&&isResizing){
//     var deltaX = e.clientX - startX;
//     var deltaY = e.clientY - startY;
//     var newWidth = startWidth + deltaX;
//     var newHeight = startHeight + deltaY;

//     // 设置容器及内容的新大小
//     container.style.width = newWidth + 'px';
//     container.style.height = newHeight + 'px';

//     // 阻止默认事件，避免选择文本等行为
//     e.preventDefault();
//   }else{
//     isDragging = false;
//     onboard=false;
//     isResizing=false
//   }  
//   // 设置鼠标样式为斜双箭头
// //   if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {if (isTopLeft) {
// //       container.style.cursor = 'nw-resize'; // 左上角
// //     } else if (isTopRight) {
// //       container.style.cursor = 'ne-resize';
// //       // 右上角
// //     } else if (isBottomLeft) {
// //       container.style.cursor = 'sw-resize'; // 左下角
     
// //     } else if (isBottomRight) {
// //       container.style.cursor = 'se-resize'; // 右下角
     
// //     } else {
// //       container.style.cursor = 'default'; // 默认样式
      
// //     }
// //   } else if (
// //     (mouseX <= borderWidth && mouseY >= borderWidth && mouseY <= rect.height - borderWidth) || // 左边框
// //     (mouseX >= rect.width - borderWidth && mouseY >= borderWidth && mouseY <= rect.height - borderWidth) || // 右边框
// //     (mouseY <= borderWidth && mouseX >= borderWidth && mouseX <= rect.width - borderWidth) || // 上边框
// //     (mouseY >= rect.height - borderWidth && mouseX >= borderWidth && mouseX <= rect.width - borderWidth) // 下边框
// //   ) {
// //     if (mouseX <= borderWidth || mouseX >= rect.width - borderWidth) {
// //       container.style.cursor = 'ew-resize'; // 设置鼠标样式为左右调整大小
      
// //     } else {
// //       container.style.cursor = 'ns-resize'; // 设置鼠标样式为上下调整大小
      
// //     }
// //   } else {
// //     container.style.cursor = 'default'; // 设置鼠标样式为默认
   
// //   };
// //   });

// // container.addEventListener('mouseup', function() {
// //   isDragging = false;
// //   isResizing=false
// });

// function closeContainer() {
//   // var container = document.getElementById('jsPanelContainer');
//   if (container) {
//     container.parentNode.removeChild(container);
//   }
// }

// function resizeContainer() {
//   // var container = document.getElementById('container');
//   if (!isFullScreen) {
//     // 放大全屏
//     container.style.transform = 'scale(1.5)';
//     isFullScreen = true;
//   } else {
//     // 恢复初始状态
//     container.style.transform = 'scale(1)';
//     isFullScreen = false;
//   }
// }

// // JavaScript function to toggle visibility of container elements
// function Visibility() {
//   var container = document.getElementById('details'); // Replace '.jsPanel-controlbar' with the appropriate selector for your container
//   var small=document.getElementById('p-header');

//   if (container.style.display === 'none') {
//       container.style.display = 'block';
      
//   } else {
//       container.style.display = 'none';
      
      
//   }
// }
// //____________________________________________________
  
// if (
//   (mouseX <= borderWidth && mouseY >= borderWidth && mouseY <= rect.height - borderWidth) || // 左边框
//   (mouseX >= rect.width - borderWidth && mouseY >= borderWidth && mouseY <= rect.height - borderWidth) || // 右边框
//   (mouseY <= borderWidth && mouseX >= borderWidth && mouseX <= rect.width - borderWidth) || // 上边框
//   (mouseY >= rect.height - borderWidth && mouseX >= borderWidth && mouseX <= rect.width - borderWidth) // 下边框
// ) {
//   if (mouseX <= borderWidth || mouseX >= rect.width - borderWidth) {
//     container.style.cursor = 'ew-resize'; // 设置鼠标样式为左右调整大小
//     onboard=true
//   } else {
//     container.style.cursor = 'ns-resize'; // 设置鼠标样式为上下调整大小
//     onboard=true
//   }
// } else {
//   container.style.cursor = 'default'; // 设置鼠标样式为默认
//   onboard=true
// }

var panelClosed = false;
var mypanel
var contents=`
    <div class="containercontent">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div data-v-f309917d="" class="details-top text-center" style="position: relative;style="display: flex; justify-content: center;">
        <div data-v-f309917d="" class="" role="button" aria-describedby="v-tooltip-98" >
            <b data-v-f309917d="">Smiles: CN1CCC(C#N)(c2ccccc2)C</b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div data-v-f309917d="" id="ketcher-min-chemical" class="position-relative" >
            <iframe id="ketcherframe1" src="/ketcher-standalone-2.18.0/standalone/index.html" width="450" height="400" frameborder="0" style="pointer-events: auto;"></iframe>
        </div>
      </div> 
      
      <div data-v-f309917d="" class="d-flex justify-center pa-2 ma-2" style="justify-content: center;">
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
          <button class="btn btn-danger" type="button" onclick="select()">select</button>
          <button class="btn btn-warning" type="button" onclick="del()">delete</button>
          <button class="btn btn-success" type="button" onclick='collapse()'>collapse</button>
        </div>
      </div>
      <hr data-v-f309917d="" class="v-divider v-theme--light my-2" aria-orientation="horizontal" role="separator" style="border-top-width: 2px;">
      <div data-v-f309917d="" id="chemical-node-toolbar" class="d-flex justify-center flex-gap-2 flex-wrap" style='justify-content: center'>
        <button class="btn btn-primary" type='button' onclick='addnodes()'>add nodes</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="btn btn-info" type='button' onclick='changenodes()'>change nodes</button>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  
      <div id="condition-table" class="table-container"  style="display:none">
          <h3 data-v-f309917d=""> Condition</h3>
            <table id='table2' class="table" style="margin: 0 auto">
              <thead class="table-dark">
                <tr>
                  <th onclick="sortTable(0)">order</th>
                  <th>condition</th>
                  <th>score</th>
                </tr>   
              </thead>
              <tbody id="tbody1">
              </tbody>
            </table>
           
      </div>
      <div id="myModal" class="modal" style='display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            // width: 60%;
            // height: 20%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            }'>
      <div class="modal-content" style='background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 30%;
      text-align: center;'>
        <p style="font-size: 24px;">sure to cancel this node?</p>
        <div class="d-grid gap-2 d-md-block justify-content-end">
          <button class="btn btn-secondary" type="button" onclick="handleYes()">Yes</button>
          <button class="btn btn-secondary" type="button" onclick="handleCancel()">Cancel</button> 
          
        </div>         
      </div>
    </div>
  `

function createPanel() {
    return jsPanel.create({
      id:'mypanel',
      container: jsPanelContainer,
      headerTitle:'node details',
      contentSize: 'auto auto',
      animateIn: 'jsPanelFadeIn',
      animateOut: 'jsPanelFadeOut',
      position:'right-top',
      font: 20,
      content:contents,
      config: {
        fullscreen: true // 启用全屏功能
      },
      size: {
        width: 400, // 宽度为 400 像素
        height: 600 // 高度为 300 像素
      },
      onclosed: function(panel) {
        // 当面板关闭时设置 panelClosed 为 false
        document.getElementById("jsPanelContainer").style.display = "none";
        createPanel()
        panelClosed = true;
    }
    })
}

document.addEventListener('DOMContentLoaded', async function() {
  mypanel=createPanel() 
});

function select(){
  var titles = [];
  var allNodes = network.body.nodes;
  console.log('nnnnn',allNodes)
  for (var nodeId in allNodes) 
    
    if (nodeId !== clickedNode.id ){
      console.log('nnnnnn',nodeId,clickedNode.id)
      var node = allNodes[nodeId];
      // 获取节点的 title 属性值
      var title = (node.options.title)[1];
      // 将 title 添加到数组中
      console.log('dd',title)
      if(title ===(clickedNode.title)[1]){
        titles.push(nodeId);}
  network.selectNodes(titles)
}};

function findDescendants(nodeId) {
  var descendants = [];
  edges.forEach(function(edge) {
      if (edge.from === nodeId) {
          descendants.push(edge.to); // 添加直接相连的子节点
          descendants = descendants.concat(findDescendants(edge.to)); // 递归查找子节点的子节点
      }
  });
  return descendants;
}

function del(){
  var allDescendants = [];
  var edges = network.body.data.edges.get(); // 获取所有边
  // function findDescendants(nodeId) {
  //   var descendants = [];
  //   edges.forEach(function(edge) {
  //       if (edge.from === nodeId) {
  //           descendants.push(edge.to); // 添加直接相连的子节点
  //           descendants = descendants.concat(findDescendants(edge.to)); // 递归查找子节点的子节点
  //       }
  //   });
  //   return descendants;
  // }
  allDescendants=findDescendants(clickedNode.id)
  if (allDescendants !== null && allDescendants.length > 0) {
    allDescendants.forEach(function(descendantId) {
      network.body.data.nodes.remove({id: descendantId}); // 从数据集中删除节点
    });
    edges.forEach(function(edge) {
      if (allDescendants.includes(edge.to)) {
        network.body.data.edges.remove({id: edge.id}); // 从数据集中删除边
        
      }
    if((clickedNode.title)[0]==='1'){
      var connectedEdges = network.getConnectedEdges(clickedNode.id);
      console.log('mmmmm',connectedEdges.id)
      connectedEdges.forEach(function(edgeId) {
        network.body.data.edges.remove({ id: edgeId });
        network.body.data.nodes.remove({id: clickedNode.id})
      });
    }
  });}else{
    openModal()
  }
  createtable()
};

function collapse(){
  function clusterByHubsize(clickedNodeid) {
    var allDescendants=findDescendants(clickedNodeid)
    allDescendants.push(clickedNodeid)
    console.log('ffffff',allDescendants)
    network.cluster({
      joinCondition: function(nodeOptions) {
        return allDescendants.includes(nodeOptions.id);
      },
      processProperties: function(clusterOptions, childNodes) {
                clusterOptions.label = "[" + childNodes.length + "]";
                return clusterOptions;},
      clusterNodeProperties: {
        id: 'Cluster'+clickedNodeid,
        borderWidth: 3,
        shape: "box",
        font: { size: 30 },
        color: {
          border: '#2B7CE9',
          background: '#D2E5FF',
          highlight: {
            border: '#2B7CE9',
            background: '#FFFFFF'
          }}
      }         
    });
  }
  clusterByHubsize(clickedNode.id)
  console.log( network.body.data.nodes)
}

function addnodes(){
  if ((clickedNode.title)[0]==='1'){
    alert("can't do this operation for number nodes" )}
  var smiles = clickedNode.label;
  var smiles_json = JSON.stringify({smile:smiles, tag:tag, topk:topk,condition:condition,flag:2,serve:'single'});
  ws_ai.send(smiles_json);
}

function openModal() {
  document.getElementById("myModal").style.display='block';
}

function handleYes() {
  var connectedEdges = network.getConnectedEdges(clickedNode.id)
  var parentNodes = [clickedNode.id];
  connectedEdges.forEach(function(edgeId) {
      var edge = edges.get(edgeId);
      if (edge.to === clickedNode.id) {
          var parentNodeId = edge.from;
          var allDescendants=findDescendants(parentNodeId)
          if (parentNodeId !== 0 && allDescendants.length<=1){
            parentNodes.push(parentNodeId);
          }  
      }
  });
  nodes.remove(parentNodes)
  closeModal();
}

function handleCancel() {
  closeModal();
}

function closeModal() {
  document.getElementById("myModal").style.display='none';
}

async function changenodes(){
  if ((clickedNode.title)[0]==='1'){
    alert("can't do this operation for number nodes" )}
  if (typeof ketcher1 !== 'undefined') {
    var smiles= await ketcher1.getSmiles();
    const inchI= await ketcher1.getInchi()
    var element = document.querySelector('b[data-v-f309917d]')
    element.textContent = smiles
    // var ketcher = newketcher()
    const imageBlob = await ketcher1.generateImage(smiles, {outputFormat: "svg",bondThickness: '2', });
    const imageUrl = URL.createObjectURL(imageBlob);
    clickedNode.label=smiles
    clickedNode.title=[(clickedNode.title)[0],inchI]
    clickedNode.image=imageUrl
    nodes.update(clickedNode) 
    var parentNode = network.getConnectedNodes(clickedNode.id, 'from')[0];
    // 如果存在父节点，则递归调用 dfs 函数
    if (parentNode !== undefined) {
      console.log('yes ' + parentNode + ' not found.');
      var decendent=network.getConnectedNodes(parentNode,'to')
      var index = decendent.indexOf(clickedNode.id)
      var til=nodes.get(parentNode).title
      var change=til[2].split('>>')
      var product=change[0]
      var R=change[1]
      if(R.includes('.')){
        R=R.split('.')
        R[index]=smiles
        R=R.join('.')
      }else{R=smiles}
      var N = product+'>>'+R
      til[2]=N
      til[6]='changed'
      console.log('//////',til);
      nodes.get(parentNode).title=til
      nodes.update(nodes.get(parentNode))
      console.log(nodes.get(parentNode));
    }
    console.log('fffff',nodes.get(parentNode));
  } else {  
    console.log('Ketcher 不存在');
  } 
  createtable()
}

//-----------------编辑表格------------------------------------------------
var editableCells = document.querySelectorAll(".editable");
document.addEventListener("dblclick", function(event) {
    if (event.target.classList.contains("editable")) {
        // 将单元格的内容保存为变量
        var content = event.target.textContent;
        
        // 创建一个 input 元素
        var input = document.createElement("input");
        input.type = "text";
        input.value = content;
        // 清空单元格内容，并将 input 元素添加到单元格中，并设置焦点
        event.target.textContent = "";
        event.target.appendChild(input);
        input.focus();
        // 获取列索引
        var columnIndex = event.target.cellIndex;
        var row = event.target.parentNode;
        var rowIndex = row.rowIndex-1;
        console.log('----------',content,columnIndex,rowIndex)
        // 在 input 元素失去焦点时保存编辑的内容
        input.addEventListener("blur", function() {
            // 获取编辑后的内容
            var table = document.getElementById("table2");
            var newValue = this.value;
            // 检查是否更改了内容
            if (newValue !== content) {
                // 检查编辑后的内容是否与表格中其他单元格的内容重复
                var isDuplicate = false;
                var cellsInColumn = table.querySelectorAll("td:nth-child(" + (columnIndex + 1) + "),th:nth-child(" + (columnIndex + 1) + ")");
                console.log(newValue)
                cellsInColumn.forEach(function(cell) {
                    console.log('cell.textContent',cell.textContent)
                    if (cell.textContent === newValue && cell !== event.target) {
                        isDuplicate = true;
                    }
                });
                if (!isDuplicate) {
                    // 如果编辑后的内容不重复，则更新单元格内容
                    event.target.textContent = newValue;
                } else {
                    // 如果编辑后的内容与表格中其他内容重复，弹出提示框
                    alert("内容重复，请输入其他内容");
                    setTimeout(function() {
                      input.focus();
                    }, 0);
                }
            } else {
                // 如果未更改内容，弹出提示框
                alert("内容未更改");
            }
            var update1=(clickedNode.title)[5]
            var RowCells = table.rows[rowIndex+1].cells
            if(columnIndex==0){
              content=content.replace(/\n/g, '');
              console.log('content',content)
              var new1 = update1[content]
              console.log('new1',new1)
              delete update1[content]
              update1[newValue]=new1
              nodes.update(clickedNode)
              createtable()
              console.log('key',(Object.keys((clickedNode.title)[5])))
            }else{
            
              var newcontent=[]
              for (var i = 1; i < RowCells.length; i++) {
                newcontent.push(RowCells[i].textContent)
              }
              var id=RowCells[0].textContent.replace(/\n/g, '');
              // delete update1[changekey]
              update1[id]=newcontent
              nodes.update(clickedNode)
              createtable()
            }
            console.log('uuuuuuu',(clickedNode.title)[5])
        });
    }
});

