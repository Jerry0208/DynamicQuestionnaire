import { Component, HostListener } from '@angular/core';//OnDestroy、HostListener監測是否網站是否重新整理
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';// ngmodle
import { SurveyService } from '../service/survey.service';//傳遞資料到預覽畫面
import { Router } from '@angular/router';//前往下一個畫面用

// 參考老師的 Code 改寫

@Component({
  selector: 'app-anser-page-refreash',
  standalone: true,
  imports: [FormsModule,
    MatRadioModule,
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
  userName!: string;
  userPhone!: string;
  userEmail!: string;
  userAge!: string;

  // 是否有未保存的變更
  hasUnsavedChanges = true;

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges) {
      // 如果有未保存變更，阻止重新整理，顯示預設訊息
      event.preventDefault();
    }
  }

  // 多選:M 單選:S 文字輸入:T
  quest = {
    id: 1,
    title: '範例問卷標題',
    sDate: '2024/10/01',
    eDate: '2024/12/25',
    explain: '這份年度調查的說明將重點描述我們的主要目標：透過蒐集參與者的意見與經驗，了解在過去一年中\
    ，各種領域的趨勢與變化。調查的結果將提供有關使用者行為、偏好、挑戰和滿意度的深入見解\
    ，並為未來的決策和發展提供數據支援。參與者的回饋將被嚴格保密並僅用於研究目的\
    ，以確保資料的完整性和參與者的隱私。調查結果將於報告中公佈，以利更廣泛的應用並推動各項策略的有效實施。',
    questArray: [{
      questId: 1,
      need: true,
      questName: '您對過去一年公司的整體發展感到滿意嗎？',
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
      questId: 2,
      need: true,
      questName: '過去一年中，您是否達成了大部分設定的工作目標？',
      type: 'S',
      options: [
        { optionName: '是', code: 'A' },
        { optionName: '否', code: 'B' },
      ]
    },
    {
      questId: 3,
      need: true,
      questName: '您認為下列哪些因素對於提升工作效率有幫助？（多選）',
      type: 'M',
      options: [
        { optionName: '工作環境改善', code: 'A' },
        { optionName: '技術設備升級', code: 'B' },
        { optionName: '團隊合作', code: 'C' },
        { optionName: '培訓與發展機會', code: 'D' },
      ]
    },
    {
      questId: 4,
      need: false,
      questName: '請描述過去一年中您在工作上遇到的主要挑戰：',
      type: 'T',
      options: []
    },
    {
      questId: 5,
      need: false,
      questName: '您對公司未來發展有什麼建議或期望？',
      type: 'T',
      options: []
    },
    ]
  }

  constructor(
    // 當問卷回答完後要將以獲得的資料傳入 service 中，之後在預覽畫面中呈現
    private questService: SurveyService,
    //Router 你懂得
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.questService.questData) {
      this.makeQuestArray();
    } else {
      this.userName = this.questService.questData.userName;
      this.userPhone = this.questService.questData.userPhone;
      this.userEmail = this.questService.questData.userEmail;
      this.userAge = this.questService.questData.userAge;
      this.newQuestArray = this.questService.questData.questArray;
    }

  }


  makeQuestArray() {
    // 在每一筆資料裡面加入兩個欄位answer跟radioAnswer
    // 分別拿來給文字輸入(answer)跟單選(radioAnswer)放他的答案
    for (let array of this.quest.questArray) {
      //... 是指會將 quest.questArray 中所有資料加入 newQuestArray 中
      this.newQuestArray.push({ ...array, answer: '', radioAnswer: '' });
    }

    // 在問題的選擇中加入boxBoolean讓checkbox去進行資料綁定
    for (let newArray of this.newQuestArray) {
      let options = [];
      for (let option of newArray.options) {
        options.push({ ...option, boxBoolean: false });
      }
      newArray.options = options;
    }
  }

  goList() {
    this.questService.reset();
    this.router.navigateByUrl("/list")
  }

  goPreview() {
    if (this.checkNeed()) {
      this.questService.questData = {
        title: this.quest.title,
        sDate: this.quest.sDate,
        eDate: this.quest.eDate,
        explain: this.quest.explain,
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userAge: this.userAge,
        questArray: this.newQuestArray
      }

      this.router.navigate(['/check_anser']);
    };
  }

  checkNeed(): boolean {
    if (!this.userName || !this.userPhone || !this.userEmail) {
      alert('請確認必填皆有填寫');
      return false;
    };

    for (let quest of this.newQuestArray) {
      if (quest.need) {
        // 多選M 單選S 文字輸入T
        if (quest.type == 'M') {
          let check = false;
          for (let option of quest.options) {
            if (option.boxBoolean) {
              check = true;
            }
          }

          if (!check) {
            alert('請確認必填皆有填寫');
            return false;
          }

        } else if (quest.type == 'S') {
          if (!quest.radioAnswer) {
            alert('請確認必填皆有填寫');
            return false;
          }
        } else if (quest.type == 'T') {
          if (!quest.answer) {
            alert('請確認必填皆有填寫');
            return false;
          }
        }
      }
    }
    return true;
  }

}
