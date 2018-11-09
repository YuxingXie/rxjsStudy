本项目参考书籍为：《深入浅出RxJS》

作者该书的GitHub：https://github.com/mocheng/dissecting-rxjs

目的：angular使用了RxJS，简单的目的是为了用好angular,更深层的目的是了解一种编程方式，掌握一门技巧，提高生产力。

如果该项目的学习让我能够理解angular中的RxJS使用，我或许可能会停止学习。如果我觉得它可以应用在更广的范围，我会深入学习它。如果它能代替jQuery,那么它也是值得学习的。

书中原文用斜体字表示。

好吧，开始！

## 第一章：函数响应式编程

### 1.1.一个简单的RxJS程序例子

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

流类型的变量习惯以$结尾，这种风格称为"芬兰式命名法"。

流对象通过subscribe函数可添加函数对数据进行操作。

上面的例子，通过我粗浅的理解，subscribe函数的参数是一个匿名函数，该参数用于处理流数据的处理。另外，fiatMap,map这2个方法仍然返回流对象。

虽然到此为止，大部分代码仍是看不懂，作者又抛出了2个概念：**函数式**和**响应式**编程，接下来学习。

### 1.2.函数式编程

#### 1.2.1.什么是函数式编程

就是非常强调使用函数来解决问题的一种编程方式。它有一些特殊的要求：

* 声明式(Declarative)
* 纯函数(Pure Function)
* 数据不可变性(Immutability)

某种编程方式或者说编程思想，是一种比语法规范更严格的编程行为规范，它必须要体现一种思想。所以它的基础是理解这种行为的含义。作者暂时没有说明函数式编程的意义，但是先提出了规范，我们
不妨跟着看下去，如何用JavaScript满足函数式编程的特性要求。

##### 1.声明式

和声明式相对应的编程方式叫做命令式。

作者的例子double(arr)是把一个数组所有项乘以2返回新数组,addOne(arr)是数组每一项加上1。js有便利的map方法实现，而不需要循环数组，对数组每一项进行操作。
```javascript
function double(arr) {
  return arr.map(function(item) {return item*2;});
}
function addOne(arr) {
  return arr.map(function(item) {return item+1;});
}
```
我自己停顿了一下，感觉到这里蕴含了比较深刻的编程思想。特别是作为一名java程序员，这种思想是很缺少的。Java中永远不能把一个函数作为方法的参数传递到另一个方法中，而JavaScript中则
到处可见这种编程方式。这里数组的map方法就是这样一种方式，它传入一个匿名函数，我暂且叫它paramFn，paramFn的参数是数组的一个item，返回一个新值。我可以猜测，map方法的内部实现中
调用了这个传入的paramFn，用它的返回值组装了一个新数组。

带着这个感悟继续研究下去。

用lambda表达式可以把代码变得更简洁：
```javascript
const double = arr => arr.map(item => item*2);
const addOne = arr => arr.map(item => item+1);
```
很好！果真简洁！

_当你熟悉RxJS编程之后，你会发现自己几乎再也不会写循环语句了。_

不过作者就是没给声明式下一个定义。不如我定义一下吧：声明式就是把一个函数作为参数传递给另一个函数。

##### 2.纯函数

纯函数的意思就是，函数的调用不会改变它传入的参数的值。这类似于Java中的"按值传递"。这里的例子中，addOne(arr)调用返回了一个新数组，调用后arr的值是不会改变的。

_纯函数指的是满足下面两个条件的函数：_

* 函数的执行过程完全由输入的参数决定，不会受除参数之外的任何数据影响(比如全局变量)；
* 函数不会修改任何外部状态，比如修改全局变量或传入的参数对象，

总之就是，纯函数是绝对无副作用的一种函数。

**概念**：满足纯函数的特性也叫**引用透明度**。

另外，测试驱动开发与纯函数存在较大关系。

##### 3.数据不可变

数据一旦产生，我们就可以肯定它的值永远不会变。它也是纯函数所追求的一种效果。

如果你在想，那数据不都是常量了吗？我也不想解释了。

#### 1.2.2.为什么函数式编程最近才崛起

不研究

#### 1.2.3.函数式编程与面向对象编程的比较

作为Java程序员，我并不觉得面向对象编程有什么不对劲的地方。不过java语言的一种语法糖gradle却强调函数式编程，让我有点想法。

### 1.3.响应式编程

Reactive Programming

介绍响应式编程世界里知名度最高的框架Reactive Extension.

### 1.4.Reactive Extension

Reactive Extension也叫ReactiveX，或简称Rx，指的是实践响应式编程的一套工具。

Rx官网： http://reactivex.io ，官网说，Rx是一套通过可监听流来做异步编程的API。

另：作者是一位JavaScript吹。

### 1.5.RxJS是否函数响应式编程

不研究

### 1.6.函数响应式编程的优势

* 数据流抽象了很多现实问题(不理解)；

* 擅长处理异步操作(听说过)；

* 把复杂问题分解成简单的问题的组合(我觉得属于方法论范畴)。

### 1.7.小结

使用面向对象思维编程的程序员们可以从中打开一些思路。

## 第二章：RxJS入门

### 2.1.RxJS的版本和运行环境

有v4和v5两个版本，使用npm安装，并且安装命令都不一样。

#### 1.npm安装
v4:
```text
npm install rxjs
```

v5:
```text
npm install rx
```

这表示可以在项目中同时使用这2个版本。

导入Rx对象：
```javascript
import Rx from 'rxjs';
//或
import Rx from 'rxjs/Rx';
```
我在自己的angular项目中也使用过：
```javascript
import { Observable, of } from 'rxjs';
```
这是一种推荐的使用方式，只导入需要使用的模块功能。

