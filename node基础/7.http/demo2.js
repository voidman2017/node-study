const fs = require("fs");
const http = require("http");
const path = require('path');
const url = require('url');
function _path() {
    return path.join(__dirname, ...arguments)
}

const MIME = {
    ".js": "application/javascript;charset=utf8",
    ".css": "text/css;charset=utf8",
    ".html": "text/html;charset=utf8"
}


const server = http.createServer((req, res) => { //监听函数，当请求到来时会执行回调函数
    const { pathname, query } = url.parse(req.url, true);//true的作用是将 query 转化成一个对象
    fs.stat(_path(pathname), (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.end(`${pathname} not fount`)
        } else if (stats.isFile()) {//访问路径是文件
            const extName = pathname.match(/\.\w+$/)[0]; //文件类型
            res.setHeader('Content-Type',MIME[extName])
            fs.createReadStream(_path(pathname)).pipe(res);
        } else if (stats.isDirectory()) { //访问路径是目录
            res.setHeader('Content-Type',MIME['.html'])
            fs.createReadStream(_path(pathname, './index.html')).pipe(res)
        }
    })
})
server.listen(3001, () => {
    console.log('app start on http://127.0.0.1:3001')
})