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