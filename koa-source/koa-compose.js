function log(arg){
  console.log.apply(this,[`=== ${new Date().getTime()} === ${arg}`]);
}

const lg = (function (origin) {
  return function (str) {
      origin.call(console, "hello:" + str);
  }
})(console.log);



// compose函数需要传入一个数组队列 [fn,fn,fn,fn]
function compose (middleware) {
  // 如果传入的不是数组，则抛出错误
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 数组队列中有一项不为函数，则抛出错误
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} ctx
   * @return {Promise}
   * @api public
   */
  // compose函数调用后，返回的是以下这个匿名函数
  // 匿名函数接收两个参数，第一个随便传入，根据使用场景决定
  // 第一次调用时候第二个参数next实际上是一个undefined，因为初次调用并不需要传入next参数
  // 这个匿名函数返回一个promise
  return function (ctx, next) {
    // last called middleware #
    //初始下标为-1;可以理解成记录上一次的执行的中间件的索引值
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 传入的i理解成当前中间件的索引值
      // 如果当前中间件的索引值小于上一次的中间件的索引值， 返回一个Promise.reject携带着错误信息
      // 所以执行两次next会报出这个错误。将状态rejected，就是确保在一个中间件中next只调用一次
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // 执行一遍next之后,这个index值将改变
      index = i
       // 根据下标取出一个中间件函数
      let fn = middleware[i]
      // next在这个内部中是一个局部变量，值为undefined
      // 当i已经是数组的length了，说明中间件函数都执行结束，执行结束后把fn设置为undefined
       // 问题：本来middleware[i]如果i为length的话取到的值已经是undefined了，为什么要重新给fn设置为undefined呢？
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}


function mw1 (ctx, next) {
  log('middleware 1 start')
  log(ctx);
  setTimeout(() => {
    log(`inner1: ${ctx}`)
    next()
  }, 1000)
}

function mw2 (ctx, next) {
  log('middleware 2 start')
  log(ctx)
  next()
  log('middleware 2 end')
}

async function mw3 (ctx, next) {
  log('middleware 3 start')
  log(ctx)
  setTimeout(() => {
    log(`inner3: ${ctx}`)
  }, 1000)
  await next()
  log('middleware 3 end')
}

async function mw4 (ctx, next){
  log('middleware 4 start');
  await new Promise((resolve)=>{
    setTimeout(()=>{
      log(`inner4:${ctx}`);
      resolve();
    },2000);
  })
  
  next();
  log('middleware 4 end');
}


const run = compose([mw1, mw2, mw3, mw4])

// run('koa-compose', function () { log('all middleware done!') })


function fn1(ctx, next){
  log(`=== middleware1 start === ${ctx} ===`);
  ctx += ' changed' // -->1
  next();
  log(`=== middleware1 end === ${ctx} ===`);
}

function fn2(ctx, next){
  log(`=== middleware2 start === ${ctx} ===`);
  next();
  log(`=== middleware2 end === ${ctx} ===`);
}

const fn = compose([fn1, fn2]);
fn('ctxString',()=>{ console.log('all middleware end') })
/* {1}这里对传入的ctx进行操作（字符串拼接）；但是发现最后输出的时候是fn1的后面执行的代码中，ctx有改变；而fn2中的ctx并没有发生改变；
  其实这里就是闭包导致的问题。因为fn1和fn2不是同一个作用域
*/





/* 一步步拆解成下面的代码 */
function complie(ctx,next){
  return Promise.resolve(fn1(ctx,()=>{
    return Promise.resolve(fn2(ctx,()=>{
      next()
      return Promise.resolve('fn is undefined')
    }))
  }))
}
var ctx =  'complie';
// complie(ctx,()=>{ console.log(`=== all middleware end ===`) }).then(data=>{ })

