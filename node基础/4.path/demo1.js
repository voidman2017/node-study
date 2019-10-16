/* 
path
*/
const path = require('path');
// 拼一个路径

console.log(path.join('./a'))
console.log(path.resolve('./a'))

console.log(path.join('./a','./b'))
console.log(path.resolve('./a','./b'))

console.log(path.join(__dirname,'./a'))
console.log(path.resolve(__dirname,'./a'))

console.log(path.join(__dirname,'./a','./b'))
console.log(path.resolve(__dirname,'./a','./b'))



console.log(path.delimiter); //环境变量分隔符

console.log(path.posix.sep); //路径分隔符