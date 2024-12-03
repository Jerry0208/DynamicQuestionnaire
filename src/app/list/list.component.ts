import { HttpClient } from '@angular/common/http'; // 發送 hyyt api
import { SelectionModel } from '@angular/cdk/collections';//table check box
import { CommonModule } from '@angular/common';//更改按鍵顏色
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';//table 顯示頁數:ViewChild、AfterViewInit
import { FormsModule } from '@angular/forms';//ngmodule
import { MatCheckboxModule } from '@angular/material/checkbox';//check box module
import { MatIconModule } from '@angular/material/icon';//icon
import { MatPaginator } from '@angular/material/paginator';//list換頁用
import { MatTableModule, MatTableDataSource } from '@angular/material/table';// table
import { RouterLink, RouterLinkActive } from '@angular/router';//router
import { MatDialog } from '@angular/material/dialog'; // mat dialog
import { DialogContent } from '../dialog/dialog'; // dialog
import moment from 'moment'; // 比較日期
import { LoadingService } from '../service/loading.service'; // loading
import { New_question } from '../service/new_question.service'; // 換頁傳輸問卷檔案的 service


export interface ListElement {
  id: number;
  name: string;
  status: string;
  start_date: Date;
  end_date: Date;
  description: string;
}

export interface search_res {
  code: number;
  massage: string;
  quiz_list: quiz_list[];
}

export interface quiz_list {
  id: number;
  name: string;
  status: string;
  description: string;
  is_published: true;
  start_date: Date;
  end_date: Date;
}


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})



