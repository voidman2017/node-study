const fs = require("fs");
class Render{
    async PC(ctx, next){
        const basePath = `${process.cwd()}/views`;
        const { tplPath = "" } = ctx.state;
        const absoluetePath = `${basePath}/${tplPath}.ejs`
        if( fs.existsSync( absoluetePath ) ){
            await ctx.render( tplPath );
        }
        await next();
    }
}
module.exports = new Render;