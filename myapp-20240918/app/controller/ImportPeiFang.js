// 读取自动模式配方excel
const xlsx = require('xlsx');

let path = require('path');  
let absolutePath = path.join(__dirname, 'peifang.xlsx');  //不知道为啥，使用相对路径一直找不到文件报错

var AutoModePeiFang = {
  num:0,

  order:[],  //buffer数组

  importPeiFang:function(){
    try {  
      let workbook = xlsx.readFile(absolutePath); 
      console.log("读取配方peifang.xlsx文件：",workbook); 
      let sheetNames = workbook.SheetNames;
      // console.log("读取当前workbook的sheet有：",sheetNames);
      // 获取第一个workSheet
      let sheet1 = workbook.Sheets[sheetNames[0]];
      // console.log("读取当前workbook第一页sheet:",sheet1); 
      let range = xlsx.utils.decode_range(sheet1['!ref']);
    
      let RowNum = range.e.r - range.s.r + 1;
      let ColNum = range.e.c - range.s.c + 1;
      //确保配方文件数据只有1列
      if(ColNum != 1)
      {
        console.error("配方文件格式错误！请修改重新执行");    
      }
      else{
        let row_value = [];
        //循环获取单元格值
        for (let R = range.s.r; R <= range.e.r; ++R)
        {
          for (let C = range.s.c; C <= range.e.c; ++C) 
          {
            let cell_address = {c: C, r: R}; //获取单元格地址
            let cell = xlsx.utils.encode_cell(cell_address); //根据单元格地址获取单元格
            //获取单元格值
            if (sheet1[cell]) {
              // 如果出现乱码可以使用iconv-lite进行转码
              // row_value += iconv.decode(sheet1[cell].v, 'gbk') + ", ";
              row_value.push(sheet1[cell].v) ;
            } else {
              // row_value += ", ";
            }
          }
        }
        this.num = row_value.length;
        console.log("配方指令共有",row_value.length,"条");
    
        //将指令转为buffer形式
        for(var i=0; i<row_value.length; i++)
        {
          var type = typeof row_value[i];
          if(type === 'number')
          {
            var buffer = Buffer.alloc(1);
            buffer.writeInt8(row_value[i],0);
            this.order.push(buffer);
          }
          else if(type === 'string')
          {
            var size = row_value[i].length
            var buffer = Buffer.alloc(size);
            var str = row_value[i];
            var j = 0;
            for (let char of str) {          
              const charCode = char.charCodeAt(0);  
              if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {  
                buffer[j] = charCode - '0'.charCodeAt(0); // 数字字符转换为0-9的数值  
              } else if (charCode === '@'.charCodeAt(0)) {  
                buffer[j] = 0x40; // 非数字字符'@'转换为0x40  
              } else {  
                console.error("配方第",i+1,"条第",j+1,"位出现非法字符！");
                buffer[j] = 0x3f; // 非法字符转换为"?" 
              }  
              j++;  
            }  
            this.order.push(buffer);
          }
          
        }
        console.log("指令明细：",AutoModePeiFang);
        
      }
      
    } catch (error) {  
      console.error('读取自动模式配方peifang.xlsx文件失败：', error);  
    }
  },

  init:function(){
    this.num = 0;
    this.order = [];
  },
};
// 生成配方
var  generate_comms= {
  num:0,
  order:[],  //buffer数组
  comms:function(row){
    var row_value=row
    try {  
        //将指令转为buffer形式
        for(var i=0; i<row_value.length; i++)
        {
          var type = typeof row_value[i];
          if(type === 'number')
          {
            var buffer = Buffer.alloc(1);
            buffer.writeInt8(row_value[i],0);
            this.order.push(buffer);
          }
          else if(type === 'string')
          {
            var size = row_value[i].length
            var buffer = Buffer.alloc(size);
            var str = row_value[i];
            var j = 0;
            for (let char of str) {          
              const charCode = char.charCodeAt(0);  
              if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {  
                buffer[j] = charCode - '0'.charCodeAt(0); // 数字字符转换为0-9的数值  
              } else if (charCode === '@'.charCodeAt(0)) {  
                buffer[j] = 0x40; // 非数字字符'@'转换为0x40  
              } else {  
                console.error("配方第",i+1,"条第",j+1,"位出现非法字符！");
                buffer[j] = 0x3f; // 非法字符转换为"?" 
              }  
              j++;  
            }  
            this.order.push(buffer);
          }
          
        }
        console.log("指令明细：",generate_comms,this.order[0]);
    }catch(error){  
      console.error('生成失败：', error);  
    }
  },
  init:function(){
    this.num = 0;
    this.order = [];
  },
}


