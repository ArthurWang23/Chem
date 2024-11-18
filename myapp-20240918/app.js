//xy:工程入口文件
var createError = require('http-errors');
var express = require('express');             //xy:express框架
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');//xy:Parse header and populate with an object keyed by the cookie names.
var bodyParser = require('body-parser');      //xy:Node.js body parsing middleware
var favicon = require('serve-favicon');       //xy:Node.js middleware for serving a favicon.


// xy: 连接数据库
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/AutoChem',{config:{autoIndex:false}});//    close  index  to  decrease  time
mongoose.connection.on("open",function(){
  console.log("Connected to MongoDB AutoChem");
})

//xy: 导入页面切换的路由文件
var indexRouter = require('./routes/index_route');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
// //-这两行是express-generator生成的
// app.use(express.json());   
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({ secret: 'NETGAPCOOKIESAFECODE' }));

//- xy:页面切换路由设置
app.use('/', indexRouter);    //xy： 未登录的index界面。
app.use('/index', indexRouter); //已经登陆了的index界面
app.use('/users', indexRouter);
app.use('/AI',indexRouter);
app.use('/processing',indexRouter);
app.use('/result',indexRouter);
app.use('/database1',indexRouter);
app.use('/database2',indexRouter);
app.use('/camera1',indexRouter);
app.use('/camera2',indexRouter);
app.use('/loginpage',indexRouter);
app.use('/login',indexRouter);
app.use('/logout',indexRouter);

//app.use('/jsplub',express.static(__dirname + '/node_modules/jsplumb'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//- xy:设置端口号为2024 ---在www.js中设置，否则重复设置会报错Port 2024 is already in use www:72 Process exited with code 1
// var server = app.listen(3000,function(){
//   var host = server.address().address
//   var port = server.address().port

//   console.log("AutoChem启动，访问地址为http://%s:%s",host,port)
// })

module.exports = app;
module.exports.mongoose = mongoose;
