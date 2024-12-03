import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-look-anser',
  standalone: true,
  imports: [],
  templateUrl: './look-anser.component.html',
  styleUrl: './look-anser.component.scss'
})
export class LookAnserComponent {
  constructor(private router:Router) {}
  // S 單選 , M 多選 , T 短述題
  ansesr = {
    id:1,
    user_name:'王曉明',
    phone:'0933567895',
    email:'abc123@gmail.com',
    age:'25',
    name: '範例問卷標題',
    start_date: '2024/10/01',
    end_date: '2024/12/25',
    description: '這份年度調查的說明將重點描述我們的主要目標：透過蒐集參與者的意見與經驗，了解在過去一年中\
    ，各種領域的趨勢與變化。調查的結果將提供有關使用者行為、偏好、挑戰和滿意度的深入見解\
    ，並為未來的決策和發展提供數據支援。參與者的回饋將被嚴格保密並僅用於研究目的\
    ，以確保資料的完整性和參與者的隱私。調查結果將於報告中公佈，以利更廣泛的應用並推動各項策略的有效實施。',
    options: [{
      ques_id: 1,
      need: true,
      questName: '您對過去一年公司的整體發展感到滿意嗎？',
      type: 'S',
      radioAnswer: 'A',
      answer:'',
      options: [
        { option: '非常滿意', code: 'A', boxBoolean: false },
        { option: '滿意', code: 'B', boxBoolean: false },
        { option: '普通', code: 'C', boxBoolean: false },
        { option: '不滿意', code: 'D', boxBoolean: false },
        { option: '非常不滿意', code: 'E', boxBoolean: false },
      ]
    },
    {
      ques_id: 2,
      need: true,
      questName: '過去一年中，您是否達成了大部分設定的工作目標？',
      type: 'S',
      radioAnswer: 'B',
      answer:'',
      options: [
        { option: '是', code: 'A' , boxBoolean : false},
        { option: '否', code: 'B' , boxBoolean : false},
      ]
    },
    {
      ques_id: 3,
      need: true,
      questName: '您認為下列哪些因素對於提升工作效率有幫助？（多選）',
      type: 'M',
      radioAnswer: '',
      answer:'',
      options: [
        { option: '工作環境改善', code: 'A' , boxBoolean : false},
        { option: '技術設備升級', code: 'B' , boxBoolean : true},
        { option: '團隊合作', code: 'C' , boxBoolean : false},
        { option: '培訓與發展機會', code: 'D' , boxBoolean : true},
      ]
    },
    {
      ques_id: 4,
      need: false,
      questName: '請描述過去一年中您在工作上遇到的主要挑戰：',
      type: 'T',
      radioAnswer: '',
      answer:'示範回答1',
      options: []
    },
    {
      ques_id: 5,
      need: false,
      questName: '您對公司未來發展有什麼建議或期望？',
      type: 'T',
      radioAnswer: '',
      answer:'示範回答2',
      options: []
    },
    ]
  }

  backPage(){
    this.router.navigateByUrl('/control_tab/feedback')
  }

}
