/* 
fs.State 读取文件状态 
fs.mkdir 创建目录
*/
const fs = require('fs');
const path = require('path');
const getPath = (src) => path.join(__dirname, src);

/* 
fs.stat(getPath('./1.txt'),(err,stats)=>{
    console.log('./1.txt',stats)
    console.log('./1.txt是一个文件',stats.isFile())
    console.log('./1.txt是一个文件夹',stats.isDirectory())
})

fs.stat(getPath('./file'),(err,stats)=>{
    console.log('./file',stats);
    console.log('./file是一个文件',stats.isFile());
    console.log('./file是一个文件夹',stats.isDirectory());
})
 */

/* 递归创建文件夹 */
const mkdirDeep = (url) => {
    const dirList = url.split('/');
    let prev = 0;
    const mkdir = (p) => {
        if (dirList.length < prev) return
        fs.stat(p, (err, stats) => {
            if (err) {
                fs.mkdir(p, (err) => {
                    if (err) return console.log(err);
                    mkdir("./" + dirList.slice(0, ++prev + 1).join('/'))
                })
            } else {
                mkdir("./" + dirList.slice(0, ++prev + 1).join('/'))
            }
        })
    }
    mkdir(dirList[prev])
}
mkdirDeep('a/e/c/d')