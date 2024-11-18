//xy:
// 本文件定义mongodb数据库存储用户信息的model
var mongoose = require('mongoose'); //xy：这里注意mongoose版本@6.9.2，过高会有报错。
//xy:Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var Schema = mongoose.Schema;

// model's data structure
var userSchema = new Schema({
	username: { type: String, unique: true },
	pwd: String,
	role: String,
	access: Number,
	fingerOn: { type: Boolean, default: false },
	fingerID: Number,
	userIp: String,
	fingerAuthed: { type: Boolean, default: false }
}, { collection: 'users' });



// compile model
var users = mongoose.model('users', userSchema);


// hang a method for check user is exist or not
users.isUserExist = function (username, callback) {
	var query = users.count();
	query.where('username', username);
	query.exec(function (err, count) {

	console.log("find " + username + " count:" + count);
	if (count > 0) callback(true);
	else if (count == 0) callback(false);
	});
}

module.exports = users;


