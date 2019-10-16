console.log('module3-in')
class Module3 { }

var start = Date.now();
for (; ;) {
    if (Date.now() - start > 3000) {
        break;
    }
}

console.log('module3-export')
module.exports = Module3 ;
