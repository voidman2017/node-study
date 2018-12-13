const Router = require('koa-router');
const router = new Router();



router.get('/', async (ctx, next) => {
    ctx.body = 'hello people';
    await next()
});

router.get('/list', async (ctx, next) => {
    ctx.body = 'list';
});

module.exports = router;