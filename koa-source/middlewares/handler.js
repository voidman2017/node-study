exports.error = async(ctx, next) =>{
    await next();
    switch( ctx.status ){
        case 404:
            console.log(`访问地址不存在${ ctx.url}`);
            await ctx.render("error/404");
            break;
        case 500:
            console.log('服务器异常')
            await ctx.render("error/500");
    }
   
}


exports.render = async(ctx, next) => {
    const { tplPath = "" } = ctx.state;
    if(tplPath){
        await ctx.render( tplPath );
    }else{
        await next();
    }
}