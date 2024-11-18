// 本文件定义mongodb数据库存储用户信息的model
var mongoose = require('mongoose'); //这里注意mongoose版本@6.9.2，过高会有报错。
//Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var Schema = mongoose.Schema;

// 定义一个名为SuccessDataSchema的Schema对象，用于描述success_data集合中的文档结构
var SuccessDataSchema = new Schema({
	ExperimentalPeriod: String,
	Experimenter: String,
    ReagentName: String,
    Concentration: String,
    FlowVelocity: String,
    ReactorTemperature: String,
    ReactorVolume: String,
    ReactionTime: String,
    ProductivityRate: String,
    PercentConversion: String
},{
    // 指定这个Schema映射的MongoDB集合名为'success_data'
    collection: 'success_data'
});

// 使用SuccessDataSchema创建一个名为'success_data'的Mongoose模型 
var success_data = mongoose.model('success_data', SuccessDataSchema);
// 将这个模型导出，以便在其他文件中使用 
module.exports = success_data;