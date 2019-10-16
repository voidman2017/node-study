console.log('module2-in')
const Module3 = require('./3')


class Module2 {
    constructor(name) {
        this.name = name;
    }
    sum(a, b) {
        return a + b;
    }
}
Module2.id = 2;

var start = Date.now();
for (; ;) {
    if (Date.now() - start > 3000) {
        break;
    }
}

console.log('module2-export')
// 导出模块
exports.Module2 = Module2;
// this.Module2 = Module2;