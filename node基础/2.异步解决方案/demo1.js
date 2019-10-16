/* 
异步关联
场景：读取 1.txt 的内容中的路径，再进行读取，获得最终的内容
*/
const fs = require('fs');
const path = require('path');
const getPath = (url) => path.join(__dirname, url);
const txt1Path = getPath('./1.txt');


function log(content,color){
    // console.log(`${content}`)
    console.log(`%c ${content}`,`color:${color}`)
}

/* 1.同步方式 
优点：代码易读
缺点：造成代码阻塞
*/
var txt2Path = getPath(fs.readFileSync(txt1Path, 'utf-8'));
var txt3Path = getPath(fs.readFileSync(txt2Path, 'utf-8'));
var content = fs.readFileSync(txt3Path, 'utf-8');
log(`同步读取:${content}`,"black");


/* 2.异步读取（callback）
优点：异步不会造成代码阻塞
缺点：回调造成代码可读性差，难以维护（代码出错不易排查，改变需求不易更改）。
 */
fs.readFile(txt1Path, 'utf-8', (err, path) => {
    if (err) return error(err);
    fs.readFile(getPath(path), 'utf-8', (err, path) => {
        if (err) return error(err);
        fs.readFile(getPath(path), 'utf-8', (err, content) => {
            if (err) return error(err);
            log(`异步读取（callback）：${content}`,'#000')

        })
    })
})


/* 3.异步（promise封装） 
优点：解决了回调地狱的问题，将异步操作以同步操作的流程表达出来。代码易读性相对高一些，可维护性更强
缺点：无法取消promise。如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。当处于Pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。当执行多个Promise时，一堆then看起来也很不友好。
*/
const read = (url) =>
    new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) return reject(err);
            resolve(data)
        })
    })

read(txt1Path)
    .then((path) => {
        log(`read第一次读取：${path}`,'red')
        return read(getPath(path)); //return可以返回一个promise实例，会把执行结果传入到下一个then中
    })
    .then((path) => {
        log(`read第二次读取：${path}`,'red')
        return read(getPath(path))
    })
    .then((content)=>{
        log(`对内容进行封装`,'red')
        return 'read最终读取内容:' + content; // return可以直接返回一个不是一个promise实例，会直接传入下一个then中
    })
    .then((content)=>{
        log(content,'red')
    })
    .catch((err) => {
        log(`读取失败read:${err}`,'red')
    })

/* 4.利用util.promisify进行封装，和上述类似。只是util.promisify简化了封装过程 */

/* 5，async/await 
优点：内置执行器，比Generator操作更简单。async/await比 *yield语义更清晰。返回值是Promise对象，可以用then指定下一步操作。代码更整洁。可以捕获同步和异步的错误。
注意点：
太同步化。async/await会将当前一步操作变成类同步化执行，适用场景往往是相互关联的异步操作需要对其进行同步化操作。
但是没有任何关联的异步操作，还是应该避免这样的写法。可以适用promise.all这些操作进行优化。
*/
async function getContent(){
    let txt2Path = await read(txt1Path);
    log(`async/await-txt2Path：${txt2Path}`,'green')
    let txt3Path = await read(getPath(txt2Path));
    log(`async/await-txt3Path：${txt3Path}`,'green')
    let content = await  read(getPath(txt3Path));
    log(`async/await-content：${content}`,'green')
}
getContent();