var express = require('express');
var fs = require('fs');
var router = express.Router();

//xy 导入commlib中udpserver相关函数
// var UdpServerController = require('../app/controller/UdpServerController'); 
var TcpServerController = require('../app/controller/TcpServerController');
//xy 导入用户登录相关函数
var UserAccountController = require('../app/controller/UserAccountController');


/* GET home page. */
//xy: 跳转至未登录的index界面
router.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'AutoChem' , udpStatus: "hello", username: req.session.username });
  //res.render('index.jade', { title: 'AutoChem' , udpStatus: "hello"});
});

//start up udpserver，在mainfunction.js中使用jquery ajax方法使用 HTTP Get从远程服务器上请求
router.get('/startUdpServer', function(req, res, next) {
  var dataToFront = UdpServerController.startUdpServer(req);
  res.end(dataToFront);
});

//check udpserver，在mainfunction.js中使用jquery ajax方法使用 HTTP Get从远程服务器上请求
router.get('/checkUdpServer', function(req, res, next) {
  var dataToFront = UdpServerController.checkUdpServer();
  res.end(dataToFront);
});

//start up tcpserver，在mainfunction.js中使用jquery ajax方法使用 HTTP Get从远程服务器上请求
router.get('/startTcpServer', function(req, res, next) {
  var dataToFront = TcpServerController.startTcpServer(req);
  res.end(dataToFront);
});

//check tcpserver，在mainfunction.js中使用jquery ajax方法使用 HTTP Get从远程服务器上请求
router.get('/checkTcpServer', function(req, res, next) {
  var dataToFront = TcpServerController.checkTcpServer();
  res.end(dataToFront);
});

//xy: 界面路由begin***************************************************************
//跳转至登陆了的index界面
router.get('/index', function (req, res, next) {
  res.render('index_logged.jade', { title: 'AI逆合成分析' });
});

// 跳转至AI界面
router.get('/AI', function (req, res, next) {
  res.render('AI_Analysis.jade', { title: 'AI逆合成分析' });
});

//跳转至框图显示界面
router.get('/processing', function (req, res, next) {
  res.render('processing.jade', { title: '反应框图' });
});

//跳转至反应结果界面
router.get('/result', function (req, res, next) {
  res.render('result.jade', { title: '反应结果' });
});

//跳转至数据库1界面
router.get('/database1', function (req, res, next) {
  res.render('database1.jade', { title: '数据库1' });
});

//跳转至数据库2界面
router.get('/database2', function (req, res, next) {
  res.render('database2.jade', { title: '数据库2' });
});

//跳转至视频监控界面
router.get('/camera', function (req, res, next) {
  res.render('camera.jade', { title: '监控1' });
});

// //跳转至视频监控2界面
// router.get('/camera2', function (req, res, next) {
//   res.render('camera2.jade', { title: '监控2' });
// });

//跳转至登录界面
router.get('/loginpage',function(req,res,next){
  res.render('loginpage.jade', { title: '用户登录' });
});
//xy: 界面路由end**************************************************************

//xy:用户登录相关begin：*************************************************************
//xy: 点击登录按键后，通过$.ajax 进行HTTP GET请求（loginout_jqueryfunc.js)
router.get('/login',function(req,res,next){
  //获取url传来的值
  var userName = req.query.uname;
  var pwd = req.query.pswd;
  console.log("userName:" + userName);
  console.log("pwd:" + pwd);
  //进行登录，传入用户名、密码、response
  UserAccountController.login(userName, pwd, req, res);
})

router.get('/checkUser', function (req, res, next) {
  //获取后台关于user的session
  commonController.checkUser(req, res);
})

//注销
router.get('/logout', function (req, res, next) {
  //用户注销操作，清除session
  req.session.userID = null;
  req.session.username = null;
  req.session.role = null;
  req.session.access = null;
  req.session.userIP = null;
  // res.end("logout");

  //返回项目介绍index界面
  res.render('index.jade', { title: 'Chem' });
});
//xy:用户登录相关end：*************************************************************


module.exports = router;
