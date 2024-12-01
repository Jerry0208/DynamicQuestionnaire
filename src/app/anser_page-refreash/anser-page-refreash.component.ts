import { Component, HostListener, inject } from '@angular/core';//OnDestroy、HostListener監測是否網站是否重新整理
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';// ngmodle
import { SurveyService } from '../service/survey.service';//傳遞資料到預覽畫面
import { Router } from '@angular/router';//前往下一個畫面用
import { MatDialog } from '@angular/material/dialog'; // mat dialog
import { DialogContent } from '../dialog/dialog'; // dialog ts
import { MatButtonModule } from '@angular/material/button';// dialog 中的 mat button
import { New_question } from '../service/new_question.service';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-anser-page-refreash',
  standalone: true,
  imports: [
    FormsModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './anser-page-refreash.component.html',
  styleUrl: './anser-page-refreash.component.scss'
})

export class AnserPageRefreashComponent {


  //  單選:S 多選:M 文字輸入:T
  quest !: New_question;

  //新陣列
  newQuestArray: Array<any> = [];
  //複選題資料
  radioData!: string;
  //用戶基本資料
  user_name!: string;
  user_phone!: string;
  user_email!: string;
  user_age!: string;

  // 將 MatDialog 注入 dialog
  readonly dialog = inject(MatDialog);

  constructor(
    // 當問卷回答完後要將以獲得的資料傳入 service 中，之後在預覽畫面中呈現
    private questService: SurveyService,
    //Router
    private router: Router,
    // 問卷格式
    private quiz: New_question,
    // http api 請求
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    // 先將基本資料 quiz 放入其中
    this.quest = this.quiz

    // 如果有已填寫資料就將資料帶入 (從確認回答的預覽畫面回來時)
    if (this.questService.questData) {
      this.user_name = this.questService.questData.user_name;
      this.user_phone = this.questService.questData.user_phone;
      this.user_email = this.questService.questData.user_email;
      this.user_age = this.questService.questData.user_age;
      this.newQuestArray = this.questService.questData.questArray;
      return;
    }

    // get_ques req
    const get_ques_req = { quiz_id: this.quest.id }
    try {
      this.http.post("http://localhost:8080/quiz/get_ques", get_ques_req).subscribe((res: any) => {
        //如果請求失敗就 return
        if (res.code != 200) {
          return;
        }
        // 將問題選項取出並將被字串化的 options 轉為類別資料中
        const ques_list = res.ques_list
        ques_list.forEach((item: { quiz_id: number; ques_id: number; ques_name: string; required: boolean; type: string; options: any; }) => {
          this.quest.question_list.push({
            quiz_id: item.quiz_id,
            ques_id: item.ques_id,
            ques_name: item.ques_name,
            required: item.required,
            type: item.type,
            options: JSON.parse(item.options)
          })
        })

        this.makeQuestArray();
      })
    } catch (error) {
      throwError
    }


  }

  // 重新再入確認鍵
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  makeQuestArray() {
    // 在每一筆資料裡面加入兩個欄位answer跟radio_answer
    // 分別拿來給文字輸入(answer)跟單選(radio_answer)放他的答案
    for (let array of this.quest.question_list) {
      //... 是指會將 quest.questArray 中所有資料加入 newQuestArray 中
      this.newQuestArray.push({ ...array, answer: '', radio_answer: '' });
    }

    // 在問題的選擇中加入box_boolean讓checkbox去進行資料綁定
    for (let newArray of this.newQuestArray) {
      let options = [];
      for (let option of newArray.options) {
        option.option_number = String(option.option_number);
        options.push({ ...option, box_boolean: false, });
      }
      newArray.options = options;
    }
  }

  go_list() {
    // 開起 dialog，open 裡面的 dialog 的 class 名稱跟要傳過去的內容
    const dialogRef = this.dialog.open(DialogContent, {
      data: '你確定要離開嗎?',
      //設定長、寬
      height: "20%",
      width: "20%",
    });

    //在Dialog關閉時接到的回傳內容
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.quiz.reset();
      this.questService.reset();
      this.router.navigateByUrl("/list");
    });


  }

  goPreview() {
    // 如果必填檢查沒過，就 return
    if (!this.checkNeed()) {
      return;
    }

    this.questService.questData = {
      name: this.quest.name,
      start_date: this.quest.start_date,
      end_date: this.quest.end_date,
      description: this.quest.description,
      user_name: this.user_name,
      user_phone: this.user_phone,
      user_email: this.user_email,
      user_age: this.user_age,
      questArray: this.newQuestArray
    }

    this.router.navigate(['/check_anser']);
  }

  // 必填檢查
  checkNeed(): boolean {
    if (!this.user_name || !this.user_phone || !this.user_email) {
      alert('請確認姓名、電話、電子信箱欄位已填寫');
      return false;
    };

    for (let quest of this.newQuestArray) {
      if (quest.required) {
        // 多選M 單選S 文字輸入T
        if (quest.type == 'M') {
          let check = false;
          for (let option of quest.options) {
            if (option.box_boolean) {
              check = true;
            }
          }

          if (!check) {
            alert('請填寫第' + quest.ques_id + '題');
            return false;
          }

        } else if (quest.type == 'S') {
          if (!quest.radio_answer) {
            alert('請填寫第' + quest.ques_id + '題');
            return false;
          }
        } else if (quest.type == 'T') {
          if (!quest.answer) {
            alert('請填寫第' + quest.ques_id + '題');
            return false;
          }
        }
      }
    }
    return true;
  }


}
