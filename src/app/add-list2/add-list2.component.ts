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
  quiz_id: number;
  ques_id: number;
  ques_name: string;
  required: boolean;
  type: string;
  options: any;
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
  //問卷id
  quiz_id: number = 0;
  //問題Id
  ques_id: number = 0;
  //問題名
  ques_name !: string;
  //必填欄位
  required: boolean = false;

  //預設單選(開啟動畫用)
  type: string = 'S';

  //再編輯模式
  rewrite_mode: boolean = false

  //選擇題陣列
  options_list: Array<string> = ['', ''];


  //table
  displayedColumns: string[] = ['select', 'ques_id', 'ques_name', 'type', 'required', 'rewrite'];
  dataSource = new MatTableDataSource<questionTemp>();
  //table selection
  selection = new SelectionModel<questionTemp>(true, []);

  ngOnInit(): void {
    this.tabLink.switchTab('/control_tab/add_list2')
    this.tabLink.quesStatus(sessionStorage.getItem("quesStatus"))
    //把寫好的資料放回去
    this.recreate();
    this.ques_id = this.dataSource.data.length;
  }

  // 在ngOnInit裡如果有資料就放入
  recreate() {
    if (!this.newQuest) {
      return;
    }
    this.dataSource.data = this.newQuest.question_list;
    this.quiz_id = this.newQuest.id;
  }
  //增加選項
  autoArrayGenerater() {
    //限制一題選項最多10
    if (this.options_list.length >= 10) {
      alert("選項最多10個!!");
      return;
    }

    this.options_list.push('')
  }

  //刪除選項
  deleteOption(index: number) {
    this.options_list.splice(index, 1)
  }

  //關閉選項
  closeOption() {
    if (this.type == "T" || this.type == '') {
      return true;
    }
    return false
  }

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ques_id + 1}`;
  }

  //當從選擇題變成短述題時將this.optionsArray(選擇題欄位)清空
  //如果this.optionsArray沒有內容(長度 = 0)，則重新給予兩的空間
  resetQuest() {
    if (this.type == 'T') {
      this.options_list = [];
    } else {
      if (this.options_list.length <= 0) {
        this.options_list = ['', '']
      }
    }
  }

  //將類型的英文單字變成中文單選(S)、複選(M)、短述(T)
  changeTypeName(type: string) {

    if (type == 'S') {
      return '單選題';
    }

    if (type == 'M') {
      return '複選題';
    }

    if (type == 'T') {
      return '短述題';
    }

    return;

  }

  //刪除列表
  deleteSelectedRows() {

    // 濾除被選取的資料列
    this.dataSource.data = this.dataSource.data.filter(row => !this.selection.isSelected(row));

    // 清除選取狀態
    this.selection.clear();

    // ques_id重新排序
    this.dataSource.data = this.dataSource.data.map((element, index) => ({
      ...element, ques_id: index + 1
    }))

    //ques_id數字更新為當前長度
    this.ques_id = this.dataSource.data.length;

  }


  //將寫好的資料加入 Table 中
  add_row() {

    // 判斷是否都已填寫
    if (this.form_not_complete()) {
      return
    }

    //將陣列內的內容依序取出，做成JSON個後加入 optionsArray 陣列中
    let options: {}[] = [];
    for (let i = 0; i < this.options_list.length; i++) {
      let toJSON = { option: this.options_list[i], option_number: i + 1 }
      options.push(toJSON)
    }

    if (this.rewrite_mode) {

      //將newQues 放入 Table 內
      let newQues = {
        quiz_id: this.quiz_id,
        ques_id: this.ques_id,
        ques_name: this.ques_name,
        required: this.required,
        type: this.type,
        options: options
      };

      //取代原本的數據
      this.dataSource.data[this.ques_id - 1] = newQues;
      //多一條這是因為上一條數據進去之後，畫面會有可能會不急渲染，所以以防萬一讓this.dataSource.data 再讀一次自己的數據
      this.dataSource.data = [...this.dataSource.data];

      //Id 長度回復為陣列總長
      this.ques_id = this.dataSource.data.length;

      //關閉 rewriteMode
      this.rewrite_mode = false;

    } else {

      //id 增加
      this.ques_id += 1;

      //將newQues 放入 Table 內
      let newQues = {
        quiz_id: this.quiz_id,
        ques_id: this.ques_id,
        ques_name: this.ques_name,
        required: this.required,
        type: this.type,
        options: options
      };

      this.dataSource.data = [...this.dataSource.data, newQues];

    }

    //清空輸入欄位
    this.ques_name = '';

    this.type = '';

    this.required = false;

    this.options_list = ['', ''];

  }

  //再編輯
  rewrite(element: any) {

    //把值透過 ngModle 放回畫面上
    this.ques_id = element.ques_id;

    this.ques_name = element.ques_name;

    this.type = element.type;

    this.required = element.required;

    // 跑迴圈把陣列中的 optionName push 回optionsArray，顯示在網頁上
    for (let i = 0; i < element.options.length; i++) {
      this.options_list[i] = (element.options[i].option)
    }

    //在開啟編輯模式
    this.rewrite_mode = true;

    // 清除選取狀態
    this.selection.clear();

  }

  //必填判斷
  form_not_complete() {

    if (!this.ques_name) {
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

    if(this.dataSource.data.length >=1) {
      this.newQuest.question_list = this.dataSource.data;
    }

    //讓上方 tab 隨著換頁移動
    this.tabLink.switchTab('/control_tab/add_list1')

    this.router.navigateByUrl('/control_tab/add_list1')
  }

  toCheck() {
    if (this.dataSource.data.length == 0) {
      alert('請填寫問卷內容')
      return
    }
    if(this.rewrite_mode){
      alert('再編輯模式中')
      return;
    }

    this.newQuest.question_list = this.dataSource.data;
    this.router.navigateByUrl('/check_question')
  }

}
