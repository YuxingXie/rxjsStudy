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
            observer.next(item);//这一句代码确保发布者发布任何消息时，观察者的next方法必然被执行
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

该java项目gitHub: https://github.com/YuxingXie/aes-base64

w我们看看Observer这个角色，它仅仅关注如何处理消息。当数据流被订阅时，它被当做参数传入。

现在再看看作者的说明，我顿时觉得清晰了。

#### 2.2.4.跨越时间的Observable

这个和我改写成键盘输入的例子类似，就不再多说。理念是；推数据的是onSubscribe函数。在我的例子中，它被抽象为一个Publisher，所以看起来我的理解是对的。

#### 2.2.5.永无止境的Observable

同上

#### 2.2.6.Observable的完结

既然我们可以让发布者调用Observer的next方法表示如何处理下一条数据，那为什么不指定另一个方法表示当没有新消息时的处理函数呢？当然是可以的。

我们把这个函数命名为complete,它不需要参数。

到这里，我们思考一下，为什么这些函数的命名有约定吗？它是某个接口的实例吗？我猜应该是的，否则发布者和数据流的提供商如何与观察者的提供商通讯呢？

#### 2.2.7.Observable的出错处理

next表示处理数据，complete表示数据没有了，而error则表示出错。

RxJS中，一个Observable对象只有一种中介状态，要么完结(complete)，要么错误(error)。当Observer同时定义了error和complete时，如果报错，这个Observable就完结，不会有complete了。

#### 2.2.8.Observer的简单形式

并不是所有情况都需要next,error和complete函数。subscribe函数有另一种表示法，它不必传一个Observer对象，而是可以传递函数，第一个参数如果是函数，被认为是next,第二个函数则是error,
第三个是complete，如下：
```javascript
source$.subscribe(
    item => console.log(item),
    err => console.log(err),
    ()=>console.log('No More Data')
    );
```
或者用null代替。

### 2.3.退订Observable

代码见： chapter-02/Unsubscribe.js

退订(unsubscribe)就是解除Observable和Observer之间的关系。

实现方法是：调用subscribe的返回对象的unsubscribe方法，如下：
```javascript
const source$ = new Observable(onSubscribe);
const subscription = source$.subscribe(item=> console.log(item));
setTimeout(()=>{
    subscription.unsubscribe();
},3500);

```
具体的退订方法由发布方实现。退订确实实现了observer对象传入的next方法不再执行，不过在代码中看不到这个逻辑，我只能认为这个功能是有RxJS体系完成的。

### 2.4.Hot Observable和Cold Observable

理解概念为主，详细讲解将会在第十章。

我之前的Java代码中自己抽象了一个Publisher，实际上，可能叫做Producer(生产者)更合适。回忆下之前的Java代码：
```java
    Observable source$ = new Observable(new Publisher());
```

我们创建可观察对象时传入了一个发布者(或者叫生产者)，它是一个new出来的实例，表明这个可观察对象使用一个全新的生产者，这个观察者叫叫做冷的可观察者。
而当这个生产者独立于Observable时，这个Observable叫Hot Observable。



### 2.5.操作符简介

操作符类似于angular中管道的概念，表示在subscribe之前对Observable对象进行的一系列操作。这些操作应该都是可以链式调用的。

书中提到的操作符：

* create:创建一个Observable实例，如：Observable.create(onSubscribe)

* map：在一个Observable实例上使用，如：Observable.create(onSubscribe).map(x=>x*x)，返回一个全新的Observable，将前一个可观察对象的数据项平方

还有我们在angular中使用的of应该也算一个操作符吧。

angular中介绍过一个操作符，我想应该比较有用的：

from(iterable) —— 把它的参数转换成一个 Observable 实例。 该方法通常用于把一个数组转换成一个（发送多个值的）可观察对象。

更多的操作符之后介绍。并且，它是一个使用极其频繁的东西。

### 2.6.弹珠图

一种数据流的图示法，可以了解一下。

### 2.7.小结

一般书的小结是记流水账，所以我都是自己总结。

