import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { New_question } from '../service/new_question.service';


export interface Statistics_res {
  code: number;
  massage: string;
  statistics_list: Statistics_list[];
}

export interface Statistics_list {
  option_count_map: { [key: string]: number };
  ques_id: number;
  ques_name: string;
  quiz_name: string;
}



@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

  constructor(
    // http api 請求
    private http: HttpClient,
    private router: Router,
    private quiz_info: New_question,
  ) { }

  //把原本在統計畫面上的返回畫面藏起來
  showBackButton: boolean = true;

  quesStatus = sessionStorage.getItem("quesStatus")


  statistics_res !: Statistics_res;
  ngOnInit(): void {

    // 獲得問卷基本資料
    let quiz_basic_info = {
      id: this.quiz_info.id,
      name: this.quiz_info.name,
      description: this.quiz_info.description,
      start_date: this.quiz_info.start_date,
      end_date: this.quiz_info.end_date
    }

    // 確保資料存在
    if (this.quiz_info.id !== 0) {
      sessionStorage.setItem("quiz_basic_info", JSON.stringify(quiz_basic_info));
    } else {
      quiz_basic_info = JSON.parse(sessionStorage.getItem("quiz_basic_info")!);
    }

    // 發送 req 並整理資料成統計圖表所需要的格式
    const quiz_id = quiz_basic_info.id
    this.http.get("http://localhost:8080/quiz/statistics?quizId=" + quiz_id.toString()).subscribe((res: any) => {
      this.statistics_res = res

      let questDataa = {
        name: quiz_basic_info.name,
        start_date: quiz_basic_info.start_date,
        end_date: quiz_basic_info.end_date,
        description: quiz_basic_info.description,
        quest: new Array<any>
      }
      this.statistics_res.statistics_list.forEach(item => {
        const colorCount = Object.keys(item.option_count_map).length;
        if (colorCount !== 0) {
          questDataa.quest.push({
            ques_id: item.ques_id,
            ques_name: item.ques_name,
            labels: Object.keys(item.option_count_map),
            data: Object.values(item.option_count_map),
            color: this.generateColors(colorCount),
            Type : "C" // Choice
          })
        } else {
          questDataa.quest.push({
            ques_id: item.ques_id,
            ques_name: item.ques_name,
            labels: [],
            data: [],
            color: [],
            Type:"T" // Text
          })
        }

      })

      // 1. 改參數名稱
      //  1.1 畫面顯示
      // 2. 取得簡答題回答


    })


  }

  generateColors(count: number): string[] {
    const baseColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'teal', 'pink', 'brown', 'cyan'];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
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

    if (this.quesStatus == "進行中" || this.quesStatus == "已結束") {
      this.router.navigate(['/control_tab/feedback']);
      return;
    }

    this.router.navigate(['/list']);
  }


}
