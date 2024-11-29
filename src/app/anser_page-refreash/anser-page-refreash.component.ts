import { Component, HostListener, inject } from '@angular/core';//OnDestroy、HostListener監測是否網站是否重新整理
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';// ngmodle
import { SurveyService } from '../service/survey.service';//傳遞資料到預覽畫面
import { Router } from '@angular/router';//前往下一個畫面用
import { MatDialog } from '@angular/material/dialog'; // mat dialog
import { DialogContent } from '../dialog/dialog'; // dialog ts
import { MatButtonModule } from '@angular/material/button';// dialog 中的 mat button

// 參考老師的 Code 改寫

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

  //新陣列
  newQuestArray: Array<any> = [];
  //複選題資料
  radioData!: string;
  //用戶基本資料
  user_name!: string;
  user_phone!: string;
  user_email!: string;
  user_age!: string;

  // 是否有未保存的變更
  hasUnsavedChanges = true;

  // 將 MatDialog 注入 dialog
  readonly dialog = inject(MatDialog);

  constructor(
    // 當問卷回答完後要將以獲得的資料傳入 service 中，之後在預覽畫面中呈現
    private questService: SurveyService,
    //Router
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.questService.questData) {
      this.makeQuestArray();
    } else {
      this.user_name = this.questService.questData.user_name;
      this.user_phone = this.questService.questData.user_phone;
      this.user_email = this.questService.questData.user_email;
      this.user_age = this.questService.questData.user_age;
      this.newQuestArray = this.questService.questData.questArray;
    }

  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges) {
      // 如果有未保存變更，阻止重新整理，顯示預設訊息
      event.preventDefault();
    }
  }

  //  單選:S 多選:M 文字輸入:T
  quest = {
    id: 1,
    name: '範例問卷標題',
    start_date: '2024/10/01',
    end_date: '2024/12/25',
    description: '這份年度調查的說明將重點描述我們的主要目標：透過蒐集參與者的意見與經驗，了解在過去一年中\
    ，各種領域的趨勢與變化。調查的結果將提供有關使用者行為、偏好、挑戰和滿意度的深入見解\
    ，並為未來的決策和發展提供數據支援。參與者的回饋將被嚴格保密並僅用於研究目的\
    ，以確保資料的完整性和參與者的隱私。調查結果將於報告中公佈，以利更廣泛的應用並推動各項策略的有效實施。',
    question_list: [{
      topic_id: 1,
      is_necessary: true,
      topic_name: '您對過去一年公司的整體發展感到滿意嗎？',
      type: 'S',
      options: [
        { optionName: '非常滿意', code: 'A' },
        { optionName: '滿意', code: 'B' },
        { optionName: '普通', code: 'C' },
        { optionName: '不滿意', code: 'D' },
        { optionName: '非常不滿意', code: 'E' },
      ]
    },
    {
      topic_id: 2,
      is_necessary: true,
      topic_name: '過去一年中，您是否達成了大部分設定的工作目標？',
      type: 'S',
      options: [
        { optionName: '是', code: 'A' },
        { optionName: '否', code: 'B' },
      ]
    },
    {
      topic_id: 3,
      is_necessary: true,
      topic_name: '您認為下列哪些因素對於提升工作效率有幫助？（多選）',
      type: 'M',
      options: [
        { optionName: '工作環境改善', code: 'A' },
        { optionName: '技術設備升級', code: 'B' },
        { optionName: '團隊合作', code: 'C' },
        { optionName: '培訓與發展機會', code: 'D' },
      ]
    },
    {
      topic_id: 4,
      is_necessary: false,
      topic_name: '請描述過去一年中您在工作上遇到的主要挑戰：',
      type: 'T',
      options: []
    },
    {
      topic_id: 5,
      is_necessary: false,
      topic_name: '您對公司未來發展有什麼建議或期望？',
      type: 'T',
      options: []
    },
    ]
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
        options.push({ ...option, box_boolean: false });
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
      this.questService.reset();
      this.router.navigateByUrl("/list")
    });


  }

  goPreview() {
    if (this.checkNeed()) {
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
    };
  }

  checkNeed(): boolean {
    if (!this.user_name || !this.user_phone || !this.user_email) {
      alert('請確認姓名、電話、電子信箱欄位已填寫');
      return false;
    };

    for (let quest of this.newQuestArray) {
      if (quest.is_necessary) {
        // 多選M 單選S 文字輸入T
        if (quest.type == 'M') {
          let check = false;
          for (let option of quest.options) {
            if (option.box_boolean) {
              check = true;
            }
          }

          if (!check) {
            alert('請填寫第' + quest.topic_id + '題');
            return false;
          }

        } else if (quest.type == 'S') {
          if (!quest.radio_answer) {
            alert('請填寫第' + quest.topic_id + '題');
            return false;
          }
        } else if (quest.type == 'T') {
          if (!quest.answer) {
            alert('請填寫第' + quest.topic_id + '題');
            return false;
          }
        }
      }
    }
    return true;
  }


}
