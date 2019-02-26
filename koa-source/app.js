const CONF = require("./config");
const Koa = require("./src/koa");
const koaEjs = require("./src/koa-ejs");
const path = require('path');
const routes = require("./routes");
const Middle = require("./middlewares");


const app = new Koa();

koaEjs(app, {
    root: path.join(__dirname, "views"),//路径
    viewExt: "ejs",//后缀
    layout: false,//layout布局
    cache: false,//缓存
    debug: false,//dubug
});

app.use( Middle.Handler.error );

//应用路由
app.use(routes.routes());

app.listen(CONF.PORT, () => {
    console.log("运行环境", process.env.NODE_ENV);
    console.log("listen port", CONF.PORT)
});