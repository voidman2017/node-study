async function cookie(ctx,next){
    if(~ctx.url.indexOf('/cookieset')){
        const params = ctx.query;
        Object.keys(params).forEach(key => {
            const val = params[key]
            ctx.cookies.set(
                key,val,
                {
                    domain:'localhost',
                    path:'',
                    maxAge:10 * 60 * 1000,
                    expires:new Date('2019-03-27'),
                    httpOnly:false,
                    overwrite:false
                }
            )
        });
        ctx.body = 'cookie is ok'
    }

    if(~ctx.url.indexOf('/cookieget')){
        const params = ctx.query;
        let res = [];
        Object.keys(params).forEach(key => {
            const cookie = ctx.cookies.get(key);
            cookie && res.push(cookie)
        })
        ctx.body = res;
    }
    await next();
}
module.exports = cookie;