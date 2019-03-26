const fs = require("fs");

/**
 * 使用promise封装异步读取文件方法
 * @param {*} pagename 
 */
function render(pagename) {
  return new Promise((resolve, reject) => {
    let viewUrl = `./views/${pagename}`;
    fs.readFile(viewUrl, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function route(url) {
  let view = '404.html';
  switch (url) {
    case '/':
      view = 'index.html';
      break;
    case '/index':
      view = 'index.html';
      break;
    case '/todo':
      view = 'todo.html';
      break;
    case '/404':
      view = '404.html';
      break;
    default:
      view = '404.html';
      break;
  }
  let html = await render(view);
  return html
}

module.exports = function () {
  return async function ( ctx, next ) {
    let url = ctx.request.url;
    let html = await route(url);
    ctx.body = html;
    await next();
  }
}