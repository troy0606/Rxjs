import {
  interval,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  Observable,
  from
} from "rxjs";
import {
  take,
  multicast,
  tap,
  refCount,
  publish,
  publishReplay,
  publishBehavior,
  publishLast,
  share,
  map
} from "rxjs/operators";

// let source = interval(1000).pipe(take(3))
// let observerA = {
//   next: value => console.log('A next: ' + value),
//   error: error => console.log('A error: ' + error),
//   complete: () => console.log('A complete!')
// }

// let observerB = {
//   next: value => console.log('B next: ' + value),
//   error: error => console.log('B error: ' + error),
//   complete: () => console.log('B complete!')
// }

// // 分別用 observerA 跟 observerB 訂閱了 source
// source.subscribe(observerA)
// setTimeout(()=>{
//   source.subscribe(observerB)
// },1000)

// multicast-------
// 手動建立subject
// Subject 同時是 Observable 又是 Observer
// Subject 會對內部的 observers 清單進行組播(multicast)

// let source = interval(1000).pipe(take(3));

let observerA = {
  next: value => console.log("A next: " + value),
  error: error => console.log("A error: " + error),
  complete: () => console.log("A complete!")
};

let observerB = {
  next: value => console.log("B next: " + value),
  error: error => console.log("B error: " + error),
  complete: () => console.log("B complete!")
};
// ----------------------------------------
// let subject = {
//   observers: [],
//   subscribe: function(observer) {
//     this.observers.push(observer);
//   },
//   next: function(value) {
//     this.observers.forEach(o => o.next(value));
//   },
//   error: function(error) {
//     this.observers.forEach(o => o.error(error));
//   },
//   complete: function() {
//     this.observers.forEach(o => o.complete());
//   }
// };

// subject.subscribe(observerA)
// source.subscribe(subject)

// setTimeout(()=> {
//   subject.subscribe(observerB)
// },1000)
// -------------------------------------------
// let subject = new Subject()
// // 建立一個 subject
// source.subscribe(subject)
// // 先拿去訂閱 observable(source)

// subject.subscribe(observerA)
// // 再把我們真正的 observer 加到 subject 中
// setTimeout(()=>{
//   subject.subscribe(observerB)
// },1000)

// Subject-----------------------------------
// let subject = new Subject();

// subject.subscribe(observerA)
// subject.subscribe(observerB)
// subject.next(1)
// subject.next(2)

// BehaviorSubject---------------------------------
// BehaviorSubject 跟 Subject 最大的不同就是 BehaviorSubject 是用來呈現當前的值，而不是單純的發送事件
// BehaviorSubject 會記住最新一次發送的元素，並把該元素當作目前的值

// let subject = new Subject();

// let subject = new BehaviorSubject(0);
// // BehaviorSubject 在建立時就需要給定一個狀態
// subject.subscribe(observerA)

// subject.next(1)
// subject.next(2)
// subject.next(3)

// setTimeout(()=>{
//   subject.subscribe(observerB)
//   // 之後任何一次訂閱，就會先送出最新的狀態
// },3000)

// ReplaySubject----------------------------------------
// BehaviorSubject 是代表著狀態而 ReplaySubject 只是事件的重放而已
// let subject = new ReplaySubject(2) // 重複發送最後 2 個元素
// subject.subscribe(observerA);
// subject.next(1);
// // "A next: 1"
// subject.next(2);
// // "A next: 2"
// subject.next(3);
// // "A next: 3"

// setTimeout(() => {
//   subject.subscribe(observerB);
//   // "B next: 2"
//   // "B next: 3"
// },3000)

//multicast---------------------------------------------
// let source = interval(1000).pipe(
//   tap(x => console.log("send" + x)),
//   multicast(new Subject())
// );
// // 我們透過 multicast 來掛載一個 subject 之後這個 observable(source) 的訂閱其實都是訂閱到 subject 上

// let subscriptionA = source.subscribe(observerA); // subject.subscribe(observerA)

// let subscriptionB: any;
// setTimeout(() => {
//   subscriptionB = source.subscribe(observerB); // subject.subscribe(observerB)
// });

