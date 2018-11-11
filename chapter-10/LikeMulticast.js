// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operator/take';
const {Observable} = require('rxjs/Rx') ;
require('rxjs/add/observable/interval');
require('rxjs/add/operator/take');

const tick$ = Observable.interval(1000).take(3);

tick$.subscribe(value => console.log('observer 1:'+value));

setTimeout(()=>{
    tick$.subscribe(value => console.log('observer 2:'+value))
},1500);