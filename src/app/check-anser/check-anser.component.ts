import { Component, HostListener } from '@angular/core';//OnDestroy、HostListener監測是否網站是否重新整理
import { SurveyService } from '../service/survey.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check-anser',
  standalone: true,
  imports: [],
  templateUrl: './check-anser.component.html',
  styleUrl: './check-anser.component.scss'
})
export class CheckAnserComponent {
  constructor(
    private surveyService: SurveyService,
    private router: Router,
    // http api 請求
    private http: HttpClient,
  ) { }

  quest: any;

  ngOnInit() {
    this.quest = this.surveyService.questData; // 獲取回答

    if(!this.quest){
      this.router.navigateByUrl("/list")
    }
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
    // 將 問題題號 跟 問題答案 整理成後端相對應的 key(Integer) : value(List<String>) 的 JSON 格式
    let answer: { [key: number]: Array<string> } = {};

    for (let i = 0; i < this.quest.questArray.length; i++) {

      let answerStr: Array<string> = [];
      // 如果是單選題
      if (this.quest.questArray[i].type == "S") {
        // 找出 與 this.quest.questArray[i].radio_answer 相對應的題目
        this.quest.questArray[i].options.forEach((item: any) => {
          if (this.quest.questArray[i].radio_answer == item.option_number) {
            answerStr.push(item.option)
          }
        })
      }

      // 如果是複選題
      if (this.quest.questArray[i].type == "M") {
        // 找出 this.quest.questArray[i].options 中box_boolean 為 true 的 選項
        this.quest.questArray[i].options.forEach((item: any) => {
          if (item.box_boolean) {
            answerStr.push(item.option)
          }
        })
      }

      // 如果是短述題
      if (this.quest.questArray[i].type == "T") {
        answerStr.push(this.quest.questArray[i].answer)
      }
      answer[this.quest.questArray[i].ques_id] = answerStr

    }

    // 發給後端的 req
    const feedback_req = {
      quiz_id: this.quest.quiz_id,
      user_name: this.quest.user_name,
      phone: this.quest.user_phone,
      email: this.quest.user_email,
      age: this.quest.user_age,
      answer: answer,
      fillin_date: new Date()
    }

    this.http.post("http://localhost:8080/quiz/fillin", feedback_req).subscribe((res: any) => {
      if(res.massage == "Email duplicated!!"){
        alert("請勿重複填寫相同問卷")
        return;
      }else{
        alert("感謝您的填寫")
      }
    })

    this.surveyService.reset();
    this.router.navigateByUrl('/list');

  }

}
