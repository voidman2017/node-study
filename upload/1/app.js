const koa = require("koa");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const path = require("path");
const fs = require("fs");
const app = new koa();

app.use(
  koaBody({
    formidable: {
      //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
      uploadDir: path.resolve(__dirname, "./files"),
    },
    multipart: true, // 支持文件上传
    onFileBegin: (name, file) => {
      console.log("file: ", file);
      console.log("name: ", name);
    },
  })
);

//开启静态文件访问
app.use(koaStatic(path.resolve(__dirname, "./files")));

app.use((ctx) => {
  const file = ctx.request.files ? ctx.request.files.f1 : null;
  if (file) {
    var path = file.path.replace(/\\/g, "/");
    var fname = file.name; //原文件名称
    var nextPath = "";
    if (file.size > 0 && path) {
      //得到扩展名
      var extArr = fname.split(".");
      var ext = extArr[extArr.length - 1];
      nextPath = path + "." + ext;
      //重命名文件
      fs.renameSync(path, nextPath);
    }
    //以 json 形式输出上传文件地址
    ctx.body = `{
        "fileUrl":"http://localhost:3000/${nextPath.slice(
          nextPath.lastIndexOf("/") + 1
        )}"
    }`;
  } else {
    ctx.body = null;
  }
});

app.listen(3000, () => {
  console.log(`app start: http://localhost:3000`);
});
