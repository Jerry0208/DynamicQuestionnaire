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


export interface PeriodicElement {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
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

  constructor(private cdr: ChangeDetectorRef) { }
  //日期選擇範圍
  startDate: string = "";
  endDate: string = "";

  //搜索問卷名稱
  seachName: string = ""

  //管理者模式 (預設為 false)
  mode: boolean = false;

  //搜索問卷狀態
  statu: string = "";

  //日期搜尋:ture, 狀態搜尋:false
  is_date_seach: boolean = true;

  // 將 MatDialog 注入 dialog
  readonly dialog = inject(MatDialog);

  //狀態搜尋按鈕
  seach_status_active_list: string[] = ["", "", "", ""];

  //假資料
  listData: PeriodicElement[] = [
    {
      id: 1, name: "市場調查01", status: "已結束", start_date: "2024-01-01", end_date: "2024-03-31",
    },
    {
      id: 2, name: "市場調查02", status: "已結束", start_date: "2024-04-01", end_date: "2024-06-30",
    },
    {
      id: 3, name: "市場調查03", status: "進行中", start_date: "2024-07-01", end_date: "2024-10-30",
    },
    {
      id: 4, name: "價格調查01", status: "已結束", start_date: "2024-01-01", end_date: "2024-03-31",
    },
    {
      id: 5, name: "價格調查02", status: "已結束", start_date: "2024-04-01", end_date: "2024-06-30",
    },
    {
      id: 6, name: "價格調查03", status: "尚未開始", start_date: "2024-11-01", end_date: "2024-12-31",
    },
    {
      id: 7, name: "興趣調查01", status: "已結束", start_date: "2024-01-01", end_date: "2024-03-31",
    },
    {
      id: 8, name: "興趣調查02", status: "已結束", start_date: "2024-04-01", end_date: "2024-06-30",
    },
    {
      id: 9, name: "興趣調查03", status: "尚未公布", start_date: "2024-11-01", end_date: "2024-12-31",
    },
    {
      id: 10, name: "年度調查01", status: "進行中", start_date: "2024-07-01", end_date: "2024-10-30"
    },
    {
      id: 11, name: "市場調查04", status: "進行中", start_date: "2024-10-15", end_date: "2025-01-15",
    },
    {
      id: 12, name: "價格調查04", status: "已結束", start_date: "2024-05-01", end_date: "2024-07-31",
    },
    {
      id: 13, name: "市場分析01", status: "進行中", start_date: "2024-09-01", end_date: "2024-12-31",
    },
    {
      id: 14, name: "興趣調查04", status: "尚未開始", start_date: "2025-01-01", end_date: "2025-03-31",
    },
    {
      id: 15, name: "市場趨勢01", status: "已結束", start_date: "2023-11-01", end_date: "2024-01-31",
    },
    {
      id: 16, name: "年度調查02", status: "進行中", start_date: "2024-08-01", end_date: "2024-12-31",
    },
    {
      id: 17, name: "需求調查01", status: "尚未開始", start_date: "2025-02-01", end_date: "2025-04-30",
    },
    {
      id: 18, name: "價格趨勢01", status: "進行中", start_date: "2024-09-01", end_date: "2024-12-01",
    },
    {
      id: 19, name: "年度調查03", status: "尚未開始", start_date: "2025-01-01", end_date: "2025-04-30",
    },
    {
      id: 20, name: "市場調查05", status: "進行中", start_date: "2024-10-01", end_date: "2025-01-01",
    }
  ];

  //table名、table資料來源
  displayedColumns: string[] = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.listData);

  selection = new SelectionModel<PeriodicElement>(true, []);

  //顯示頁數
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {

    //顯示頁數、將預設顯示的英文更改成中文
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "顯示筆數:"
    this.dataSource.paginator._intl.firstPageLabel = "第一頁:"
    this.dataSource.paginator._intl.previousPageLabel = "上一頁"
    this.dataSource.paginator._intl.nextPageLabel = "下一頁"
    this.dataSource.paginator._intl.lastPageLabel = "最後一頁"

    //保持當前的使用的模式
    if (sessionStorage.getItem("mode") == "true") {
      this.mode = true
      this.displayedColumns = ['select', 'id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    } else {
      this.mode = false
      this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    }

    this.cdr.detectChanges(); // 手動觸發檢測
  }

  masterMode() {
    this.mode = true
    this.displayedColumns = ['select', 'id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    sessionStorage.setItem("mode", "true")
  }
  normalMode() {
    this.mode = false
    this.displayedColumns = ['id', 'name', 'status', 'start_date', 'end_date', 'statistics'];
    sessionStorage.setItem("mode", "false")
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
    let data: PeriodicElement[] = []
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

  //讓radio可以取消選取
  canceChoice() {

  }

  //按鈕搜尋 By ngMoudle
  seachNameButton() {
    let data: PeriodicElement[] = []
    let statuSeach: boolean = false

    //狀態搜尋
    if (this.statu) {
      data = this.listData.filter((res) => {
        return res.status == this.statu
      });
      statuSeach = true;

      //table吃的資料dataSource

    }

    //名稱+狀態搜尋
    if (statuSeach) {
      let data2: PeriodicElement[] = []

      for (let i = 0; i < data.length; i++) {
        data.forEach((res) => {
          if (res.name.indexOf(this.seachName) != -1) {
            data2.push(res)
          }
        })
        this.dataSource.data = data2
        return
      }
    } else {
      this.listData.forEach((res) => {
        if (res.name.indexOf(this.seachName) != -1) {
          data.push(res)
        }
      });
    }
    this.dataSource.data = data
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
