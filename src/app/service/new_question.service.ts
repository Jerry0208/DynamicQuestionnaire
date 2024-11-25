import { Injectable } from '@angular/core';

//將該類別在程式啟動時全部的TS都能夠利用或是 import 此類別，類似一種宣告(固定寫法)
@Injectable({
  providedIn: 'root'
})

//問卷收發的 interface 和 class
// 沒有Id 是因為 SQL 會自動生成


export class New_question implements question_data {
  //問卷基本資訊
  //問卷名
  name!: string;
  //問卷描述
  description!: string;
  //狀態
  status: string = '';
  //起迄日期
  start_date!: Date;
  end_date!: Date;
  // 是否公布(true:公布, false:不公布)
  is_published !: boolean;
  //問卷內容
  question_list!: QuestArray[] ;


  reset() {
    this.name = '';
    this.description = '';
    this.status = '';
    this.start_date = new Date();
    this.end_date = new Date();
    this.is_published = false;
    this.question_list = [];
  }

}

//問卷基本資訊
interface question_data {
  //問卷名
  name: string;
  //問卷描述
  description: string;
  //狀態
  status: string;
  //起迄日期
  start_date: Date;
  end_date: Date;
  //問卷內容
  question_list: QuestArray[];

}

//問卷內容
interface QuestArray {
  //問題的ID
  id: number;
  //問題名
  title: string;
  //必填欄位
  is_necessary: boolean;
  //問題類型
  type: string;
  //題目 (短述題為空值)
  option_list: option[];
}

interface option {
  name : String;
  code : String;
}
