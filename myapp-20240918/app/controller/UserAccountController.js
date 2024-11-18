//xy: export commonlib模板库中的用户登录相关中所需要的函数和新新编写的checkUser函数

var commonlib = require('../common/commonlib');

var commonObj = new(commonlib);

//传入userName,pwd,res
exports.login = function(userName,pwd,req,res){
  //使用commonObj中的登录方法，传入userName,pwd,待执行完毕后调用回调
  commonObj.login(userName,pwd,req,res);
  
}

exports.checkUser = function(req,res){
  if(req.session.username == null){
      res.end("NoUser");
  }else{
      var dataToFront = new Object();
      dataToFront.username = req.session.username;
      dataToFront.role = req.session.role;
      dataToFront.access = req.session.access;
      dataToFront.userIP = req.session.userIP;
     // console.log("Find Session:"+req.session.username);
      res.end(JSON.stringify(dataToFront));
  }
}