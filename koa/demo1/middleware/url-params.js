// GET请求数据获取
/**
 * 获取GET请求数据源头是koa中request对象中的query方法或querystring方法，query返回是格式化好的参数对象，querystring返回的是请求字符串，
 * 由于ctx对request的API有直接引用的方式，所以获取GET请求数据有两个途径
 * @param {*} ctx 
 * @param {*} next 
 */
async function METHODS_GET(ctx, next) {
    if (ctx.method === 'GET') {
        const { url, request } = ctx;
        // 从上下文的request对象中获取
        const req_query = request.query;
        const req_querystring = request.querystring;
        // 从上下文中直接获取
        const ctx_query = ctx.query;
        const ctx_querystring = ctx.querystring;
        /**
         * 这里发现从ctx和request中获取的数据是一样的，原因在于koa的application.js中的createContext；
         * createContext 创建 context 的时候，还会将 req 和 res 分别挂载到context 对象上，并对req 上一些关键的属性进行处理和简化 挂载到该对象本身，简化了对这些属性的调用
         */
        // 访问http://localhost:7766/index?name=jack&age=24
        let params = {
            url,
            req_query,
            req_querystring,
            ctx_query,
            ctx_querystring
        }
        console.log(`get params:`, params)
    }
    await next();
}


// POST请求参数获取
/**
 * 对于POST请求的处理，koa2没有封装获取参数的方法，
 * 需要通过解析上下文context中的原生node.js请求对象req，将POST表单数据解析成query string（例如：a=1&b=2&c=3），再将query string 解析成JSON格式
 * @param {*} ctx 
 * @param {*} next 
 */
async function METHODS_POST(ctx, next) {
    if (ctx.url === '/form' && ctx.method === 'GET') {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>form</title>
                <link rel="stylesheet" href="/static/css/form/input.css">
            </head>
            <body>
                <h1>koa2 request post demo</h1>
                <form method="POST" action="/form">
                    <label for="userName">userName</label>
                    <input name="userName" id="userName" /><br />
                    <label for="nickName">nickName</labe>
                        <input name="nickName" id="nickName" /><br />
                        <label for="email">email</label>
                        <input name="email" id="email" /><br />
                        <label for="phone">phone</label>
                        <input name="phone" id="phone" type="number" /><br />
                        <button type="submit">submit</button>
                </form>
                <script src="/static/js/form/input.js"></script>
            </body>
            </html>
        `;
        ctx.body = html;
    } else if (ctx.url === '/form' && ctx.method === 'POST') {

        // 当POST请求的时候，解析POST表单里的数据，并显示出来
        // let postData = await parsePostData(ctx)
        // 使用koa-bodyparser中间件可以把koa2上下文中的formData数据解析到ctx.request.body中
        let postData = ctx.request.body
        ctx.body = postData;
    }
    await next();
}


// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end", function () {
                let parseData = parseQueryStr(postdata)
                resolve(parseData)
            })
        } catch (err) {
            reject(err)
        }
    })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
    let queryData = {}
    let queryStrList = queryStr.split('&')
    console.log(queryStrList)
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=')
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData
}


module.exports = {
    METHODS_GET,
    METHODS_POST
}