#### 2.引用RxJS URL

```html
<!--指定版本-->
<script src="https://unpkg.com/rxjs@5.5.2/bundles/Rx.min.js"></script>
<!--或者：最新版本-->
<script src="https://unpkg.com/rxjs/bundles/Rx.min.js"></script>
```

### 2.2.Observable和Observer

涉及到设计模式，除了作者说的四人帮所著的《设计模式》，作为Java程序员我更推荐《敏捷软件开发原则、模式与实践》。也见我的另一个单独的设计模式项目： https://github.com/YuxingXie/agile

#### 2.2.1.观察者模式

发布者：Publisher,负责产生事件，对应RxJS的Observable

观察者：Observer，被注册上某个发布者，只管接收到事件之后的处理

观察者订阅发布者，发布者推送数据。

下面这段代码在我的angular项目中曾使用，getHeroes方法返回值是Observable<Hero[]>,可见Observable对象还实现了泛型。
 ```typescript
this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
```

Observable.of方法返回一个将参数封装了的Observable对象：
```typescript
const source$ = Observable.of(1,2,3);
source$.subscribe(console.log);

```
上例是书中的例子，看来我又学到了新东西。第一句说明发布者可以发布多个事件；另外，第二句代码我可能会这样写：
```typescript
source$.subscribe(data=> console.log(data));
```

#### 2.2.2.迭代器模式

几个元素（名字不一定是这个），请根据字面理解就够了：

* getCurrent

* moveToNext

* isDone

可以参考java中迭代器接口Iterator方法:iterator();next();hasNext();

##### 推与拉
RxJS中由发布者推消息而不是观察者拉消息。

RxJS使用迭代器模式实现订阅，所以我们不需要应用迭代器模式。

#### 2.2.3.创造Observable

_每个Observable对象，代表的就是在一段时间范围内发生的一系列事件。_

**Observable = Publisher + Iterator**

代码：创造和使用一个简单的Observable对象：
```javascript
// import { Observable } from 'rxjs/Rx';//大概是node版本的原因import语法报错
const {Observable} = require('rxjs/Rx') ;

// onSubscribe函数的参数似乎是一个迭代器
const onSubscribe = observer => {
    for(let i=1;i<=3;i++){
        observer.next(i);
        console.log(`发布者发布数据：${i}`)
    }
};
const source$ = new Observable(onSubscribe);//Observable构造器方法传入一个带迭代器参数的函数
const theObserver ={//我把theObserver称为观察器(习惯上xx器代表一个方法，但这里是一个对象，其next属性表示观察的方法)
    next: item => console.log(`观察器观察到：${item}`)
};
source$.subscribe(theObserver);
```
和作者的代码大同小异，并加了一些注释而已，可能理解不一定正确，先写上，有错再改。

分析代码：

* 第一步：导入Observable类(大概是node版本的原因不能使用import语法，使用了require语法)；

* 第二步：创造一个函数onSubscribe，这个函数会作为Observable构造函数的参数，这个函数参数(onSubscribe)完全决定了Observable对象的行为(迭代推送数据)。
OnSubscribe函数接受一个名为observer的参数，函数体内，调用参数observer的next函数，把数据"推"给observer；

* 第三步：调用Observable构造函数，产生一个名为source$的数据流对象；

* 第四步：创造观察者theObserver;

* 第五步：通过subscribe函数将theObserver和source$关联起来。

我在这里停顿了很久。我试图用一个面向对象的模型（java）来思考这几步，虽然程序在语法上是通的，但是我并不敢确定是否表达了上述意思。下面贴出这些代码：


Publisher.java:
```java
/**
 * 发布者，它被Observable对象持有，当Observable被订阅的时候执行onSubscribe方法，注意这个方法使用了Observer类
 */
public class Publisher {
    public void onSubscribe(Observer observer){
        observer.next(1);
        observer.next(2);
        observer.next(3);
    }
}
```


Observer.java:
```java
public abstract class Observer {
    public abstract void next(Object item);
}

```

Observable.java:
```java
/**
 * 这里模拟实现一个可观察对象，它能推送消息给观察者
 */
public class Observable {
    private Publisher publisher;
    public Observable(Publisher publisher) {
        this.publisher = publisher;
    }

    public void subscribe(Observer observer){
        this.publisher.onSubscribe(observer);
    }
   
}
```
实现订阅:
```java

        Observer observer=new Observer() {
            @Override
            public void next(Object item) {
            System.out.println("next item is:"+item);
            }
        };
        Observable source$=new Observable(new Publisher());
        source$.subscribe(observer);
```

我这里抽象出了一个Publisher.java类，代表发布者。类之间的关系是：Observable持有Publisher，Publisher使用Observer。这个程序真能实现发布者发布任何消息，观察者一定能够
执行它的next方法吗？我把程序稍微改了一下，让Publisher可以接受键盘输入，表示发布者可以永不停止的发布消息：
```java
import java.io.IOException;
import java.util.Scanner;

public class Publisher {
    public void onSubscribe(Observer observer) throws IOException {
        Scanner input = new Scanner(System.in);
        String item = null;       // 记录输入的字符串
        while (true){
            System.out.print("请输入：");
            item = input.next();// 等待输入值
            observer.next(item);
        }
    }
}
```
看看执行结果
```text
请输入：3
next item is:3
请输入：6
next item is:6
请输入：666
next item is:666
请输入：koko
next item is:koko
请输入：
```

程序按预期执行成功了。道理很简单，可观察对象被订阅的时候，它执行了发布者的onSubscribe方法，而这个方法使用了observer对象的next方法，即打印next方法的参数item。
当onSubscribe方法永无休止的接受键盘输入时，观察者的next方法永不休止的执行着。