import { Injectable } from '@angular/core';

//將該類別在程式啟動時全部的TS都能夠利用或是 import 此類別，類似一種宣告(固定寫法)
@Injectable({
  providedIn: 'root'
})

//問卷收發的 interface 和 class
// 沒有Id 是因為 SQL 會自動生成


export class NewQuest implements QuestData {
  //問卷基本資訊
  //問卷名
  title!: string;
  //問卷描述
  explain!: string;
  //狀態
  status: string = '';
  //起迄日期
  sDate!: string;
  eDate!: string;
  //問卷內容
  questArray!: any ;


  reset() {
    this.title = '';
    this.explain = '';
    this.status = '';
    this.sDate = '';
    this.eDate = '';
    this.questArray = [];
  }

}

//問卷基本資訊
interface QuestData {
  //問卷名
  title: string;
  //問卷描述
  explain: string;
  //狀態
  status: string;
  //起迄日期
  sDate: string;
  eDate: string;
  //問卷內容
  questArray: QuestArray[];

}

//問卷內容
interface QuestArray {
  //問題的ID
  questId: number;
  //問題名
  questName: string;
  //必填欄位
  need: boolean;
  //問題類型
  type: string;
  //題目 (短述題為空值)
  options: Array<JSON | null>;
}
