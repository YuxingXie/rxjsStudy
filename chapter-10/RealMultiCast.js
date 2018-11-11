const {Observable} = require('rxjs/Rx') ;
const { Subject } =require('rxjs/Subject');
require('rxjs/add/observable/interval');
require ('rxjs/add/operator/map');


const tick$ = Observable.interval(1000).take(3);
const subject =new Subject();

tick$.subscribe(subject);//subject被作为观察者

subject.subscribe(value => console.log('observer 1: '+value));//这里subject被订阅，成了Observable

/**
 * 我这样理解不知道对不对：Subject作为观察者其实只是充当了一个作者所说的"中间人"角色，毕竟，观察者也可以充当发布者，因为它把观察到的东西发布
 出去就相当于充当了发布者的角色。所以它也可以被订阅为发布者，在它自身调用subscribe方法，把它观察到的数据发布给另一个观察者。
 */


setTimeout(()=>{
    subject.subscribe(value => console.log('observer 2: '+value))
},1500);
