//common文件里的这个udpServer是一个通用的代码，需要使用哪个udp的功能就改成哪个对应的udp文件
//xy： 本代码是udpserver的通用代码，作为模板库，需要使用哪个功能，在其他文件中export,比如我在udpserverstartup.js文件中进行export，nsp在nsp_websocket.js
// var udpServer = require('../controller/udpserver.js');
var tcpServer = require('../controller/chem_tcpserver.js');
var users = require('../model/user.js');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

function common(){
	this.checkUdpServer = function(){
		console.log("run checkUdpServer");
		if (global.udpServer!=null){
			//查看UDP服务器工作状态
			var dataToFront = InnerCheckUdpServer();
			console.log("/checkUdpServer Sent to Front"+dataToFront);
			return dataToFront;
		}
	}

	this.checkTcpServer = function(){
		console.log("run checkTcpServer");
		if(global.tcpServer!=null){
			//查看TCP服务器工作状态
			var dataToFront = InnerCheckTcpServer();
			console.log("/checkTcpServer Sent to Front"+dataToFront);
			return dataToFront;
		}
	}
	
	this.startUdpServer = function(){
		console.log("run the UDP Start Process");
		//开启全局UDP服务器
		//global.udpServer = new(udpServer);
        global.udpServer = new udpServer();
        global.udpServer.startUdpServer();
        // // by Siepha: 2019年4月25日15:22:18
        // var udpDataBuff = new Buffer(25);
        // for(var i = 0; i<24; i++){
        //     udpDataBuff[i] = i;
        // }
        // global.udpServer.getUdpServer.send(udpDataBuff,0,udpBuff.length,2018,'153.1.1.144');
		//查看UDP服务器工作状态
		var dataToFront = InnerCheckUdpServer();
		console.log("/startUdpServer Sent to Front"+dataToFront);
		return(dataToFront);
	}

	this.startTcpServer = function(){
		console.log("run the Tcp Start Process");
		global.tcpServer =new tcpServer();
		//global.tcpServer = tcpServer.tcpServer();
		//global.tcpServer = new tcpServer();
		//global.tcpServer.startTcpServer();
		//查看TCP服务器工作状态
		var dataToFront = InnerCheckTcpServer();
		console.log("/startTcpServer Sent to Front"+dataToFront);
		return(dataToFront);
	}
    
	this.getUdpData = function(){
			console.log("UDP Data is:"+global.udpServer.getData());    
	}

	this.getTcpData = function(){
			console.log("TCP data is:"+global.tcpServer.getData());
	}
	
	function InnerCheckUdpServer(){
		//取回UDP Server正在工作的状态，是running还是stopped
		var dataToFront = Array();
		dataToFront[0] = "success";
		dataToFront[1] = global.udpServer.getServerStatus()['status'];
		dataToFront[2] = global.udpServer.getServerStatus()['address'];
		dataToFront[3] = global.udpServer.getServerStatus()['port'];
		return(JSON.stringify(dataToFront));
	}

	function InnerCheckTcpServer(){
		//取回UDP Server正在工作的状态，是running还是stopped
		var dataToFront = Array();
		dataToFront[0] = "success";
		dataToFront[1] = global.tcpServer.getServerStatus()['status'];
		dataToFront[2] = global.tcpServer.getServerStatus()['address'];
		dataToFront[3] = global.tcpServer.getServerStatus()['port'];
		return(JSON.stringify(dataToFront));
	}

	//传入userName,pwd,res
	this.login = function (userName,pwd,req,res){
		//判断是否存在该用户
		users.isUserExist(userName,function(result){
			//若用户存在
			if(result){
				console.log("checking NAME:"+userName+";PWD："+pwd);
				//将传入的pwd进行MD5加密
				//var pwdMD5 = md5.update(pwd).digest('base64');
				var pwdMD5 = crypto.createHash('md5').update(pwd).digest('base64');
				//查找符合用户名和密码的用户
				var query = users.find();
				query.where("username",userName);
				//比对MD5加密后的密码
				// by Siepha: 去掉MD5加密,要什么MD5加密，反正都能在线解密
				//query.where("pwd",pwdMD5);
				query.where("pwd",pwd);
				query.exec(function(err,docs){

						//如果没有符合用户名密码
						if(docs.length==0){
								res.end("PassWordError"); 
						}else{
						//找到匹配的用户名密码       
							 //建立session
							 if(req.session.username == null){
								req.session.userID = docs[0]._id;
								req.session.username = userName;
								req.session.role = docs[0].role; 
								req.session.access = docs[0].access; 
								req.session.userIP = docs[0].userIp; 
								req.session.fingerID = docs[0].fingerID;
								console.log("Creat Session userID:"+req.session.userID);
								console.log("Creat Session username:"+req.session.username);
								console.log("Creat Session role:"+req.session.role); 
								console.log("Creat Session access:"+req.session.access); 
								console.log("Creat Session userIP:"+req.session.userIP);
							 }
							 res.end("LoginSuccess");
						}
				})
				
			}else{
				//用户不存在
				res.end("User Not Found");
			}  
		})
	}
    
}




module.exports = common;

