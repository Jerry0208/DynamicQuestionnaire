// survey.service.ts
import { Injectable } from '@angular/core';

//將該類別在程式啟動時全部的TS都能夠利用或是 import 此類別，類似一種宣告(固定寫法)
@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  questData :any;

  reset(){
    this.questData = null
  }
}
