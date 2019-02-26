const route = require("koa-router")();
const Ctrl = require("../controller");
const Middle = require("../middlewares");



//token 校验
// route.use("/", Middle.User.checkToken);


/*======  首页路由  ======*/
route.get("/", Ctrl.Home.index, Middle.Handler.render );

/*======  静态页面  ======*/
route.get("/static/:filename", Ctrl.Static.index, Ctrl.Render.PC );

module.exports = route;