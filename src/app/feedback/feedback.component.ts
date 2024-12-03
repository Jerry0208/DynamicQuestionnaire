import { user } from './../../../../demo_1/src/app/app.component';
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



export interface answerTemp {
  serial_number: number;
  user_name: string;
  fillin_date: string;
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
  ) { }

  ngOnInit(): void {
    // 讓tab標籤亮起來
    this.tabLink.switchTab('/control_tab/feedback')
    this.tabLink.quesStatus(sessionStorage.getItem("quesStatus"))
    this.http.get("http://localhost:8080/quiz/feedback?quizId=" + this.answer.id).subscribe((res: any) => {
      console.log(res);
      let user_data_list: Feedback[] = []

      for (let i = 0; i < res.feedback_dto_list.length; i++) {

        for (let l = 0; l < user_data_list.length; l++) {
          if (user_data_list[l].email != res.feedback_dto_list[i].emil) {
            user_data_list.push({
              serial_number: i,
              user_name: res.feedback_dto_list[i].user_name,
              phone: res.feedback_dto_list[i].phone,
              email: res.feedback_dto_list[i].email,
              age: res.feedback_dto_list[i].age,
              fillin_date: res.feedback_dto_list[i].fliin_date,
              answer : [] // 還沒寫
            })
          }
        }

      }


    })

  }


  //假資料
  listData: answerTemp[] = [
    { serial_number: 1, user_name: "aaa", fillin_date: "2024-01-01 10:00", },
    { serial_number: 2, user_name: "bbb", fillin_date: "2024-04-01 10:00", },
    { serial_number: 3, user_name: "ccc", fillin_date: "2024-07-01 10:00", },
    { serial_number: 4, user_name: "ddd", fillin_date: "2024-01-01 10:00", },
    { serial_number: 5, user_name: "eee", fillin_date: "2024-04-01 10:00", },
  ];

  //table名、table資料來源
  displayedColumns: string[] = ['serial_number', 'user_name', 'fillin_date', 'lookAnswer'];
  dataSource = new MatTableDataSource<answerTemp>(this.listData);


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

  //取得問卷資訊(之後要傳到後台)
  quesInfo(element: Element) {
    console.log(element);
  }

  to_statistics() {
    this.router.navigateByUrl('/statistics')
  }

}
