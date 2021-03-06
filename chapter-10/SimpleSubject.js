
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