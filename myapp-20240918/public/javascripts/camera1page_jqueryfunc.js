// // //************************************************************************************************************************* */

// //************************************************************************************************************************* */
// //xy: websocket相关
// var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
// ws.onopen = function () {
//   // Web Socket 已连接上，使用 send() 方法发送数据
//   console.log("webSocket opening...");
//   ws.send("camera1page is opened");
//   // //循环获取视频帧并发送至WebSocket客户端
//   // setInterval(() => {  
//   //   if (camera && camera.isOpened()) {  
//   //     const frame = camera.read();  
//   //     if (!frame) {  
//   //       console.log('Failed to read the frame');  
//   //       return;  
//   //     }  
//   //     // wsServer.clients.forEach((client) => {  
//   //     //   client.send(frame);  
//   //     // });  
//   //     ws.send(frame);
//   //   } else {  
//   //     console.log('Camera is not opened');  
//   //   }  
//   // }, 100); // 每100毫秒发送一帧视频流，可以根据需要进行调整
// }

// ws.onmessage = function (evt) {
//   var Msg = JSON.parse(evt.data);

// };

// ws.onclose = function () {
//   // 关闭 websocket
//   console.log("连接已关闭...");
// };







// //************************************************************************************************************************* */
// //xy: jQuery 在文档加载后激活函数：
// $(document).ready(function () {
//   // //打开摄像头
//   // openCamera();
//   //check UDP server是否已经启动
//   $.ajax({    //jquery ajax方法
//       url: "/checkUdpServer",
//       type: "GET",
//       success: function (data) {
//           if (data != '') {
//               // var dataObj =JSON.parse(data);
//               //   if(dataObj[1]=="running"){
//               //     $(".btn-udp").css("display","none");
//               //     $(".udp-status").text("Udp Server is running at "+dataObj[2]+":"+dataObj[3]);
//               //     $(".udp-status").css("color","#449d44");
//               //   }
//           } else {
//               udpStatus = true;
//               startUdpServer();
//           }
//       }
//   })
  
// })

// //开启UDP服务
// function startUdpServer() {
//   $.ajax({
//       url: "/startUdpServer",
//       type: "GET",
//       success: function (data) {

//           var dataObj = JSON.parse(data);
//           //后台数据请求成功
//           // if(dataObj[0]=="success"){
//           //   swal("成功启动UDP Server!", "Udp Server is running at "+dataObj[2]+":"+dataObj[3], "success");
//           //   $(".btn-udp").css("display","none");
//           //   $(".udp-status").text("Udp Server is running at "+dataObj[2]+":"+dataObj[3]);
//           //   $(".udp-status").css("color","#449d44");
//           // }
//       }//success
//   })//ajax
// }


// //var cam1_id = 790a8c9cd9be90dc02286354a3296c5ec7106d2cbb2ffc4357b0151d4ac9e158;
// //var cam2_id = 767d0bb8876c5fe4c1b152b2c115da4b90e2eddfe5fa5a464b3717a0b770d651
// //xy：注意，两个USB摄像头需要接在不同的USB接口上，不能接在同一个USB扩展坞，否则会找不到第二个设备
// //xy:使用deviceId来选择我们本机上的摄像头或者usb摄像头,接在不同的USB接口上时ID不同，需要具体根据连接关系，
// //在浏览器F12的调试台查看打印的devicelist，copy其ID修改以下代码的ID
// function openCvReady(){
//   cv['onRuntimeInitialized']=()=>{
//     let video1 = document.getElementById("cam_input1"); // video is the id of video tag
//     let video2 = document.getElementById("cam_input2");
//     // 获取媒体设备列表  
//     navigator.mediaDevices.enumerateDevices()  
//       .then(function(devices) { 
//         console.log(devices) 
//         //选择要使用的设备(设备号我提前打印出来copy下来了，因此直接把ID写进代码里区分两个USB摄像头)
//         const cam1 = devices.find(device => device.kind === 'videoinput' && device.deviceId ==='790a8c9cd9be90dc02286354a3296c5ec7106d2cbb2ffc4357b0151d4ac9e158')
//         const cam2 = devices.find(device => device.kind === 'videoinput' && device.deviceId ==='767d0bb8876c5fe4c1b152b2c115da4b90e2eddfe5fa5a464b3717a0b770d651')
//         // 获取媒体输入流并显示在视频元素中  
//         navigator.mediaDevices.getUserMedia({ video: { deviceId: cam1.deviceId } })  
//           .then(function(stream1){
//             // 将流绑定到视频元素上
//             video1.srcObject = stream1;
//             video1.play();
//           })  
//           .catch(function(error){
//             console.log('无法访问摄像头1：' + error);
//           });
//         navigator.mediaDevices.getUserMedia({ video: { deviceId: cam2.deviceId } })  
//           .then(function(stream2){
//             // 将流绑定到视频元素上
//             video2.srcObject = stream2;
//             video2.play();
//           })  
//           .catch(function(error){
//             console.log('无法访问摄像头2：' + error);
//           });  
//           })
//       .catch(function(err) {
//       console.log("无法枚举设备： " + err);
//     });
//   //   //xy: 以下为使用OpenCV对视频图像处理，使用canvas绘图的函数，未用到
//   //   let src = new cv.Mat(video1.height, video1.width, cv.CV_8UC4);  //rgb
//   //   let dst = new cv.Mat(video1.height, video1.width, cv.CV_8UC1);  //gray
//   //   let cap = new cv.VideoCapture(cam_input1);
//   //   const FPS = 30;
//   //   function processVideo() {
//   //       let begin = Date.now();
//   //       cap.read(src);
//   //       src.copyTo(dst);
//   //       cv.imshow("canvas_output", dst);
//   //       // schedule next one.
//   //       let delay = 1000/FPS - (Date.now() - begin);
//   //       setTimeout(processVideo, delay); //根据帧率逐帧获取图像
//   //   }
//   // // schedule first one.
//   // setTimeout(processVideo, 0);
//   };
// }

