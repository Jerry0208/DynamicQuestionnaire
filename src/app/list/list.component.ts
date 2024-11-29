import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';//table check box
import { CommonModule } from '@angular/common';//更改按鍵顏色
import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';//table 顯示頁數:ViewChild、AfterViewInit
import { FormsModule } from '@angular/forms';//ngmodule
import { MatCheckboxModule } from '@angular/material/checkbox';//check box module
import { MatIconModule } from '@angular/material/icon';//icon
import { MatPaginator } from '@angular/material/paginator';//list換頁用
import { MatTableModule, MatTableDataSource } from '@angular/material/table';// table
import { RouterLink, RouterLinkActive } from '@angular/router';//router
import { MatDialog } from '@angular/material/dialog'; // mat dialog
import { DialogContent } from '../dialog/dialog';
import moment from 'moment';
import { LoadingService } from '../service/loading.service';


export interface ListElement {
  id: number;
  name: string;
  status: string;
  start_date: Date;
  end_date: Date;
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

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, private loadingService: LoadingService) { }
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

  listData: ListElement[] = [];

  displayedColumns: string[] = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
  dataSource = new MatTableDataSource<ListElement>(this.listData);

  selection = new SelectionModel<ListElement>(true, []);

  //顯示頁數
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {

    //保持當前的使用的模式
    if (sessionStorage.getItem("is_admin") == "true") {
      this.is_admin = true
      this.displayedColumns = ['select', 'id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    } else {
      this.is_admin = false
      this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    }

    //搜尋全部問卷,並把內容呈現在畫面上
    let search_req = {
      is_admin: this.is_admin
    }
    this.search_and_set_quiz_status(search_req);

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
    let search_req = {is_admin: this.is_admin}
    this.search_and_set_quiz_status(search_req);

  }
  normal() {
    this.is_admin = false
    this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    sessionStorage.setItem("is_admin", "false")
    let search_req = { is_admin: this.is_admin}
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
    //在Dialog關閉時接到的回傳內容
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      // 濾除被選取的資料列
      this.dataSource.data = this.dataSource.data.filter(row => !this.selection.isSelected(row));
      // 清除選取狀態
      this.selection.clear();
    });
  }


  //模糊搜尋:只能搜尋到由API接過來的資料，沒辦法搜尋到資料庫所有資料
  //即時模糊搜尋功能 By input event
  changeInput(event: Event) {
    let data: ListElement[] = []
    // as HTMLInputElement 轉型，之後才能使用.value
    // console.log((event.target as HTMLInputElement).value)
    this.listData.forEach((res) => {
      if (res.name.indexOf((event.target as HTMLInputElement).value) != -1) {
        data.push(res)
      }
    });
    //table吃的資料dataSource
    this.dataSource.data = data
  }

  //讓問卷依時間給予狀態
  search_and_set_quiz_status(search_req: any) {
    let creach_res!: search_res;
    this.loadingService.show();
    this.http.post('http://localhost:8080/quiz/search', search_req).subscribe((res: any) => {
      creach_res = res;
      // 加入問卷狀態:
      // 1.如果 is_published 為 false = 尚未公布
      // 2.現在時間 < 開始時間 = 尚未開始
      // 3.現在時間 >= 開始時間 &&  現在時間 <= 結束時間 = 進行中
      // 4.現在時間 > 結束時間 = 已結束
      for (let i = 0; i < creach_res.quiz_list.length; i++) {
        // 獲得現在日期 moment 可以直接透過方法比較日期
        let now: moment.Moment = moment();

        //  is_published = false 為未公布
        if (!creach_res.quiz_list[i].is_published) {
          creach_res.quiz_list[i].status = "尚未公布";
          continue;
        }

        // moment.isBefore，現在日期比開始日期還早時，問卷狀態為尚未開始
        if (now.isBefore(creach_res.quiz_list[i].start_date)) {
          creach_res.quiz_list[i].status = "尚未開始";
          continue;
        }

        //現在日期跟開始日期一樣或是在開始日期之後 且 現在日期跟結束日期一樣或是在結束時間之前，問卷狀態為進行中
        if (now.isSameOrAfter(creach_res.quiz_list[i].start_date) && now.isSameOrBefore(creach_res.quiz_list[i].end_date)) {
          creach_res.quiz_list[i].status = "進行中";
          continue;
        }

        //剩餘問卷狀態為已結束
        creach_res.quiz_list[i].status = "已結束";
      }

      let quizlist: ListElement[] = [];
      creach_res.quiz_list.forEach(item => {
        let list_element: ListElement = {
          id: item.id,
          name: item.name,
          status: item.status,
          start_date: item.start_date,
          end_date: item.end_date,
        }
        quizlist.push(list_element)
      });
      this.dataSource.data = quizlist;
      this.loadingService.hide();
    })
  }

  //按鈕搜尋 By ngMoudle
  seachNameButton() {
    let search_req = {
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

  //取得問卷資訊(之後要傳到後台)
  quesInfo(element: any) {
    console.log(element);
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
