const express   = require('express');
const logger    = require("../util/log4js");
const router    = express.Router();
const _         = require("underscore");



// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
    const params = req.query;
    const relaIP = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    console.log('1')
    req["dataPacket"] = {};
    _.extend(req.dataPacket, {
        "params" : params,
    });
    logger.info(req.path, relaIP, new Date);
    logger.log('%s %s %s %s', req.method, req.url, req.path, Date.now());
    next();
});

//测试启动页面
router.get("/test",function(req, res, next){
    console.log(2)
    _.extend(req.dataPacket,{
        num:3
    })
    next();
}, function (req, res, next) {
    res.render("test/index" , req );
});

module.exports = router;