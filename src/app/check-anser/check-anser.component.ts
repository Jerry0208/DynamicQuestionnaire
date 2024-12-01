import { Component, HostListener } from '@angular/core';//OnDestroy、HostListener監測是否網站是否重新整理
import { SurveyService } from '../service/survey.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-check-anser',
  standalone: true,
  imports: [],
  templateUrl: './check-anser.component.html',
  styleUrl: './check-anser.component.scss'
})
export class CheckAnserComponent {
  constructor(private surveyService: SurveyService, private router: Router) {}
  quest: any;

  ngOnInit() {
    this.quest = this.surveyService.questData; // 獲取回答
  }

  // 重新再入確認鍵
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  backPage() {
    this.router.navigateByUrl('/new_anwser_page')
  }

  goLsit() {
    alert("感謝您的填寫")
    const feedback = {
      quiz_id : this.quest.quiz_id,
      ques_id : this.quest.ques_id,
      user_name : this.quest.user_name,
      phone : this.quest.user_phone,
      email : this.quest.user_email,
      age : this.quest.user_age,
      fillin_date : moment().format('YYYY-MM-DD'),
      // 答案資料型態 string ，格式未知
      // answer : ,
    }
    this.surveyService.reset();
    this.router.navigateByUrl('/list');
  }

}
