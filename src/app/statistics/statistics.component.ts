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

  // 整理好的圖表數據
  questData !: any;

  // 問卷狀態(如果有問卷狀態就返回後台沒有就回前台)
  quesStatus = sessionStorage.getItem("quesStatus")

  // statistics 接 api 回來的數據
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

      let questData = {
        name: quiz_basic_info.name,
        start_date: quiz_basic_info.start_date,
        end_date: quiz_basic_info.end_date,
        description: quiz_basic_info.description,
        quest: new Array<any>
      }
      this.statistics_res.statistics_list.forEach(item => {
        const colorCount = Object.keys(item.option_count_map).length;
        if (colorCount !== 0) {
          questData.quest.push({
            id: item.ques_id,
            name: item.ques_name,
            labels: Object.keys(item.option_count_map),
            data: Object.values(item.option_count_map),
            color: this.generateColors(colorCount),
            Type : "C" // Choice
          })
        } else {
          questData.quest.push({
            id: item.ques_id,
            name: item.ques_name,
            labels: [],
            data: [],
            color: [],
            Type:"T" // Text
          })
        }

      })
      this.questData = questData
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



  goBack() {

    if (this.quesStatus == "進行中" || this.quesStatus == "已結束") {
      this.router.navigate(['/control_tab/feedback']);
      return;
    }

    this.router.navigate(['/list']);
  }


}
