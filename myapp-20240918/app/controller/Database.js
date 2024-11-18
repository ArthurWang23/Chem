var express = require('express');
var mongoose = require('mongoose');

var mongoose = require('mongoose'); 
var SuccessDataSchema = require('../model/successdata.js');
var app = require('../myapp/app.js');


// API端点处理分页  
app.get('/data', async (req, res) => {  
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = 10; // 每页显示的记录数  
    const skip = (page - 1) * limit; // 跳过的记录数 

try {  
    const data = await SuccessData.find().skip(skip).limit(limit);  
    const totalCount = await SuccessData.countDocuments({}); // 总记录数  
    const totalPages = Math.ceil(totalCount / limit); // 总页数  
    
    res.json({  
        data,  
        totalCount,  
        totalPages,  
        currentPage: page  
    });  
    } catch (error) {  
    res.status(500).json({ error: error.message });  
    }  
});  
      
    app.listen(3000, () => {  
      console.log('Server is running on port 3000');  
    });