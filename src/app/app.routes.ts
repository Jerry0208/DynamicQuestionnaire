import { Routes } from '@angular/router';
// 1. import {Component的class名稱} from './anser-page/anser-page.component'(component 路徑);
// 2. 可以到 專案名稱.config.ts 內確認是否 import 成功
import { ListComponent } from './list/list.component';
import { CheckAnserComponent } from './check-anser/check-anser.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AddListComponent } from './add-list/add-list.component';
import { ControlTabComponent } from './control-tab/control-tab.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddList2Component } from './add-list2/add-list2.component';
import { AnserPageRefreashComponent } from './anser-page-refreash/anser-page-refreash.component';
import { CheckQuestionComponent } from './check-question/check-question.component';
import { LookAnserComponent } from './look-anser/look-anser.component';


export const routes: Routes = [
  // 進入網站時，導向指定網頁(list)
  { path: '', redirectTo: 'list', pathMatch: 'full' },

  // 路徑寫法:{path:'path名(自訂)', component : AnserPageComponent(上面import進來的component名)}, {下一個路徑}, ....
  // 打路徑時自動Import:在輸入compnent 時 讓系統自動匯入 import 的部分
  { path: 'list', component: ListComponent },
  { path: 'check_anser', component: CheckAnserComponent },
  {
    path: 'control_tab', component: ControlTabComponent,
    children: [
      { path: 'statistics', component: StatisticsComponent },
      { path: 'add_list1', component: AddListComponent },
      { path: 'add_list2', component: AddList2Component },
      { path: 'feedback', component: FeedbackComponent }
    ]
  },
  { path: 'statistics', component: StatisticsComponent },
  {path:'new_anwser_page' , component:AnserPageRefreashComponent},
  {path:'check_question', component:CheckQuestionComponent},
  {path:'look_answer', component:LookAnserComponent}

];
