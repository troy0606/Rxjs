import { of, interval, Subject, ConnectableObservable } from "rxjs";
import { map, take, tap, multicast, refCount, publish ,publishReplay,publishLast,share} from "rxjs/operators";

// let ob = of(1,2,3,4)
//     .pipe(
//         map(v=>v*v)
//     )
//     .subscribe(v=>console.log(v))

// let ob2 = interval(1000)
//         .pipe(
//             take(3)
//         )
//         .subscribe(v=>console.log(v))

// const subject = new Subject<number>();

// subject.subscribe({
//     next: (v)=>console.log(`firstSub : ${v}`)
// })

// subject.subscribe({
//     next: (v)=>console.log(`secondSub : ${v}`)
// })

// subject.next(1)
// subject.next(2)

let source = interval(1000).pipe(
  tap(x => console.log("send" + x)),
  //   multicast(new Subject<number>()),
//   publishLast(),
share(),
//   refCount()
);

let observerA = {
  next: v => console.log("A next: " + v),
  error: err => console.log("A error: " + err),
  complete: () => console.log("A complete!")
};

let observerB = {
  next: v => console.log("B next: " + v),
  error: err => console.log("B error: " + err),
  complete: () => console.log("B complete!")
};

let subscriptionA = source.subscribe(observerA);
let subscriptionB = source.subscribe(observerB);

setTimeout(() => {
  subscriptionA.unsubscribe();
  subscriptionB.unsubscribe();
}, 5000);


