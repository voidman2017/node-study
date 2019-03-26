function log(ctx,type) {
    console.log(ctx.method, ctx.header.host + ctx.url, type)
}

exports.generator = function* (next) {
    // 执行中间件的操作
    log(this,'generator');
    if (next) {
        yield next
    }
}

exports.async = async function (ctx, next) {
    log(ctx,'async');
    await next()
}