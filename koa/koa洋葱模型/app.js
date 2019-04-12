const Koa = require("koa");
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

const redirect_url = [
    { origin: '/c_h5', target: '/b/h5' },
    { origin: '/c', target: '/b' },
]

/* 重定向路由优先 */
// app.use( async(ctx, next)=>{
//     const { url } = ctx;
//     if(ctx.status != '200'){
//         if(url === '/a') ctx.redirect('/b')
//     }
//     await next();
// })



/* 当前路由优先 */
app.use(async (ctx, next) => {
    const { url } = ctx;
    await next();
    if (ctx.status != '200') {
        redirect_url.some((item) => {
            const { origin, target } = item;
            if (~url.indexOf(origin)) {
                const targetUrl = url.replace(origin, target)
                ctx.redirect(targetUrl);
                ctx.status = 301;
                return true
            }
        })
    }
})

router.get('/a', async (ctx, next) => {
    ctx.body = 'page a';
    await next()
});

router.get('/b', async (ctx, next) => {
    ctx.body = 'page b';
    await next()
});

router.get('/b/h5', async (ctx, next) => {
    ctx.body = 'page b h5';
    await next();
})
//应用路由
app.use(router.routes());




app.listen(7766, () => {
    console.log("start")
});













