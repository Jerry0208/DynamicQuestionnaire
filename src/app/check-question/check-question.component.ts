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
    console.log(this.questions_service);
  }

  goBack() {
    this.router.navigateByUrl('/control_tab/add_list2')
  }

  PubAndSaveData() {
    this.quiz.is_published = true;
    this.http.postApi('http://localhost:8080/quiz/create', this.quiz)
    // alert('存檔並公布成功!')
    // this.questions_service.reset();
    // this.router.navigateByUrl('/list');
  }

  saveData() {
    this.quiz.is_published = false;
    alert('僅存檔成功!')
    this.questions_service.reset();
    this.router.navigateByUrl('/list');
  }

}
