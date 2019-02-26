
class HomeCtrl{
    async index(ctx, next){
        ctx.state={
            a : 1 ,
            list : [1,2,3,4,5,6]
        };
        const tplPath = 'home';
        Object.assign(ctx.state, {tplPath});
        await next();
    }
}

module.exports = new HomeCtrl;