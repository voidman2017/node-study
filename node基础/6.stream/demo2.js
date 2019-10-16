
const fs = require('fs');
const path = require('path');
const rPath = (url) => path.join(__dirname, url);

/* 可写流 默认要占用 highWaterMark: 16384 = 16k */
const ws = fs.createWriteStream(rPath('./2.html'), { highWaterMark: 20 });
console.log(ws)
/* 可写流有两个方法 write end  
rs.write() 可写流进行数据写入的时候必须是字符串或者buffer类型
rs.end() end 之后不能再调用write
*/
var flag1 = ws.write('哈哈');
console.log(1,flag1)
var flag2 = ws.write('呵呵');
console.log(2,flag2)
var flag3 = ws.write('嗯嗯');
console.log(3,flag3)
var flag4 = ws.write('哦哦');
console.log(4,flag4)
ws.end('写完了')
