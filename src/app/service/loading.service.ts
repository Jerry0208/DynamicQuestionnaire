//需導入 Injectable 和 httpClient
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

//注入器
@Injectable({
  providedIn: 'root'
})

export class LoadingService{
//可被訂閱的變數，初始值為 boolean : false ，可以依網頁的狀態做變更
 private _loading$ = new BehaviorSubject<boolean>(false);
 //去接 _loading$ 的值
 loading$ = this._loading$.asObservable();

 constructor() {}

 //將狀態改成 true
 show() {
  this._loading$.next(true)
 }

 //將狀態改成 false
 hide() {
  this._loading$.next(false)
 }
}
