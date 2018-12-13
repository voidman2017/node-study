const log4js = require('log4js');

//日志记录配置
log4js.configure({
    appenders: {
      out: { type: 'stdout' },//设置是否在控制台打印日志
      info: { type: 'file', filename: './logs/info.log' }
    },
    categories: {
      default: { appenders: [ 'out', 'info' ], level: 'info' }//去掉'out'。控制台不打印日志
    }
  });
const logger = log4js.getLogger("console");	//日志输出类型


module.exports = logger;