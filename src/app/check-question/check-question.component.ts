import { ChangeDetectionStrategy, Component } from '@angular/core';
import { New_question as question_service } from '../service/new_question.service';
import { Router } from '@angular/router';
import { HttpClientService } from '../service/api.interface';


@Component({
  selector: 'app-check-question',
  standalone: true,
  imports: [],
  templateUrl: './check-question.component.html',
  styleUrl: './check-question.component.scss',
  //dialog
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckQuestionComponent {

  constructor(private http: HttpClientService, private questions_service: question_service, private router: Router) { }

  //問卷資訊
  quiz !: question_service;

  ngOnInit(): void {
    this.quiz = this.questions_service;

  }


  go_back() {
    this.router.navigateByUrl('/control_tab/add_list2');
  }

  save_data(is_published: boolean) {

    let options_to_String: {}[] = [];

    for (let i = 0; i < this.quiz.question_list.length; i++) {
      let res = {
        quiz_id: this.quiz.id,
        ques_id: this.quiz.question_list[i].ques_id,
        ques_name: this.quiz.question_list[i].ques_name,
        required: this.quiz.question_list[i].required,
        type: this.quiz.question_list[i].type,
        options: JSON.stringify(this.quiz.question_list[i].options)
      }
      options_to_String = [...options_to_String, res];
    }

    let create_update_req = {
      id: this.quiz.id,
      name: this.quiz.name,
      description: this.quiz.description,
      start_date: this.quiz.start_date,
      end_date: this.quiz.end_date,
      is_published: is_published,
      ques_list: options_to_String
    };

    let create_or_update: string = "";
    if (create_update_req.id == 0) {
      create_or_update = 'http://localhost:8080/quiz/create'
    } else {
      create_or_update = 'http://localhost:8080/quiz/update'
    }


    this.http.postApi(create_or_update, create_update_req).subscribe(
      (res: any) => {
        if (res.code != 200) {
          alert("新增或更新失敗: " + res.massage);
          return;
        }

        // 依是否為更新回復
        if (create_update_req.id = 0) {
          //依是否為公布回復
          if (is_published) {
            alert('新增並公布成功!');
          } else {
            alert('僅新增成功!');
          }
        } else {
          //依是否為公布回復
          if (is_published) {
            alert('更新並公布成功!');
          } else {
            alert('僅更新成功!');
          }
        }

        //清空 service
        this.questions_service.reset();
        //返回首頁
        this.router.navigateByUrl('/list');

      }
    )

  }


}
