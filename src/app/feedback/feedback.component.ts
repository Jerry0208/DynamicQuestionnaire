import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ControlTabComponent } from '../control-tab/control-tab.component';
import { New_question } from '../service/new_question.service';
import { HttpClient } from '@angular/common/http';
import { Feedback_dto } from '../service/feedback_dto.service';


export interface Feedback {
  serial_number: number;
  user_name: string;
  phone: string;
  email: string;
  age: number;
  fillin_date: Date;
  answer: answer[];
}

export interface answer {
  ques_id: number;
  ques_name: string;
  answer: Array<string>;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements AfterViewInit {

  constructor(
    private tabLink: ControlTabComponent,
    private router: Router,
    private answer: New_question,
    private http: HttpClient,
    private feedback_dto : Feedback_dto,
  ) { }

  ngOnInit(): void {
    // 讓tab標籤亮起來
    this.tabLink.switchTab('/control_tab/feedback')
    this.tabLink.quesStatus(sessionStorage.getItem("quesStatus"))

    if(this.answer.id != 0){
      sessionStorage.setItem("feedback_quiz_id", this.answer.id.toString())
    }

    this.http.get("http://localhost:8080/quiz/feedback?quizId=" + Number(sessionStorage.getItem("feedback_quiz_id"))).subscribe((res: any) => {
      let user_data_list: Feedback[] = [] // 空陣列初始化
      const userMap = new Map<string, number>(); // 使用 Map 儲存 email 和對應索引值

      // 主迴圈處理 feedback
      for (let i = 0; i < res.feedback_dto_list.length; i++) {
        const feedback = res.feedback_dto_list[i];

        // 資料完整性檢查
        if (!feedback.ques_id || !feedback.ques_name || !feedback.email) {
          console.warn('Incomplete data:', feedback);
          continue; // 跳過此筆資料
        }

        // JSON 解析回答內容
        let parsedAnswer;
        try {
          parsedAnswer = JSON.parse(feedback.answer_str);
        } catch (error) {
          console.error('Invalid JSON format for answer:', feedback.answer_str);
          parsedAnswer = feedback.answer_str; // 或設定為預設值
        }

        // 檢查該 email 是否已存在
        const userIndex = userMap.get(feedback.email);

        if (userIndex !== undefined) {
          // 如果已存在該使用者，更新回答
          user_data_list[userIndex].answer.push({
            ques_id: feedback.ques_id,
            ques_name: feedback.ques_name,
            answer: parsedAnswer,
          });
        } else {
          // 如果是新使用者，新增資料
          user_data_list.push({
            serial_number: user_data_list.length + 1, // 按目前陣列長度生成序號
            user_name: feedback.user_name,
            phone: feedback.phone,
            email: feedback.email,
            age: feedback.age,
            fillin_date: feedback.fillin_date,
            answer: [
              {
                ques_id: feedback.ques_id,
                ques_name: feedback.ques_name,
                answer: parsedAnswer,
              },
            ],
          });

          // 更新 Map 中的 email 索引
          userMap.set(feedback.email, user_data_list.length - 1);
        }
      }

      console.log(user_data_list);
      this.dataSource.data = user_data_list
    })

  }

  //table名、table資料來源
  displayedColumns: string[] = ['serial_number', 'user_name', 'fillin_date', 'lookAnswer'];
  dataSource = new MatTableDataSource<Feedback>();


  //顯示頁數
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //顯示頁數、將預設顯示的英文更改成中文
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "顯示筆數:"
    this.dataSource.paginator._intl.firstPageLabel = "第一頁:"
    this.dataSource.paginator._intl.previousPageLabel = "上一頁"
    this.dataSource.paginator._intl.nextPageLabel = "下一頁"
    this.dataSource.paginator._intl.lastPageLabel = "最後一頁"
  }

  to_look_answer(element : Feedback) {
    this.feedback_dto.user_name = element.user_name;
    this.feedback_dto.phone = element.phone;
    this.feedback_dto.email = element.email;
    this.feedback_dto.age = element.age;
    this.feedback_dto.answer = element.answer;
  }

  to_statistics() {
    this.router.navigateByUrl('/statistics')
  }

}