export class ListComponent implements AfterViewInit {

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private quesTemp: New_question
  ) { }

  //日期選擇範圍
  startDate!: Date;
  endDate!: Date;

  //搜索問卷名稱
  seachName: string = ""

  //管理者模式 (預設為 false)
  is_admin: boolean = false;

  //搜索問卷狀態
  statu: string = "";

  //日期搜尋:ture, 狀態搜尋:false
  is_date_seach: boolean = true;

  // 將 MatDialog 注入 dialog
  readonly dialog = inject(MatDialog);

  //狀態搜尋按鈕 active
  seach_status_active_list: string[] = ["", "", "", ""];

  // table 列表名稱
  displayedColumns: string[] = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
  // table 資料陣列
  dataSource = new MatTableDataSource<ListElement>();
  // table check box 選取 功能
  selection = new SelectionModel<ListElement>(true, []);

  //顯示頁數
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {

    // 清除session storage 中的 quesStatus
    sessionStorage.removeItem("quesStatus")

    //保持當前的使用的模式
    if (sessionStorage.getItem("is_admin") == "true") {
      this.is_admin = true
      this.displayedColumns = ['select', 'id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    } else {
      this.is_admin = false
      this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    }

    //保持 service 沒有資料
    this.quesTemp.reset();

    //搜尋全部問卷,並把內容呈現在畫面上
    let search_req = { is_admin: this.is_admin }
    this.search_and_set_quiz_status(search_req);
  }

  ngAfterViewInit(): void {
    //顯示頁數、將預設顯示的英文更改成中文
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "顯示筆數:"
    this.dataSource.paginator._intl.firstPageLabel = "第一頁:"
    this.dataSource.paginator._intl.previousPageLabel = "上一頁"
    this.dataSource.paginator._intl.nextPageLabel = "下一頁"
    this.dataSource.paginator._intl.lastPageLabel = "最後一頁"
  }

  to_admin() {
    this.is_admin = true
    this.displayedColumns = ['select', 'id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    sessionStorage.setItem("is_admin", "true")
    let search_req = { is_admin: this.is_admin }
    this.search_and_set_quiz_status(search_req);

  }
  normal() {
    this.is_admin = false
    this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    sessionStorage.setItem("is_admin", "false")
    let search_req = { is_admin: this.is_admin }
    this.search_and_set_quiz_status(search_req);
  }

  //刪除列表
  deleteSelectedRows() {
    // 開起 dialog，open 裡面的 dialog 的 class 名稱跟要傳過去的內容
    const dialogRef = this.dialog.open(DialogContent, {
      data: '確定要刪除已選擇的問卷?',
      //設定長、寬
      height: "20%",
      width: "20%",
    });

    // 將 quiz id 取出
    const quiz_id_list = this.dataSource.data
      //將被選取的欄位過濾出來
      .filter(row => this.selection.isSelected(row))
      // map 遍歷將 quiz id 取出
      .map(item => item.id);

    const deletreq = { quiz_id_list: quiz_id_list }
    //在Dialog關閉時接到的回傳內容
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      // 刪除資料庫資料
      this.http.post('http://localhost:8080/quiz/delete', deletreq).subscribe();

      // 前端濾除被選取的資料列
      this.dataSource.data = this.dataSource.data.filter(row => !this.selection.isSelected(row));
      // 清除選取狀態
      this.selection.clear();
    });
  }

  //讓問卷依時間給予狀態
  search_and_set_quiz_status(search_req: any) {
    this.loadingService.show();
    this.http.post('http://localhost:8080/quiz/search', search_req).subscribe((res: any) => {
      const creach_res: search_res = res;

      // 獲得現在日期 moment 可以直接透過方法比較日期
      const now = moment().startOf('day'); // 當前日期的起始時間

      // 加入問卷狀態:
      // 1.如果 is_published 為 false = 尚未公布
      // 2.現在時間 < 開始時間 = 尚未開始
      // 3.現在時間 >= 開始時間 &&  現在時間 <= 結束時間 = 進行中
      // 4.現在時間 > 結束時間 = 已結束
      for (const quiz of creach_res.quiz_list) {
        if (!quiz.is_published) {
          quiz.status = "尚未公布";
          continue;
        }

        const startDate = moment(quiz.start_date).startOf('day');
        const endDate = moment(quiz.end_date).startOf('day');

        // 檢查狀態
        if (now.isBefore(startDate)) {
          quiz.status = "尚未開始";
        } else if (now.isSameOrAfter(startDate) && now.isSameOrBefore(endDate)) {
          quiz.status = "進行中";
        } else {
          quiz.status = "已結束";
        }
      }

      // 將 res 整理格式至 dataSource.data 後呈現在畫面上
      let quizlist: ListElement[] = [];
      creach_res.quiz_list.forEach(item => {
        quizlist.push({
          id: item.id,
          name: item.name,
          status: item.status,
          start_date: item.start_date,
          end_date: item.end_date,
          description: item.description
        })
      });
      this.dataSource.data = quizlist;
      this.loadingService.hide();
    })
  }


  // 使用者模式: 取得問卷資訊(之後要傳到後台)
  async quesInfo(quiz_data: ListElement) {
    this.send_quiz_data_to_question_service(quiz_data);
  }
  // 管理者模式: 前往問卷回饋畫面
  to_statistics(quiz_data: ListElement) {
    this.send_quiz_data_to_question_service(quiz_data);
  }
  // 管理者模式: 將在 list 中的問卷基本資訊帶到 quesTemp 後前往更新畫面
  to_update(quiz_data: ListElement) {
    this.send_quiz_data_to_question_service(quiz_data);
  }

  //將 quiz 資訊送至 question.service
  send_quiz_data_to_question_service(element: ListElement) {
    this.quesTemp.id = element.id;
    this.quesTemp.name = element.name;
    this.quesTemp.description = element.description;
    this.quesTemp.start_date = element.start_date;
    this.quesTemp.end_date = element.end_date;
  }

  //按鈕搜尋 By ngMoudle
  seachNameButton() {
    const search_req = {
      name: this.seachName,
      start_date: this.startDate,
      end_date: this.endDate,
      status: this.statu,
      is_admin: this.is_admin,
    }
    this.search_and_set_quiz_status(search_req);
  }

  status(element: any) {
    //取得問卷狀態，依狀態讓問卷可編輯或是不可編輯
    sessionStorage.setItem("quesStatus", element)
  }
  addQues() {
    sessionStorage.setItem("quesStatus", "new")
  }

  //轉換依日期搜選或是以問卷狀態搜尋
  change_date_seach() {
    this.is_date_seach = !this.is_date_seach;
    //轉換到依日期搜選時將依問卷狀態搜尋所要用到的參數初始化
    if (this.is_date_seach) {
      this.seach_status_active_list = ["", "", "", ""];
      this.statu = "";
    }
  }


  seach_status_is(position: number, statu: string) {
    // 消除非選中的問卷狀態的 active 狀態
    for (let i = 0; i <= 3; i++) {
      if (position != i) {
        this.seach_status_active_list[i] = "";
      }
    }

    // 如果以選取的狀態再次被選取則取消 active 狀態並將要搜尋的問卷狀態消除
    if (this.seach_status_active_list[position]) {
      this.seach_status_active_list[position] = "";
      this.statu = "";
      return;
    }

    // 將被選中的問卷狀態 active 起來並將要搜尋的問卷狀態紀錄
    this.seach_status_active_list[position] = "active";
    this.statu = statu;
  }

}