Observable既然被称作"数据流"，那么它是如何"流"的呢？其实到这里应该清楚了，实际上是onSubscribe方法调用了观察者的next方法，把数据作为参数传进去这样"流"的。

还要清楚一点，在接触hot Observable之前，我们可以认为：直到观察者订阅可观察对象的那一刻，生产者才开始真正产生数据。

生产者和消费者模式是一种设计模式，它简化了数据传递的模型。我没记错的话，四人帮的设计模式中没提到这种模式。这个容我再去翻翻书。


## 第三章 操作符基础

filter和map操作符，和数组的filter和map方法类似。

### 3.2.操作符的分类

#### 3.2.1.功能分类

* 创建类
* 转化类
* 过滤类
* 合并类
* 多播类
* 错误处理类
* 辅助工具类
* 条件分支类
* 数学和合计类

作者说以上涵盖了所有的操作符，但又举了三个类型，不知什么关系：
* 背压控制类
* 可连接类
* 高阶Observable处理类

#### 3.2.2.静态和实例分类

create,of等创建类操作符是静态操作符

### 3.3.如何实现操作符

讲解如何定制一个新的操作符。

基于使用的角度，我认为可以延后学习，略过先。

### 3.4.小结

操作符的分类，没什么需要重点提的。

## 第四章 创建数据流 至 第八章

从第四章开始到第八章，讲的是各种操作符的使用。在我看来，入门了基本理论后，应用层面只需要一本随时可以翻阅的工具书足矣。当我们想
了解某一类操作符时，可以翻书查看。所以第四章到第八章略过。

网上找到一个RxJS的学习网站，并且还是中文的：https://cn.rx.js.org/class/es6/Observable.js~Observable.html

所谓操作符就是Observable的静态或实例方法，在上面都可以找到。

第九章和第十章我决定先研究第十章：多播。


## 第九章 异常错误处理

先学第十章，回头来学本章。

## 第十章 多播

多播(multicast)就是让一个数据流的内容被多个Observer订阅。

为了实现多播，需要引入一种特殊的类型：Subject，在RxJS中出了Subject这个类型，还有如下几个扩充的形态：

* BehaviorSubject
* ReplaySubject
* AsyncSubject

同时，RxJS还提供一系列操作符用于支持多播，下面列举了各种场景下使用的多播类操作符：

<table>
<tr><th>功能需求</th><th>适用的操作符</th></tr>
<tr>
<td>灵活选取Subject对象进行多播</td>
<td>multicast</td>
</tr>

<tr>
<td>只多播数据流中最后一个数据</td>
<td>publishLast</td>
</tr>
<tr>
<td>对数据流中给定数量的数据进行多播</td>
<td>publishReplay</td>
</tr>
<tr>
<td>拥有默认数据的多播</td>
<td>publishBehavior</td>
</tr>
</table>

### 10.1.数据流的多播

_在RxJS中，Observable和Observer的关系，就是前者在播放内容，后者在收听内容。播放内容的方式可以分为三种：_

* 单播(unicast)：一个接收者
* 广播(broadcast)：所有接收者，并不是RxJS支持的目标
* 多播(multicast)：指定多个接收者

RxJS的Observable可以被多次subscribe，表明可以支持多播。

下面是一个**看起来像**多播的代码例子：

chapter-10/LikeMulticast.js
```javascript
const {Observable} = require('rxjs/Rx') ;
require('rxjs/add/observable/interval');
require('rxjs/add/operator/take');

const tick$ = Observable.interval(1000).take(3);

tick$.subscribe(value => console.log('observer 1:'+value));

setTimeout(()=>{
    tick$.subscribe(value => console.log('observer 2:'+value))
},1500);
```
运行结果：
```text
observer 1:0
observer 1:1
observer 2:0
observer 1:2
observer 2:1
observer 2:2
```

```text
interval(period: number, scheduler: Scheduler): Observable
创建一个 Observable ，该 Observable 使用指定的 IScheduler ，并以指定时间间隔发出连续的数字。

take(count: number): Observable<T>
只发出源 Observable 最初发出的的N个值 (N = count)。

```
上面例子中，observer 2是间隔1.5秒才订阅的，但打印结果显示它并没有错过订阅之前Observable吐出的0。

