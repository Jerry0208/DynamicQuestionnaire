import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class QuesStatus{

  //紀錄問卷狀態
  quesStatus !: string;

  //隱藏返回按鈕
  showBackButton !:boolean ;
}