let absolutePath2 = path.join(__dirname, 'clean.xlsx');  //不知道为啥，使用相对路径一直找不到文件报错

var cleanProc = {
  num:0,

  order:[],  //buffer数组

  importCleanProc:function(){
    try {  
      let workbook = xlsx.readFile(absolutePath2); 
      console.log("读取清洗流程clean.xlsx文件：",workbook); 
      let sheetNames = workbook.SheetNames;
      // console.log("读取当前workbook的sheet有：",sheetNames);
      // 获取第一个workSheet
      let sheet1 = workbook.Sheets[sheetNames[0]];
      // console.log("读取当前workbook第一页sheet:",sheet1); 
      let range = xlsx.utils.decode_range(sheet1['!ref']);
    
      let RowNum = range.e.r - range.s.r + 1;
      let ColNum = range.e.c - range.s.c + 1;
      //确保配方文件数据只有1列
      if(ColNum != 1)
      {
        console.error("清洗文件格式错误！请修改重新执行");    
      }
      else{
        let row_value = [];
        //循环获取单元格值
        for (let R = range.s.r; R <= range.e.r; ++R)
        {
          for (let C = range.s.c; C <= range.e.c; ++C) 
          {
            let cell_address = {c: C, r: R}; //获取单元格地址
            let cell = xlsx.utils.encode_cell(cell_address); //根据单元格地址获取单元格
            //获取单元格值
            if (sheet1[cell]) {
              // 如果出现乱码可以使用iconv-lite进行转码
              // row_value += iconv.decode(sheet1[cell].v, 'gbk') + ", ";
              row_value.push(sheet1[cell].v) ;
            } else {
              // row_value += ", ";
            }
          }
        }
        this.num = row_value.length;
        console.log("清洗指令共有",row_value.length,"条");
    
        //将指令转为buffer形式
        for(var i=0; i<row_value.length; i++)
        {
          var type = typeof row_value[i];
          if(type === 'number')
          {
            var buffer = Buffer.alloc(1);
            buffer.writeInt8(row_value[i],0);
            this.order.push(buffer);
          }
          else if(type === 'string')
          {
            var size = row_value[i].length
            var buffer = Buffer.alloc(size);
            var str = row_value[i];
            var j = 0;
            for (let char of str) {          
              const charCode = char.charCodeAt(0);  
              if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {  
                buffer[j] = charCode - '0'.charCodeAt(0); // 数字字符转换为0-9的数值  
              } else if (charCode === '@'.charCodeAt(0)) {  
                buffer[j] = 0x40; // 非数字字符'@'转换为0x40  
              } else {  
                console.error("清洗指令第",i+1,"条第",j+1,"位出现非法字符！");
                buffer[j] = 0x3f; // 非法字符转换为"?" 
              }  
              j++;  
            }  
            this.order.push(buffer);
          }
          
        }
        console.log("清洗指令明细cleanProc：",cleanProc);
        
      }
      
    } catch (error) {  
      console.error('读取清洗指令clean.xlsx文件失败：', error);  
    }
  },

  init:function(){
    this.num = 0;
    this.order = [];
  },
};

module.exports = {AutoModePeiFang,cleanProc,generate_comms};
