/* 
流 可读流和可写流
流：边读边写
*/
const path = require('path');
const fs = require('fs');
const getPath = (url) => path.join(__dirname, url);


/* 
highWaterMark 每次能读取多少 默认64k 
读取时默认 buffer 类型
*/
const rs = fs.createReadStream(getPath('./1.html'), { highWaterMark: 1 })
/* 
需要监听事件 内部会自动发布事件 rs.emit('data',数据)；
所以只需要对其事件类型进行订阅即可
默认data事件是不停的触发，直到文件中的数据全部读出来
*/
let arr = []
rs.on('data', (chunk) => {
    console.log(chunk)
    arr.push(chunk);
    rs.pause();
    setTimeout(()=>{
        rs.resume()
    },10)
})
rs.on('end',()=>{
    console.log(arr.join('').toString());
})


/* let arr = []
rs.on('data', (chunk) => {
    console.log(chunk)
    arr.push(chunk);
    rs.pause();
})
const timer = setInterval(()=>{
    rs.resume();
},10)
rs.on('end',()=>{
    clearInterval(timer); //这里需要最后清除定时器，否则程序将一直运行
    console.log(arr.join('').toString());
}) */
