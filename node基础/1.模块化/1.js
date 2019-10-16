/* 
模块化的好处： 低耦合 高内聚 方便维护 防止代码冲突 防止命名冲突
模块化分类： CMD （代表作：seajs）就近依赖 ；AMD 依赖前置 （代表作：requirejs） （浏览器端的模块化）

node 基于规范 commonjs 文件的读写，天生自带模块化
1. 定义创建模块：一个js文件就是一个模块
2. 导出模块： exports/modlue.exports 
3. 使用（引入）模块： require 需要使用的模块文件

导出模块推荐有两种方式： exports / module.exports
实际上 exports === module.exports === this
一般上如果直接导出一个完整的模块，使用 module.exports = xxx;
如果导出是包含多个对象，使用 exports.xxx = xxx;
不可以使用 exports = xxx；

模块引入模块是同步执行的

引用文件的拓展名顺序：extensions: .js-> .json ->.node (通过console.log(require)可以查看)
*/
console.log('module1-in')
console.log(exports === module.exports);
console.log(exports === this);
console.log(module.exports === this);


// 使用模块
const {Module2} = require('./2');
const module2 = new Module2;


console.log(module2.sum(1,2))
