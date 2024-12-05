import { Injectable } from '@angular/core';

//將該類別在程式啟動時全部的TS都能夠利用或是 import 此類別，類似一種宣告(固定寫法)
@Injectable({
  providedIn: 'root'
})

//問卷收發的 interface 和 class
// 沒有Id 是因為 SQL 會自動生成

export class Feedback_dto implements Feedback_dto_ifs {
  user_name !: string;
  phone!: string;
  email!: string;
  age!: number;
  answer!: {
    ques_id: number;
    ques_name: string;
    answer: Array<string>;
  }[];

  reset(){
    this.user_name = '';
    this.phone = '';
    this.email = '';
    this.age = 0;
    this.answer = [];
  }
}

export interface Feedback_dto_ifs {
  user_name: string;
  phone: string;
  email: string;
  age: number;
  answer: {
    ques_id: number;
    ques_name: string;
    answer: Array<string>;
  }[];

}
