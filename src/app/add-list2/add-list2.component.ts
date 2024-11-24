import { FormsModule, } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select';//selcet
import { MatIconModule } from '@angular/material/icon';//Icon
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Table
import { MatCheckboxModule } from '@angular/material/checkbox'; //必選功能
import { SelectionModel } from '@angular/cdk/collections';// Table 選取功能
import { Router } from '@angular/router';
import { New_question } from '../service/new_question.service';//service
import { ControlTabComponent } from '../control-tab/control-tab.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface questionTemp {
  id: number;
  title: string;
  is_necessary: boolean;
  type: string;
  option_list : any;
}

@Component({
  selector: 'app-add-list2',
  standalone: true,
  imports: [
    FormsModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    CommonModule,
  ],
  templateUrl: './add-list2.component.html',
  styleUrl: './add-list2.component.scss',
})



export class AddList2Component {

  constructor(private router: Router, private newQuest: New_question, private tabLink: ControlTabComponent) { }

  //接網頁資料 ngModle
  id: number = 0;

  title !: string;

  is_necessary: boolean = false;

  type : string = 'S';

  options: string = '';

  //再編輯模式
  rewrite_mode: boolean = false

  //選擇題陣列
  options_list: Array<string> = ['',''];

  //增加選項
  autoArrayGenerater() {
    if(this.options_list.length >= 10){
      alert("選項最多10個");
      return;
    }

    this.options_list.push('')
  }

  //刪除選項
  deleteOption(index: number) {
    this.options_list.splice(index, 1)
  }

  //關閉選項
  closeOption(){
    if(this.type == "T" || this.type == ''){
      return true;
    }
    return false
  }

  //table
  displayedColumns: string[] = ['select', 'id', 'title', 'type', 'is_necessary', 'rewrite'];
  dataSource = new MatTableDataSource<questionTemp>();
  //table selection
  selection = new SelectionModel<questionTemp>(true, []);

  ngOnInit(): void {
    this.tabLink.switchTab('/control_tab/add_list2')
    //把寫好的資料放回去
    this.recreate();
    this.id = this.dataSource.data.length;
  }

  recreate() {
    if (this.newQuest) {
      this.dataSource.data = this.newQuest.question_list
    }
  }

  //以下註解有英文的都不是很懂，要問老師。考察:類似沒全選時全選 跟 全選時取消全選
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: questionTemp): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  //當從選擇題變成短述題時將this.optionsArray(選擇題欄位)清空
  //如果this.optionsArray沒有內容(長度 = 0)，則重新給予兩的空間
  resetQuest() {
    if (this.type == 'T') {
      this.options_list = [];
    }else{
      if(this.options_list.length <= 0) {
        this.options_list = ['','']
      }
    }
  }

  //將類型的英文單字變成中文單選(S)、複選(M)、短述(T)
  changeTypeName(type: string) {

    if (type == 'S') {
      return '單選題'
    }

    if (type == 'M') {
      return '複選題'
    }

    if (type == 'T') {
      return '短述題'
    }

    return

  }

  //刪除列表
  deleteSelectedRows() {

    // 濾除被選取的資料列
    this.dataSource.data = this.dataSource.data.filter(row => !this.selection.isSelected(row));

    // 清除選取狀態
    this.selection.clear();

    // questId重新排序
    this.dataSource.data = this.dataSource.data.map((element, index) => ({
      ...element, questId: index + 1
    }))

    //questId數字更新為當前長度
    this.id = this.dataSource.data.length;

  }


  //將寫好的資料加入 Table 中
  add_row() {

    // 判斷是否都已填寫
    if(this.form_not_complete()) {
      return
    }

    //將陣列內的內容依序取出，做成JSON個後加入 optionsArray 陣列中
    let option_list: {}[] = [];
    for (let i = 0; i < this.options_list.length; i++) {
      let toJSON = { name: this.options_list[i], code: String.fromCharCode(65 + i) }
      option_list.push(toJSON)
    }

    if (this.rewrite_mode) {

      //將newQues 放入 Table 內
      let newQues = { id: this.id, title: this.title, is_necessary: this.is_necessary, type: this.type, option_list: option_list };

      //取代原本的數據
      this.dataSource.data[this.id - 1] = newQues;

      //Id 長度回復為陣列總長
      this.id = this.dataSource.data.length;

      //關閉 rewriteMode
      this.rewrite_mode = false;

    } else {

      //id 增加
      this.id += 1;

      //將newQues 放入 Table 內
      let newQues = { id: this.id, title: this.title, is_necessary: this.is_necessary, type: this.type, option_list: option_list };

      this.dataSource.data = [...this.dataSource.data, newQues];

    }

    //清空輸入欄位
    this.title = '';

    this.type = '';

    this.is_necessary = false;

    this.options_list = ['',''];

  }

  //再編輯
  rewrite(element: any) {

    //把值透過 ngModle 放回畫面上
    this.id = element.questId;

    this.title = element.questName;

    this.type = element.type;

    this.is_necessary = element.need;

    // 跑迴圈把陣列中的 optionName push 回optionsArray，顯示在網頁上
    for (let i = 0; i < element.options.length; i++) {
      // this.optionsArray.push(element.options[i].optionName)
      this.options_list[i] = (element.options[i].optionName)
    }

    //在開啟編輯模式
    this.rewrite_mode = true;

    // 清除選取狀態
    this.selection.clear();

  }

  //必填判斷
  form_not_complete() {

    if (!this.title) {
      alert('請填寫題目')
      return true
    }

    if (!this.type) {
      alert('請選擇題目類型')
      return true
    }

    if (this.type != 'T') {
      for (let i = 0; i < this.options_list.length; i++) {
        if (!this.options_list[i]) {
          alert('請填寫第' + (i + 1) + '題題目名稱')
          return true
        }

      }
    }

    return false
  }

  //回去編輯問卷基本資訊
  backAddList1() {

    //讓上方 tab 隨著換頁移動
    this.tabLink.switchTab('/control_tab/add_list1')

    this.router.navigateByUrl('/control_tab/add_list1')
  }

  toCheck() {

    if (this.dataSource.data.length == 0) {
      alert('請填寫問卷內容')
      return
    }

    this.newQuest.question_list = this.dataSource.data;
    this.router.navigateByUrl('/check_question')
  }

}
