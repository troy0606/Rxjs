import {
  of,
  interval,
  Subject,
  ConnectableObservable,
  from,
  empty,
  Observable
} from "rxjs";
import {
  map,
  take,
  tap,
  multicast,
  refCount,
  publish,
  publishReplay,
  publishLast,
  share,
  skip,
  takeLast,
  last,
  concat,
  startWith,
  merge,
  combineLatest,
  zip,
  withLatestFrom,
  scan,
  buffer,
  bufferTime,
  bufferCount,
  delay,
  delayWhen,
  debounceTime,
  throttleTime,
  distinct,
  distinctUntilChanged,
  catchError,
  retry,
  retryWhen,
  repeat
} from "rxjs/operators";

// takeLast-------------------------
// var source = interval(1000);
// source.pipe(
//   skip(3),
//   take(6),
//   takeLast(3)
// )

// source.subscribe({
//     next: (value: number) => { console.log(value); },
//     error: (err) => { console.log('Error: ' + err); },
//     complete: () => { console.log('complete'); }
// });

// last----------------------------
// let source = interval(100)
//               .pipe(
//                 take(5),
//                 last()
//               )

// source.subscribe({
//     next: (value: number):void => { console.log(value); },
//     error: (err: Error):void => { console.log('Error: ' + err); },
//     complete: ():void => { console.log('complete'); }
// });

// concat-----------------------------
// let source = interval(1000).pipe(take(3));
// let source2 = of(3);
// let source3 = of(4, 5, 6);
// let example = source.pipe(concat(source2,source3));
// example.subscribe({
//     next: (value: number):void => { console.log(value); },
//     error: (err: Error):void => { console.log('Error: ' + err); },
//     complete: ():void => { console.log('complete'); }
// });

// source : ----0----1----2|
// source2: (3)|
// source3: (456)|
//             concat()
// example: ----0----1----2(3456)|

// startWith----------------------------
// let source = interval(1000)
// let example = source.pipe(startWith(9),take(6))
// // startWith 的值是一開始就同步發出的，這個 operator 很常被用來保存程式的起始狀態
// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : ----0----1----2----3--...
//                 startWith(0)
// example: (0)----0----1----2----3--...

// merge-------------------------------
// let source = interval(500).pipe(take(3))
// let source2 = interval(300).pipe(take(6))
// let example = source.pipe(merge(source2))

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// combineLatest-----------------------
// source : ----0----1----2|
// source2: --0--1--2--3--4--5|
// merge()
// example: --0-01--21-3--(24)--5|
// 當兩件事情同時發生時，會同步送出資料(被 merge 的在後面)，當兩個 observable 都結束時才會真的結束。

// let source = interval(500).pipe(take(3));
// let newest = interval(300).pipe(take(6));
// let example = source.pipe(combineLatest(newest, (x: number, y: number):number => x + y));

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : ----0----1----2|
// newest : --0--1--2--3--4--5|
// combineLatest(newest, (x, y) => x + y);

// example: ----01--23-4--(56)--7|
// 一定會等兩個 observable 都曾有送值出來才會呼叫我們傳入的 callback

// ZIP-----------------------------
// let source = interval(500).pipe(take(3));
// let newest = interval(300).pipe(take(6));
// let example = source.pipe(zip(newest, (x: number, y: number):number => x + y));

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })
// source : ----0----1----2|
// newest : --0--1--2--3--4--5|
// zip(newest, (x, y) => x + y)
// example: ----0----2----4|

// let source = from('hello')
// let source2 = interval(1000)
// let example = source.pipe(zip(source2,(x: number, y: number):number => x ))

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : (hello)|
// source2: -0-1-2-3-4-...
//         zip(source2, (x, y) => x)
// example: -h-e-l-l-o|
// zip 會等到 source 跟 newest 都送出了第一個元素，再傳入 callback

// withLatestFrom--------------------------------------
// let main = from('hello').pipe(zip(interval(500),(x: string, y: number):string => x ))
// let some = from([0,1,1,0,0,1]).pipe(zip(interval(300),(x: number, y: number):number => x ))

// let example = main.pipe(withLatestFrom(some,(x: string,y:number): string => {
//   return y===1 ? x.toUpperCase(): x;
// }))

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// main   : ----h----e----l----l----o|
// some   : --0--1--1--0--0--1|
// withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x);

// example: ----h----e----l----L----O|
// 我們在 main 送出值時，去判斷 some 最後一次送的值是不是 1 來決定是否要切換大小寫

// SCAN--------------------------------------
// let source = from('hello').pipe(zip(interval(600),(x: string, y: number):string => x ))
// let example = source.pipe(scan((origin: string,next: string):string => origin + next))
// example.subscribe({
//     next: (value: number):void => { console.log(value); },
//     error: (err: Error):void => { console.log('Error: ' + err); },
//     complete: ():void => { console.log('complete'); }
//   })