// let realSubscription = source.connect(); // source.subscribe(subject)
// // 必須真的等到 執行 connect() 後才會真的用 subject 訂閱 source，並開始送出元素，如果沒有執行 connect() observable 是不會真正執行的。

// // 另外值得注意的是這裡要退訂的話，要把 connect() 回傳的 subscription 退訂才會真正停止 observable 的執行

// setTimeout(() => {
//   subscriptionA.unsubscribe();
//   subscriptionB.unsubscribe();
//   // 這裡雖然 A 跟 B 都退訂了，但 source 還會繼續送元素
// }, 5000);

// setTimeout(()=>{
//   realSubscription.unsubscribe();
//   // 這裡 source 才會真正停止送元素
// },7000)

// refCount--------------------------------------------------
// let source = interval(1000).pipe(
//     tap(x => console.log("send" + x)),
//     multicast(new Subject()),
//     refCount()
//   );
//   // 當source被observerA訂閱時，就立即執行並發送元素，不須另外執行connect
//   // 我們透過 multicast 來掛載一個 subject 之後這個 observable(source) 的訂閱其實都是訂閱到 subject 上

//   let subscriptionA = source.subscribe(observerA); // 訂閱數0 > 1

//   let subscriptionB: any;
//   setTimeout(() => {
//     subscriptionB = source.subscribe(observerB); // 訂閱數0 > 2
//   });

//   setTimeout(() => {
//     subscriptionA.unsubscribe(); // 訂閱數2 > 1
//     subscriptionB.unsubscribe(); // 訂閱數1 > 0
//     // 訂閱數變為0就會停止發送
//   }, 5000);

// publish------------------------------------------------
// 其實 multicast(new Rx.Subject()) 很常用到，我們有一個簡化的寫法那就是 publish
// let source = interval(1000).pipe(publish(), refCount());
// // 加上 Subject 的三種變形
// let source1 = interval(1000).pipe(publishReplay(1), refCount());
// let source2 = interval(1000).pipe(publishBehavior(0), refCount());
// let source3 = interval(1000).pipe(publishLast(), refCount());

// share---------------------------------------------------
// publish + refCount 可以在簡寫成 share
// let source = interval(1000).pipe(take(5),share())
// source.subscribe(observerA)
// setTimeout(()=>{
//   source.subscribe(observerB)
// })

// ------example-----------------------
// let observable = from([1,2,3,4]).pipe(
//   publishBehavior(0),
//   refCount()
// )

// observable.subscribe(observerA)
// setTimeout(()=>{
//     observable.subscribe(observerB)
//     // 因為非同步關係，上面的from已經complete，observerB訂閱時Subject已經complete
// },2000)

// A next: 0 ​​​​​at ​​​'A next: '
// A next: 1 ​​​​​at ​​​'A next: '
// A next: 2 ​​​​​at ​​​'A next: '
// A next: 3 ​​​​​at ​​​'A next: '
// A next: 4 ​​​​​at ​​​'A next: '

// A complete! ​​​​​
// B complete! ​​​​​

// Subject 其實是 Observer Design Pattern 的實作，所以當 observer 訂閱到 subject 時，
// subject 會把訂閱者塞到一份訂閱者清單，在元素發送時就是在遍歷這份清單，並把元素一一送出

// Subject 之所以具有 Observable 的所有方法，是因為 Subject 繼承了 Observable 的型別，
// 其實 Subject 型別中主要實做的方法只有 next、error、 complete、subscribe 及 unsubscribe 這五個方法，而這五個方法就是依照 Observer Pattern 下去實作的。

// subject錯誤處理
// const test = interval(1000);
// const testSub = new Subject();

// const testExample = testSub.pipe(
//   map(x => {
//     if (x === 1) {
//       throw new Error("oops");
//     }
//     return x;
//   })
// );
// testSub.subscribe(
//   x => console.log("A", x),
//   error => console.log("A Error:" + error)
// );
// testExample.subscribe(
//   x => console.log("B", x),
//   error => console.log("B Error:" + error)
// );
// // 加上observer的錯誤處理，一個發生錯誤不會影響其他訂閱此subject的observer
// testSub.subscribe(
//   x => console.log("C", x),
//   error => console.log("C Error:" + error)
// );

// test.subscribe(testSub);
