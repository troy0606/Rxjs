import { interval, of, timer, from, zip } from "rxjs";
import {
  take,
  concatAll,
  map,
  switchAll,
  mergeAll,
  delay,
  concatMap,
  switchMap,
  mergeMap,
  window,
  scan,
  windowToggle,
  tap,
  groupBy,
  toArray
} from "rxjs/operators";

// let source1 = interval(2000).pipe(take(5))
// let example = source1.pipe(
//   map(val=> of(val + 10),
//   concatAll()
// ))

// example.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// let obs1 = interval(1000).pipe(take(5))
// let obs2 = interval(500).pipe(take(2))
// let obs3 = interval(2000).pipe(take(1))

// let source = of(obs1,obs2,obs3).pipe(concatAll())
// 原本是三個observable裝成一個，用concatAll壓平，不再回傳observable，依序回傳值

// source.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// switch------------------------------------
// let obs1 = interval(1000).pipe(take(5))
// let obs2 = interval(500).pipe(take(2))
// let obs3 = interval(2000).pipe(take(1))

// let source = of(obs1,obs2,obs3).pipe(switchAll())

// source.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// 會在新的 observable 送出後直接處理新的 observable 不管前一個 observable 是否完成，每當有新的 observable
// 送出就會直接把舊的 observable 退訂(unsubscribe)，永遠只處理最新的 observable

// mergeAll-----------------------------------------------------
// let obs1 = interval(1000).pipe(take(5))
// let obs2 = interval(500).pipe(take(2))
// let obs3 = interval(2000).pipe(take(1))

// let source = of(obs1,obs2,obs3).pipe(mergeAll())

// source.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// 所有的 observable 是並行(Parallel)處理的，也就是說 mergeAll 不會像 switch 一樣退訂(unsubscribe)原先的 observable
// 而是並行處理多個 observable，所有observable完成後才complete

// concatMap---------------------------------------------------
// let source = of(5000,4000,3000,2000,1000)
// let example = source.pipe(
//   concatMap(val=>of(`Delay By: ${val} ms`).pipe(delay(val)))
// )
// concatMap 其實就是 map 加上 concatAll 的簡化寫法
// concatMap 用在可以確定內部的 observable 結束時間比外部 observable 發送時間來快的情境，並且不希望有任何並行處理行為，
// 適合少數要一次一次完成到底的的 UI 動畫或特別的 HTTP request 行為。

// example.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : 54321
//         concatMap(val=>of(`Delay By: ${val} ms`).pipe(delay(val)))
// example: --------5------4----3--2-10|

// switchMap----------------------------------------------------
// let source = timer(0,5000);
// let example = source.pipe(switchMap(()=> interval(500)))
//只取最後一個最新的observable
// switchMap 用在只要最後一次行為的結果，適合絕大多數的使用情境

// example.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// mergeMap----------------------------------------------------
// let source = timer(0,5000);
// let example = source.pipe(mergeMap(()=> interval(500),,3))
// 會同時跑多個observable
// mergeMap 第三個參數可船同時並行數量限制
// mergeMap 用在並行處理多個 observable，適合需要並行處理的行為，像是多個 I/O 的並行處理。

// example.subscribe({
//   next: (value):void => { console.log(value); },
//   error: (err: Error):void => { console.log('Error: ' + err); },
//   complete: ():void => { console.log('complete'); }
// })

// source : -----1-----2------3------4------5-...
// source : --------------------------------1------2-----3------4------5...
// source : -----------------------------------------------------------1...
// source.pipe(mergeMap(()=> interval(500)))
// example: ------1-----2------3------4-----(1/5)--(2/6)--(3/7)

// window--------------------------------------------------
// let source = timer(0, 1000);
// let example = source.pipe(window(interval(3000)));
// let count = example.pipe(scan((acc, cur) => acc + 1, 0));

// let subscribe = count.subscribe(val => console.log(`window ${val}`));
// let subscribe2 = example.pipe(mergeAll()).subscribe(val => console.log(val));

// window 會把元素拆分出來放到新的 observable 變成
// Observable<T> => Observable<Observable<T>>

// windowToggle-----------------------------------------------
// 每隔一秒發送observable
// let source = timer(0, 1000);
// // toggle window 每5秒
// let toggle = interval(5000);
// // 每五秒把observable變成window
// let example = source.pipe(
//   windowToggle(toggle, val => interval(val * 1000)),
//   tap(_ => console.log(`new window`))
// );

// let subscribe = example
//   .pipe(
//     // window發送巢狀的observable
//     mergeAll()
//     /*
//             output:
//             "NEW WINDOW!"
//             5
//             "NEW WINDOW!"
//             10
//             11
//             "NEW WINDOW!"
//             15
//             16
//             "NEW WINDOW!"
//             20
//             21
//             22
//           */
//   )
//   .subscribe(val => console.log(val));

// groupBy----------------------------------------
// 它可以幫我們把相同條件的元素拆分成一個 Observable

// let source = interval(300).pipe(take(5))
// let example = source.pipe(groupBy(x=> x%2))

// example.subscribe(console.log)

// type person = {
//   name: string;
//   score: number,
//   subject: string
// }
// let people: person[] = [
//   { name: "Anna", score: 100, subject: "English" },
//   { name: "Anna", score: 90, subject: "Math" },
//   { name: "Anna", score: 96, subject: "Chinese" },
//   { name: "Jerry", score: 80, subject: "English" },
//   { name: "Jerry", score: 100, subject: "Math" },
//   { name: "Jerry", score: 90, subject: "Chinese" }
// ];
// let source = from(people).pipe(zip(interval(300), (x) => x));
// let example = source.groupBy((person: person) => person.name).map((group: any[])=>group.reduce((acc,cur)=>({
//   name: cur.name,
//   score: cur.score + acc.score
// })))
// .mergeAll();

// example.subscribe(console.log)

// source : --o--o--o--o--o--o|
//   groupBy(person => person.name)
     
//   : --i--------i------|
//       \        \
//       \         o--o--o|
//        o--o--o--|
       
// map(group => group.reduce(...))
  
//   : --i---------i------|
//       \         \
//       o|        o|
   
//         mergeAll()
// example: --o---------o------| 

// const people = [
//   { name: 'Sue', age: 25 },
//   { name: 'Joe', age: 30 },
//   { name: 'Frank', age: 25 },
//   { name: 'Sarah', age: 35 }
// ];
// // 发出每个 people
// const source = from(people);
// // 根据 age 分组
// const example = source.pipe(
//   groupBy(person => person.age),
//   // 为每个分组返回一个数组
//   mergeMap(group => group.pipe(toArray()))
//   // toArray() 在observable完成後將值轉為array
// );
// /*
//   输出:
//   [{age: 25, name: "Sue"},{age: 25, name: "Frank"}]
//   [{age: 30, name: "Joe"}]
//   [{age: 35, name: "Sarah"}]
// */
// const subscribe = example.subscribe(val => console.log(val));

