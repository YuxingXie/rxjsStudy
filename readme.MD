本项目参考书籍为：《深入浅出RxJS》

作者该书的GitHub：https://github.com/mocheng/dissecting-rxjs

目的：angular使用了RxJS，简单的目的是为了用好angular,更深层的目的是了解一种编程方式，掌握一门技巧，提高生产力。

好吧，开始！

## 第一章：函数响应式编程

一个检查按钮从点下到松开时间的js程序：

chapter-01/index.html

```html
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<div>
    <div>测试你对时间的感觉.</div>
    <button id="hold-me">按住我一秒钟然后松手</button>
    <div> 你的时间: <span id="hold-time"></span>毫秒</div>
    <div id="rank"></div>
</div>
<script src="https://unpkg.com/rxjs@5.5.2/bundles/Rx.min.js"></script>
<script src="./timingSenseTest.js"></script>
</body>
</html>
```

chapter-01/timingSenseTest.js
```javascript
const holdMeButton = document.querySelector('#hold-me');
const mouseDown$ = Rx.Observable.fromEvent(holdMeButton, 'mousedown');
const mouseUp$ = Rx.Observable.fromEvent(holdMeButton, 'mouseup');

const holdTime$ = mouseUp$.timestamp().withLatestFrom(mouseDown$.timestamp(), (mouseUpEvent, mouseDownEvent) => {
    return mouseUpEvent.timestamp- mouseDownEvent.timestamp;
});

holdTime$.subscribe(ms => {
    document.querySelector('#hold-time').innerText = ms;
});

holdTime$.flatMap(ms => Rx.Observable.ajax('https://timing-sense-score-board.herokuapp.com/score/' + ms))
    .map(e => e.response)
    .subscribe(res => {
        document.querySelector('#rank').innerText = '你超过了' + res.rank + '% 的用户';
    });
```

如果你看懂了，说明你应该看点高级知识了。

然后，我顺着书本看下去，书上也没解释这段代码，而是讲了一些概念。好吧，一切都听您的。

**流**：_RxJS世界的一种特殊对象，或称为"数据流"、"Observable对象"。_