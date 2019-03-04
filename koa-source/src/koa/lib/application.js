
'use strict';

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');

/* class A {
  constructor() {
    this.name = 'A';
    this.age = 24;
    this.list = [1, 2, 3, 4, 5];
    this[util.inspect.custom] = () => {
      const attr = only(this, 'name list');// const attr = only(this, ['name', 'list']);
      return attr;
    }
  }
}
const a = new A();
console.log(a) */


/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

/* 一： Koa类由此诞生，它继承自Events，可得知其子类拥有处理异步事件的能力；
有三个对象作为实例的属性被初始化，分别为 context、 request、 response， 还有非常熟悉的存放所有全局中间件的数组middleware
*/
module.exports = class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor() {
    super();

    this.name = 'koa';
    this.proxy = false;
    this.middleware = [];// -->1
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context); // -->2
    this.request = Object.create(request); // -->3
    this.response = Object.create(response); // -->4
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  /*三： 使用node的原生 http 包来创建 http服务，所有的秘密都藏匿在callback 方法中 */
  listen(...args) {
    // console.log(`args:${args}`);
    // console.log(`this.callback():${this.callback()}`)
    /* 看一下args和this.callback都有哪些东西,通过输出可以看出:
    args是listen方法接收到的参数，当前koa应用接收到的是一个端口地址port：9527,和一个回调函数 
    this.callback是一个函数，接收的两个参数分别是req，res。最终返回 this.handleRequest(ctx, fn);
    */
    debug('listen');
    /* 使用了 node 的原生http包创建了http服务，其中关键点在于this.callback()中 */
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env',
      'name'
    ]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */
  /* 二： 当调用use方法时，在确认它是async函数的情况下，通过push操作，这个函数会被追加到middleware数组中 （此时koa还没有真正跑起来，接下来通过listen方法启动koa应用）*/
  use(fn) {
    /* 确认它是async函数 */
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
        'See the documentation for examples of how to convert old middleware ' +
        'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');

    /* 通过push操作，这个函数会被追加到middleware数组中；
    由此可见，去除校验部分，use实际上做了一件事情，就是把中间件添加到middleware中
    */
    this.middleware.push(fn);
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    /* middleware 应该是被封装成了一个叫做 fn 的对象，通过传入 context 对象来返回一个 Promise */
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
    /* 以上结果等效于：
    return fn(ctx).then(handleResponse).catch(onerror); */
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    /* 以下的各种相互等于是为了让各个对象能够相互引用
      并且ctx代理request和response中的属性和方法
    */
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
