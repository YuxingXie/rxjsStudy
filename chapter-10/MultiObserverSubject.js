
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