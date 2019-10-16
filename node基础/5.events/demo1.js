/* 发布订阅 */
const EventEmitter = require('events');

const event = new EventEmitter();


/* 订阅： 添加 fn1 函数到名为 end 的是事件的监听器数组的末尾 */
function fn1(params) {
    console.log('fn1-end', params, this)
}
event.on('end', fn1)

/* 添加单次监听器 */
const fn2 = (params) => {
    console.log('fn2-end', params)
}
event.once('end', fn2)

/* 发布： 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。 */
event.emit('end', 'haha');
event.emit('end', 'xixi');

/* 从名为 eventName 的事件的监听器数组中移除指定的 listener。 */
event.removeListener('end', fn1);
event.emit('end', 'hehe');