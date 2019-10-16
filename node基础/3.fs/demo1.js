/* 
读取类型都是 buffer， 写入的时候是 utf8
读取的文件必须是存在的，写入的文件不存在会自动创建，如果已存在的文件会覆盖其内容
使用 fs 模块,分别都有对应的同步和异步方法
fs.write | fs.writeSync
fs.writeFile | fs.writeFileSync
fs.read | fs.readSync
fs.readFileSync | fs.readFile
*/

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const getPath = (url) => path.join(__dirname, url);

/* 复制文件内容到另一文件 */
/* 1.同步读取写入 */
const copySync = (source, target) => {
    let result = fs.readFileSync(source);
    fs.writeFileSync(target, result)
}
copySync(getPath('./1.txt'), getPath('./2.txt'))

/* 2.异步回调 */
const copyCallback = (source, target) => {
    fs.readFile(source, (err, data) => {
        if (err) return console.log(err)
        fs.writeFile(target, data, (err) => {
            if (err) return console.log(err)
            console.log('拷贝成功')
        })
    })
}
copyCallback(getPath('./1.txt'), getPath('./3.txt'));

/* 3.promise */
const read = promisify(fs.readFile)
const write = promisify(fs.writeFile);
read(getPath('./1.txt'), 'utf-8')
    .then((data) => {
        return write(getPath('./4.txt'), data)
    })
    .then(() => {
        console.log('拷贝成功')
    })
    .catch((err) => {
        console.log('err')
    })