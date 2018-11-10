const {Observable} = require('rxjs/Rx') ;

const onSubscribe = observer=>{
    let number=0;
    const handle = setInterval(()=>{
        console.log('in Onsubscribe',++number);
        observer.next(number);
    },1000);
    return {
        unsubscribe: ()=>{
            // clearInterval(handle);
        }
    }
};

const source$ = new Observable(onSubscribe);

const subscription = source$.subscribe(item=>console.log(item));

setTimeout(()=>{
    subscription.unsubscribe();
},3500);