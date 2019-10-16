const fs = require('fs');
const path = require('path');
const util = require('util');

const json1 = path.join(__dirname, './1.json');
const json2 = path.join(__dirname, './2.json');

/* fs 读取文件 */
fs.readFile(json1, 'utf-8', function (err, data) {
    if (err) return console.log(err)
    console.log(data)
})

/* promise进行封装 */
const read = (url) =>
    new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })

read(json1).then((data) => {
    console.log('read成功读取：', data)
}, (err) => {
    console.log('read读取失败：', err)
})

read(json2).then((data) => {
    console.log('read成功读取：', data)
}, (err) => {
    console.log('read读取失败：', err)
})


/* until.promisify 将老式的Error first callback转换为Promise对象 */
const readFile = util.promisify(fs.readFile);
readFile(json1, 'utf-8').then((data) => {
    console.log('readFile成功读取：', data)
}, (err) => {
    console.log('readFile读取失败：', err)
})

readFile(json2, 'utf-8').then((data) => {
    console.log('readFile成功读取：', data)
}, (err) => {
    console.log('readFile读取失败：', err)
})