// source : ----h----e----l----l----o|
// scan((origin, next) => origin + next, '')
// example: ----h----(he)----(hel)----(hell)----(hello)|
// 第一次傳入 'h' 跟 '' 相加，返回 'h' 當作下一次的初始狀態，一直重複下去

// buffer-----------------------------------
// let source = interval(300)
// let source2 = interval(1000)
// let example = source.pipe(buffer(source2))

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : --0--1--2--3--4--5--6--7..
// source2: ---------0---------1--------...
// buffer(source2)
// example: ---------([0,1,2])---------([3,4,5])

// buffer 要傳入一個 observable(source2)，它會把原本的 observable (source)送出的元素緩存在陣列中，
// 等到傳入的 observable(source2) 送出元素時，就會觸發把緩存的元素送出。

// bufferTime-------------------------------
// let source = interval(300)
// let example = source.pipe(bufferTime(1000))

// example.subscribe({
//   next: (value: number):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// bufferCount------------------------------
// let source = interval(300);
// let example = source.pipe(bufferCount(5));

// example.subscribe({
//   next: (value: number): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// const button = document.getElementById('demo');
// const click = Rx.Observable.fromEvent(button, 'click')
// const example = click
//                 .bufferTime(500)
//                 .filter(arr => arr.length >= 2);

// example.subscribe({
//     next: (value) => { console.log('success'); },
//     error: (err) => { console.log('Error: ' + err); },
//     complete: () => { console.log('complete'); }
// });

// delay----------------------------------
// let source = interval(300).pipe(take(5))
// let example = source.pipe(delay(1000))

// example.subscribe({
//   next: (value: number): void => {
//         console.log(value);
//       },
//       error: (err: Error): void => {
//         console.log("Error: " + err);
//       },
//       complete: (): void => {
//         console.log("complete");
//       }
// })

// source : --0--1--2--3--4|
// delay(500)
// example: -------0--1--2--3--4|

// delayWhen-------------------------
// let source = interval(1000).pipe(take(10));
// let example = source.pipe(delayWhen(x => empty().pipe(delay(100 * x * x))));

// example.subscribe({
//   next: (value: number): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// debounceTime----------------------------------
// let source = interval(300).pipe(take(20), debounceTime(1000));
// source.subscribe({
//   next: (value: number): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// source : --0--1--2--3--4--5....-19|
// debounceTime(1000)
// example: --------------19|

// 每 300 毫秒就會送出一個數值，但我們的 debounceTime 是 1000 毫秒，
// 也就是說每次 debounce 收到元素還等不到 1000 毫秒，就會收到下一個新元素，
// 然後重新等待 1000 毫秒，如此重複直到第五個元素送出時，observable
// 結束(complete)了，debounce 就直接送出元素。

// throttleTime-------------------------
// let source = interval(300).pipe(take(9), throttleTime(1000));
// source.subscribe({
//   next: (value: number): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// source : --0--1--2--3--4--5--6--7--8|
// debounceTime(1000)
// example: --0-----------4-----------8|
// 0
// 4
// 8
// complete
// throttle 比較像是控制行為的最高頻率，也就是說如果我們設定 1000 毫秒，
// 那該事件頻率的最大值就是每秒觸發一次不會再更快

// distinct --------------------------------
// let source = from(["a", "b", "c", "a", "b"]).pipe(
//   zip(interval(300), (x, y) => x)
// );
// let example = source.pipe(distinct());

// example.subscribe({
//   next: (value: string): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// source : --a--b--c--a--b|
// distinct()
// example: --a--b--c------|
// 用 distinct 後，只要有重複出現的值就會被過濾掉。

// let source = from([
//   { value: "a" },
//   { value: "b" },
//   { value: "c" },
//   { value: "a" },
//   { value: "b" }
// ]).pipe(zip(interval(300), (x, y) => x));
// let example = source.pipe(distinct(x => x.value));
//可以傳入一個 selector callback function，這個 callback function 會傳入一個接收到的元素，
// 並回傳我們真正希望比對的值

// example.subscribe({
//   next: (value: { [prop: string]: string }): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// {value: "a"}
// {value: "b"}
// {value: "c"}
// complete

// distinctUntilChanged------------------------
// let source = from(["a", "b", "c", "c", "b"]).pipe(
//   zip(interval(300), (x, y) => x)
// );
// let example = source.pipe(distinctUntilChanged());

// example.subscribe({
//   next: (value): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// a
// b
// c
// b
// complete

// source : --a--b--c--c--b|
// distinctUntilChanged()
// example: --a--b--c-----b|
// distinctUntilChanged 只會暫存一個元素，並在收到元素時跟暫存的元素比對，如果一樣就不送出，
// 如果不一樣就把暫存的元素換成剛接收到的新元素並送出

