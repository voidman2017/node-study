const fs = require("fs");
exports.index = async(ctx, next) =>{
    const { filename ="" } = ctx.params;
    const tplPath = `static/${filename}`;
    Object.assign( ctx.state, {tplPath} );
    await next();
}