//-----------------------------------------------------------------------------------------
// //************************************************************************************************************************* */
// const Sourcevideo1 = document.getElementById("cam_input1"); // video is the id of video tag
// const Sourcevideo2 = document.getElementById("cam_input2");
let Sourcevideo1 = document.createElement("video"); // video is the id of video tag
let Sourcevideo2 = document.createElement("video");
const cropCanvas1 = document.getElementById('croppedVideo1');
//************************************************************************************************************************* */
//xy: websocket相关
var ws = new WebSocket("ws://localhost:3002");  //xy:需与nodejs_websocket.js中设置的PORT相同才能建立websocket连接
ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log("webSocket opening...");
  ws.send("camerapage is opened");

}

ws.onmessage = function (evt) {
  var Msg = JSON.parse(evt.data);

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


//var cam1_id = 2222f17a3b65ba995903d162f2c3f4d507d9a441a14c7cabf85e4164e2c08138;
//var cam2_id = 767d0bb8876c5fe4c1b152b2c115da4b90e2eddfe5fa5a464b3717a0b770d651
//xy：注意，两个USB摄像头需要接在不同的USB接口上，不能接在同一个USB扩展坞，否则会找不到第二个设备
//xy:使用deviceId来选择我们本机上的摄像头或者usb摄像头,接在不同的USB接口上时ID不同，需要具体根据连接关系，
//在浏览器F12的调试台查看打印的devicelist，copy其ID修改以下代码的ID
function openCvReady(){
  // cv['onRuntimeInitialized']=()=>{
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

    


    //使用canvas绘制裁切过的画面,这个是可以的
    const cropCanvas1 = document.getElementById('croppedVideo1');  
    const cropCanvas2 = document.getElementById('croppedVideo2');
    const dw = cropCanvas1.width;
    const dh = cropCanvas1.height;
    const context1 = cropCanvas1.getContext('2d');
    const context2 = cropCanvas2.getContext('2d');
    const FPS = 30;
  
    function ProcessVideo()
    {
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
      context1.drawImage(Sourcevideo1, 20, 150, 550, 220,0,0,dw,dh); 
      context2.drawImage(Sourcevideo2, 20, 130, 550, 220,0,0,dw,dh); 
      requestAnimationFrame(ProcessVideo);// 使用 requestAnimationFrame 以确保平滑的帧速率
    }
    // schedule first one.
    // setTimeout(ProcessVideo, 0);
    ProcessVideo();

    
  //   //xy: 以下为使用OpenCV对视频图像处理，使用canvas绘图的函数，未用到
  //   let src = new cv.Mat(video1.height, video1.width, cv.CV_8UC4);  //rgb
  //   let dst = new cv.Mat(video1.height, video1.width, cv.CV_8UC1);  //gray
  //   let cap = new cv.VideoCapture(cam_input1);
  //   const FPS = 30;
  //   function processVideo() {
  //       let begin = Date.now();
  //       cap.read(src);
  //       src.copyTo(dst);
  //       cv.imshow("canvas_output", dst);
  //       // schedule next one.
  //       let delay = 1000/FPS - (Date.now() - begin);
  //       setTimeout(processVideo, delay); //根据帧率逐帧获取图像
  //   }
  // // schedule first one.
  // setTimeout(processVideo, 0);


  //  };
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