// let source = from([
//   { value: "a" },
//   { value: "b" },
//   { value: "b" },
//   { value: "c" },
//   { value: "a" }
// ]).pipe(zip(interval(300), (x, y) => x));
// let example = source.pipe(
//   distinctUntilChanged((pre, cur): boolean => pre.value === cur.value)
// );
// callBack 上次的值跟這次的值相等，收到的值不送出(true)，如果不一樣才送出

// example.subscribe({
//   next: (value): void => {
//     console.log(value);
//   },
//   error: (err: Error): void => {
//     console.log("Error: " + err);
//   },
//   complete: (): void => {
//     console.log("complete");
//   }
// });

// catch----------------------------------
// let source = from(["a", "b", "c", "d", 2]).pipe(
//   zip(interval(500), (x, y) => x)
// );
// let example = source.pipe(
//   map(x => x.toUpperCase()),
//   catchError(error => of("error"))
// );

// source : ----a----b----c----d----2|
// map(x => x.toUpperCase());
// ----a----b----c----d----X|
// catch(error => Rx.Observable.of('h'))
// example: ----a----b----c----d----h|

// let source = from(["a", "b", "c", "d", 2]).pipe(
//   zip(interval(500), (x, y) => x)
// );

// let example = source.pipe(
//   map(x => x.toUpperCase()),
//   catchError((error, obs) => obs)
// );

// example.subscribe({
//   next: value => {
//     console.log(value);
//   },
//   error: err => {
//     console.log("Error: " + err);
//   },
//   complete: () => {
//     console.log("complete");
//   }
// });

// source : ----a----b----c----d----2|
//         map(x => x.toUpperCase())
//          ----a----b----c----d----X|
//         catch((error, obs) => obs)
// example: ----a----b----c----d--------a----b----c----d--..

// catch 的 callback 能接收第二個參數，這個參數會接收當前的 observalbe，
// 我們可以回傳當前的 observable 來做到重新執行

// retry------------------------------------------
// let source = from(["a", "b", "c", "d", 2]).pipe(
//   zip(interval(500), (x, y) => x)
// );
// let example = source.pipe(
//   map(x => x.toUpperCase()),
//   retry(1)
// );
// 可以設定重新跑的次數，跑完之後就會回傳error

// example.subscribe({
//   next: value => {
//     console.log(value);
//   },
//   error: err => {
//     console.log("Error: " + err);
//   },
//   complete: () => {
//     console.log("complete");
//   }
// });

// source : ----a----b----c----d----2|
// map(x => x.toUpperCase())
// ----a----b----c----d----X|
//        retry(1)
// example: ----a----b----c----d--------a----b----c----d----X|

// retryWhen---------------------------------
// let source = from(["a", "b", "c", "d", 2]).pipe(
//   zip(interval(500), (x, y) => x)
// );
// let example = source.pipe(
//   map(x => x.toUpperCase()),
//   retryWhen(errorObs => errorObs.pipe(delay(1000)))
// );

// example.subscribe({
//   next: value => {
//     console.log(value);
//   },
//   error: err => {
//     console.log("Error: " + err);
//   },
//   complete: () => {
//     console.log("complete");
//   }
// });

// retryWhen 我們傳入一個 callback，這個 callback 有一個參數會傳入一個 observable，這個 observable 不是原本的 observable(example) 而是例外事件送出的錯誤所組成的一個 observable，
// 我們可以對這個由錯誤所組成的 observable 做操作，等到這次的處理完成後就會重新訂閱我們原本的 observable。

// source : ----a----b----c----d----2|
// map(x => x.toUpperCase())
// ----a----b----c----d----X|
// retryWhen(errorObs => errorObs.delay(1000))
// example: ----a----b----c----d-------------------a----b----c----d----...

//repeat---------------------------------
// let source = from(["a", "b", "c"]).pipe(zip(interval(500), (x, y) => x));

// let example = source.pipe(repeat(2));
// 正常情況下重複執行，總共執行參數內指定的次數

// let example = source.pipe(repeat());
// 我們可以不給參數讓他無限循環

// example.subscribe({
//   next: value => {
//     console.log(value);
//   },
//   error: err => {
//     console.log("Error: " + err);
//   },
//   complete: () => {
//     console.log("complete");
//   }
// });

// source : ----a----b----c|
// repeat(2)
// example: ----a----b----c----a----b----c|

// 錯誤處理在實務應用中的小範例

let source = from(["a", "b", "c", "d", 2]).pipe(
  zip(interval(500), (x, y) => x),
  map(x => x.toUpperCase())
);

let example = source.pipe(
  catchError((error, obs) =>
    empty().pipe(
      startWith("連線發生錯誤"),
      concat(obs => obs.delay(5000))
    )
  )
);

example.subscribe({
  next: value => {
    console.log(value);
  },
  error: err => {
    console.log("Error: " + err);
  },
  complete: () => {
    console.log("complete");
  }
});
