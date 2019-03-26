const Router = require('koa-router');
const router = new Router();



router.get('/', async (ctx, next) => {
    ctx.body = 'hello people';
    await next()
});

router.get('/list', async (ctx, next) => {
    let title = 'list page';
    await ctx.render('list',{
        title
    })
});


module.exports = router;