_为什么会是这个结果呢？因为interval这个操作符产生的是一个Cold Observable对象。_

### 10.2.Hot和Cold数据流差异

2.4中介绍过，Cold Observable就是每次被订阅都产生一个全新的数据序列的数据流。

我的理解是，Cold Observable对象每次被订阅时，都会创建一个新的生产者，所以订阅时它又会重新执行一次产生数据的方法。

绝大部分创建类操作符创建的Observable都是Cold Observable，如：
* interval
* range

以下几个创建Hot Observable：
* fromPromise
* fromEvent
* fromEventPattern

Cold Observable如果没有订阅，不会产生数据；Hot Observable没有订阅的情况下，数据依然会产生，只不过不传入数据管道。

然后作者下结论说，Cold Observable实现的是单播，Hot Observable实现的是多播，我对这个突然到来的结论有点懵。

我看了一下作者用超级马里奥举滴栗子，我大概明白了，他其实想实现的是"直播"，需要即时的数据，显然Cold Observable确实做不到，而Hot Observable
因为不断产生数据，所以是可以实现"直播"。

或者我这里讲的"直播"其实是"多播"的真正含义，作者开头定义的"多播"是错的。

我回头看了一下2.4节，比较确定了作者在本章所定义的"多播"概念是错的。不如我重新给多播进行定义：

多播就是指多个订阅者接收到即时由数据发布者生产的数据，它有个近义词：直播。

### 10.3.Subject

把Cold Observable变成Hot Observable的关键就是使用Subject。

转换需要一个"中间人"，这个中间人的职责：

* 提供subscribe方法，让其能够订阅自己的数据源；
* 能够有办法接受推送的数据，包括Cold Observable推送的数据。

所以中间人既是Observable又是Observer。

Subject同时实现了Observable和Observer接口，它可以充当中间人。

#### 10.3.1.两面神Subject

chapter-10/SimpleSubject.js:
```javascript
const { Subject } =require('rxjs/Subject');
require('rxjs/add/observable/interval');
require ('rxjs/add/operator/map');

const subject =new Subject();

subject.map(x => x*2).subscribe(
    value => console.log('on data: '+value),
    err => console.log('on error: '+err),
    ()=> console.log('on complete')
);

subject.next(1);
subject.next(2);
subject.next(3);
subject.complete();
```

控制台打印：
```text
on data: 2
on data: 4
on data: 6
on complete
```
分析：
1. new Subject的时候调用的是无参构造方法，而不需要传入一个生产者。所以当它被subscribe的时候，观察者是观察不到数据的；
2. 生产数据的next方法调用是在subscribe之后执行的；
3. 整个程序的流程已经变化了，之前Observable被订阅之后立即产生数据，现在产生数据却由Subject控制。

Subject维护一个Observer列表，它知道该给谁发消息，先到先得，后加入的观察者收不到订阅前的消息。

下面是一个有多个订阅者的例子：

chapter-10/MultiObserverSubject.js：
```javascript

const { Subject } =require('rxjs/Subject');

const subject =new Subject();

const subscription1=subject.subscribe(
    value => console.log('on observer 1 data: '+value),
    err => console.log('on observer 1 error: '+err),
    ()=> console.log('on observer 1 complete')
);

subject.next(1);

const subscription2=subject.subscribe(
    value => console.log('on observer 2 data: '+value),
    err => console.log('on observer 2 error: '+err),
    ()=> console.log('on observer 2 complete')
);

subject.next(2);
subscription1.unsubscribe();
subject.complete();
``` 

打印：
```text
on observer 1 data: 1
on observer 1 data: 2
on observer 2 data: 2
on observer 2 complete
```

大家自己分析一下结果，一切都在意料中。

#### 10.3.2.用Subject实现多播

我们可以认为Hot Observable是"生产者"独立于订阅行为之外的Observable