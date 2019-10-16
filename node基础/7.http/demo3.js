/* 跨域问题 */

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


const clinet = http.createServer((req, res) => { //监听函数，当请求到来时会执行回调函数
    const { pathname, query } = url.parse(req.url, true);//true的作用是将 query 转化成一个对象
    if (pathname.match(/^\/proxy/)) {//本地服务代理转发实现跨域
        const targetServe = {
            '/proxy/api': 'http://127.0.0.1:3001',
            '/proxy/common': 'http://127.0.0.1:3002'
        }
        var targetUrl;
        const t = Object.keys(targetServe).some((source) => {
            const r = pathname.match(source),
                target = targetServe[source]
            if (r) {
                targetUrl = pathname.replace(source, target)
            }
            return r
        })
        http.get(targetUrl, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                res.end(data)
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } else { //静态服务
        fs.stat(_path(pathname), (err, stats) => {
            if (err) {
                res.statusCode = 404;
                res.end(`${pathname} not fount`)
            } else if (stats.isFile()) {//访问路径是文件
                const extName = pathname.match(/\.\w+$/)[0]; //文件类型
                res.setHeader('Content-Type', MIME[extName])
                fs.createReadStream(_path(pathname)).pipe(res);
            } else if (stats.isDirectory()) { //访问路径是目录
                res.setHeader('Content-Type', MIME['.html'])
                fs.createReadStream(_path(pathname, './index.html')).pipe(res)
            }
        })
    }

})
clinet.listen(3000, () => {
    console.log('app start on http://127.0.0.1:3000')
})

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true)
    const data = { "port": "3001", "name": "bluesbonewong", "age": 16, pathname }
    // 1、jsonp
    /* const { pathname, query } = url.parse(req.url, true)
    const { callback = 'fn' } = query;
    res.end(`${callback}(${JSON.stringify(data)})`) */

    // 2、服务端cors
    /* res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    res.end(`${JSON.stringify(data)}`) */

    // 3.服务端跨域
    res.end(`${JSON.stringify(data)}`)
})
server.listen(3001, () => {
    console.log('server start on http://127.0.0.1:3001')
})

const server2 = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true)
    const data = { "port": "3002", "name": "bluesbonewong", "age": 16, pathname }
    res.end(`${JSON.stringify(data)}`)
})
server2.listen(3002, () => {
    console.log('server start on http://127.0.0.1:3002')
})

