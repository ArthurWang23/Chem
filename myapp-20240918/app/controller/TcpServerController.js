//xy: export commonlib模板库中的tcpserver中所需要的函数

var commonlib = require('../common/commonlib');

var commonObj = new(commonlib);

exports.startTcpServer = function(req){
	var dataToFront = commonObj.startTcpServer(req);
	return (dataToFront);
}

exports.checkTcpServer = function(){
	var dataToFront = commonObj.checkTcpServer();
	return (dataToFront);
}
