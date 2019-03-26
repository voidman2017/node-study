const CONF = require('./config');
const convert = require('koa-convert');
const cookie = require('./middleware/cookie');
const urlParams = require("./middleware/url-params");
const Koa = require('koa');
const koaParser = require('koa-bodyparser')
const koaStatic = require('koa-static');
const koaViews = require('koa-views');
const logger = require("./middleware/logger");
const path = require("path");
const router = require("./router");
const routerNative = require("./router/router-native");

const app = new Koa();

// 加载模板引擎
app.use(koaViews(path.join(__dirname, './views'), {
  extension: 'ejs'
}));


// 使用koa-static中间件
app.use(koaStatic(path.join(__dirname,"./assets")));


// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 使用koa-bodyParser解析中间件
app.use(koaParser());

// 使用cookie
app.use(cookie);

// logger
/** generator中间件需要使用koa-convert封装一下使用;
 * koa deprecated Support for generators will be removed in v3. 
 * See the documentation for examples of how to convert old middleware https://github.com/koajs/koa/blob/master/docs/migration.md app.js:26:5*/
app.use(convert(logger.generator));
app.use(logger.async);



// 请求数据获取
app.use(urlParams.METHODS_GET);//get请求数据获取
app.use(urlParams.METHODS_POST);//post请求数据获取


// router
// app.use(routerNative()); //手写实现router
app.use(router.routes()); // 使用koa-router



app.listen(CONF.PORT, () => {
  console.log("运行环境", process.env.NODE_ENV);
  console.log("listen port", `http://localhost:${CONF.PORT}`)
});