const http = require('http');
const server = http.createServer((req,res)=>{ //监听函数，当请求到来时会执行回调函数
    res.setHeader('Content-Type','text/plain;charset=utf8'); //相应内容的MIME类型
    res.end('哈哈')
})
server.listen(3000,()=>{
    console.log('app start on http://127.0.0.1:3000')
})