import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { New_question } from '../service/new_question.service';
import { ControlTabComponent } from '../control-tab/control-tab.component';

@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss'
})
export class AddListComponent {
  constructor(private router: Router, private quesTemp: New_question, private tabLink: ControlTabComponent) { }

  //問卷id
  id !: number;
  //問卷名、問卷描述
  name !: string;
  description!: string;

  //防止顯選結束日期後再選開始日期
  end_date_maker = true

  //開始和結束日期
  start_date !: Date;
  end_date !: Date;

  //日期選擇範圍 : 當日 ~ 選擇日期
  date = new Date();
  defaultDate: string = "";

  //在頁面開啟時
  ngOnInit(): void {

    //讓 tab 亮起來
    this.tabLink.switchTab('/control_tab/add_list1')

    //讓tab沒辦法被點選
    this.tabLink.quesStatus(sessionStorage.getItem("quesStatus"))

    //grtMonth 回傳範圍 : 0 ~ 11 對應 1 ~ 12 月
    let monNum: number = this.date.getMonth() + 1;
    //getDate 回傳當日日期，日期小於10時會回傳單位數
    let dateNum: number = this.date.getDate();
    let monStr: string;
    let dateStr: string;

    //判斷月份
    if (monNum < 10) {
      monStr = "0" + (monNum)
    } else {
      monStr = monNum.toString();
    }

    //判斷日期
    if (dateNum < 10) {
      dateStr = "0" + (dateNum)
    } else {
      dateStr = dateNum.toString();
    }
    // <input  type : date> 接收日期格式 : yyyy-mm-dd
    this.defaultDate = this.date.getFullYear() + "-" + monStr + "-" + dateStr;

    //判定是否為修改問卷
    this.reset()


  }

  //判定是否為修改問卷
  reset() {
    if (!this.quesTemp.name && !this.quesTemp.description && !this.quesTemp.start_date && !this.quesTemp.end_date) {
      this.end_date_maker = true;
    } else {
      this.name = this.quesTemp.name;
      this.description = this.quesTemp.description;
      this.start_date = this.quesTemp.start_date;
      this.end_date = this.quesTemp.end_date;
      this.end_date_maker = false;
    }
  }

  start_date_detector() {
    if (this.start_date) {
      this.end_date_maker = false
    }
    if(this.end_date > this.start_date) {
      this.start_date = this.end_date
    }
  }

  //返回List
  backList() {
    this.router.navigate(['/list'])
    this.quesTemp.reset()
  }

  checkForm() {
    if (!this.name) {
      alert('請填寫問卷名稱')
      return false
    }

    if (!this.description) {
      alert('請填寫問卷描述')
      return false
    }

    if (!this.start_date) {
      alert('請選擇問卷開始日期')
      return false
    }

    if (!this.end_date) {
      alert('請選擇問卷結束日期')
      return false
    }

    return true
  }

  //設定問卷基本資訊，後前往下一頁撰寫問卷問題
  next() {
    if (!this.checkForm()) {
      return
    }
    //問卷基本資訊
    this.quesTemp.name = this.name;
    this.quesTemp.description = this.description;
    this.quesTemp.start_date = this.start_date;
    this.quesTemp.end_date = this.end_date;
    //讓上方 tab 隨著換頁移動
    this.tabLink.switchTab('/control_tab/add_list2')
    this.router.navigateByUrl('/control_tab/add_list2')
  }

}
