const bodyParser    = require("body-parser");
const express       = require('express');
const path          = require('path');
const ejs           = require("ejs");
const app = express();

//加载路由配置
const  router_main = require("./router");


//静态资源文件目录
app.use("/static", express.static(__dirname + "/static"));
app.use('/public', express.static('public'));


//中间件设置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//页面模板引擎配置
// app.locals = require("./util/ejs_util");     //ejs模板辅助方法
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");


var server = app.listen(9527, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});



app.use("/", router_main);