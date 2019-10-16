/* 异步结果同步输出
场景：读取多个不关联文件的内容，进行输出
*/

const fs = require('fs');
const path = require('path');
const eventproxy = require('eventproxy');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const getPath = (url) => path.join(__dirname, url);
const txt1Path = getPath('./1.txt');
const txt2Path = getPath('./2.txt');
/* 1.readFileSync同步读取
缺点：耗时
*/
var txt1 = fs.readFileSync(txt1Path, 'utf-8')
var txt2 = fs.readFileSync(txt2Path, 'utf-8')
console.log(1, { txt1, txt2 })

/* 2.readFile异步  回调嵌套
缺点：回调，耗时
*/
fs.readFile(txt1Path, 'utf-8', (err, txt1) => {
    if (err) return console.log(err)
    fs.readFile(txt2Path, 'utf-8', (err, txt2) => {
        if (err) return console.log(err)
        console.log(2, { txt1, txt2 })
    })
})

/* 3.readFile异步 哨兵模式
相较前两种耗时减少了，但是实现比较复杂
*/
const output = {}
function out() {
    if (output.txt1 && output.txt2) console.log(3, output)
}
fs.readFile(txt1Path, 'utf-8', (err, txt1) => {
    if (err) return console.log(err)
    output.txt1 = txt1
    out();
})
fs.readFile(txt2Path, 'utf-8', (err, txt1) => {
    if (err) return console.log(err)
    output.txt2 = txt2
    out();
})


/* 
4.eventproxy控制并发
*/

const ep = new eventproxy();
ep.all('txt1_event', 'txt2_event', function (txt1, txt2) {
    console.log(4, { txt1, txt2 })
})
fs.readFile(txt1Path, 'utf-8', (err, txt1) => {
    if (err) return console.log(err)
    ep.emit('txt1_event', txt1);
})
fs.readFile(txt2Path, 'utf-8', (err, txt2) => {
    if (err) return console.log(err)
    ep.emit('txt2_event', txt2);
})

/*5.promise.all 
 */
Promise.all([read(txt1Path, 'utf-8'), read(txt2Path, 'utf-8')]).then(data => {
    const [txt1, txt2] = data;
    console.log(5, { txt1, txt2 })
}).catch(err=>{
    console.log(err)
})

/* 6.async-await封装 */
async function result(){
    const [txt1, txt2] = await Promise.all([read(txt1Path, 'utf-8'), read(txt2Path, 'utf-8')]);
    console.log(6, { txt1, txt2 })
}
result();