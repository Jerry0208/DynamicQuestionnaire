import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { ControlTabComponent } from '../control-tab/control-tab.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

  constructor(private router: Router, private test: ControlTabComponent) { }

  //把原本在統計畫面上的返回畫面藏起來
  showBackButton: boolean = true;

  quesStatus = sessionStorage.getItem("quesStatus")

  ngOnInit(): void {
    if (this.router.url != "/statistics") {
      this.showBackButton = false
    }
  }

  ques_status_check(quesStatus: any) {
    if (quesStatus == "進行中"
      || quesStatus == "已結束") {
      this.showBackButton = false;
      // this.tabLink.quesStatus(quesStatus);
    }
  }


  // S 單選 , M 多選 , T 短述題
  questData = {
    questName: '範例問卷標題',
    sDate: '2024/10/01',
    eDate: '2024/12/25',
    explain: '這份年度調查的說明將重點描述我們的主要目標：透過蒐集參與者的意見與經驗，了解在過去一年中\
    ，各種領域的趨勢與變化。調查的結果將提供有關使用者行為、偏好、挑戰和滿意度的深入見解\
    ，並為未來的決策和發展提供數據支援。參與者的回饋將被嚴格保密並僅用於研究目的\
    ，以確保資料的完整性和參與者的隱私。調查結果將於報告中公佈，以利更廣泛的應用並推動各項策略的有效實施。',
    quest: [
      {
        id: '1',
        type: 'S',
        name: '您對過去一年公司的整體發展感到滿意嗎？',
        labels: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意'],
        data: [50, 100, 150, 50, 5],
        color: ['red', 'blue', 'green', 'yellow', 'purple']
      },
      {
        id: '2',
        type: 'S',
        name: '過去一年中，您是否達成了大部分設定的工作目標？',
        labels: ['是', '否'],
        data: [170, 185],
        color: ['red', 'blue']
      }
      ,
      {
        id: '3',
        type: 'M',
        name: '您認為下列哪些因素對於提升工作效率有幫助？（多選）',
        labels: ['工作環境改善', '技術設備升級', '團隊合作', '培訓與發展機會'],
        data: [300, 150, 350, 500],
        color: ['red', 'blue', 'green', 'yellow']
      }
      ,
      {
        id: '4',
        type: 'T',
        name: '請描述過去一年中您在工作上遇到的主要挑戰：',
        labels: [],
        data: ['效率化', '不要讓問題發生', '睡意'],
        color: ['red', 'blue', 'green']
      }
      ,
      {
        id: '5',
        type: 'T',
        name: '您對公司未來發展有什麼建議或期望？',
        labels: [],
        data: ['員工食堂', '加新', '購買BD-3000 luxury droid'],
        color: ['red', 'blue', 'green']
      }
    ]
  }

  goBack() {
    this.router.navigate(['/list']);
  }


}
