/* 模拟一下 EventEmitter */

class EventEmitter {
    constructor() {
        this._events = {}; //存放订阅时间
    }
    on(eventName, listener) {
        if (this._events[eventName]) {
            this._events[eventName].push(listener)
        } else {
            this._events[eventName] = [listener]
        }
    }
    emit(eventName, params) {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach((fn) => {
            fn.call(this, params)
        })
    }
    once(eventName, listener) {
        function fn() {
            /* 这里不能使用箭头函数，因为箭头函数的局部作用中是没有 arguments 对象
            访问到的则是通过作用域链查找到的外部的arguments对象 */
            listener(...arguments);
            this.removeListener(eventName, fn)
        }
        this.on.call(this, eventName, fn)
    }
    removeListener(eventName, listener) {
        if (!this._events[eventName]) return;
        this._events[eventName] = this._events[eventName].filter(fn => fn !== listener)
    }

}

const e = new EventEmitter();
function fn1(params) {
    console.log('end-fn1', params)
}
function fn2(params) {
    console.log('end-fn2', params)
}
function fn3(params) {
    console.log('end-fn3', params)
}
e.on('end', fn1)
e.on('end', fn2)
e.once('end', fn3)

e.emit('end', 'haha')

e.removeListener('end', fn1)

e.emit('end', 'hehe')

