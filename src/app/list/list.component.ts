import { SelectionModel } from '@angular/cdk/collections';//table check box
import { CommonModule } from '@angular/common';//更改按鍵顏色
import { AfterViewInit, Component, ViewChild } from '@angular/core';//table 顯示頁數:ViewChild、AfterViewInit
import { FormsModule } from '@angular/forms';//ngmodule
import { MatCheckboxModule } from '@angular/material/checkbox';//check box module
import { MatIconModule } from '@angular/material/icon';//icon
import { MatPaginator } from '@angular/material/paginator';//list換頁用
import { MatTableModule, MatTableDataSource } from '@angular/material/table';// table
import { RouterLink, RouterLinkActive } from '@angular/router';//router
import { QuesStatus } from '../service/quesStatus.service';


export interface PeriodicElement {
  id: number;
  title: string;
  status: string;
  sDate: string;
  eDate: string;
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

  constructor(private quesStatus: QuesStatus) { }
  //日期選擇範圍
  startDate: string = "";
  endDate: string = "";

  //搜索問卷名稱
  seachName: string = ""

  //管理者模式 (預設為 false)
  mode: boolean = false;

  //搜索問卷狀態
  statu: string = "";

  //假資料
  listData: PeriodicElement[] = [
    {
      id: 1, title: "市場調查01", status: "已結束", sDate: "2024-01-01", eDate: "2024-03-31",
    },
    {
      id: 2, title: "市場調查02", status: "已結束", sDate: "2024-04-01", eDate: "2024-06-30",
    },
    {
      id: 3, title: "市場調查03", status: "進行中", sDate: "2024-07-01", eDate: "2024-10-30",
    },
    {
      id: 4, title: "價格調查01", status: "已結束", sDate: "2024-01-01", eDate: "2024-03-31",
    },
    {
      id: 5, title: "價格調查02", status: "已結束", sDate: "2024-04-01", eDate: "2024-06-30",
    },
    {
      id: 6, title: "價格調查03", status: "尚未開始", sDate: "2024-11-01", eDate: "2024-12-31",
    },
    {
      id: 7, title: "興趣調查01", status: "已結束", sDate: "2024-01-01", eDate: "2024-03-31",
    },
    {
      id: 8, title: "興趣調查02", status: "已結束", sDate: "2024-04-01", eDate: "2024-06-30",
    },
    {
      id: 9, title: "興趣調查03", status: "尚未公布", sDate: "2024-11-01", eDate: "2024-12-31",
    },
    {
      id: 10, title: "年度調查01", status: "進行中", sDate: "2024-07-01", eDate: "2024-10-30"
    },
    {
      id: 11, title: "市場調查04", status: "進行中", sDate: "2024-10-15", eDate: "2025-01-15",
    },
    {
      id: 12, title: "價格調查04", status: "已結束", sDate: "2024-05-01", eDate: "2024-07-31",
    },
    {
      id: 13, title: "市場分析01", status: "進行中", sDate: "2024-09-01", eDate: "2024-12-31",
    },
    {
      id: 14, title: "興趣調查04", status: "尚未開始", sDate: "2025-01-01", eDate: "2025-03-31",
    },
    {
      id: 15, title: "市場趨勢01", status: "已結束", sDate: "2023-11-01", eDate: "2024-01-31",
    },
    {
      id: 16, title: "年度調查02", status: "進行中", sDate: "2024-08-01", eDate: "2024-12-31",
    },
    {
      id: 17, title: "需求調查01", status: "尚未開始", sDate: "2025-02-01", eDate: "2025-04-30",
    },
    {
      id: 18, title: "價格趨勢01", status: "進行中", sDate: "2024-09-01", eDate: "2024-12-01",
    },
    {
      id: 19, title: "年度調查03", status: "尚未開始", sDate: "2025-01-01", eDate: "2025-04-30",
    },
    {
      id: 20, title: "市場調查05", status: "進行中", sDate: "2024-10-01", eDate: "2025-01-01",
    }
  ];

  //table名、table資料來源
  displayedColumns: string[] = ['id', 'title', 'status', 'sDate', 'eDate', 'statistics'];
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
      this.displayedColumns = ['select', 'id', 'title', 'status', 'sDate', 'eDate', 'statistics']
    } else {
      this.mode = false
      this.displayedColumns = ['id', 'title', 'status', 'sDate', 'eDate', 'statistics']
    }

  }

  masterMode() {
    this.mode = true
    this.displayedColumns = ['select', 'id', 'title', 'status', 'sDate', 'eDate', 'statistics']
    sessionStorage.setItem("mode", "true")
  }
  normalMode() {
    this.mode = false
    this.displayedColumns = ['id', 'title', 'status', 'sDate', 'eDate', 'statistics']
    sessionStorage.setItem("mode", "false")
  }

  //刪除列表
  deleteSelectedRows() {
    // 濾除被選取的資料列
    this.dataSource.data = this.dataSource.data.filter(row => !this.selection.isSelected(row));

    // 清除選取狀態
    this.selection.clear();
  }


  //模糊搜尋:只能搜尋到由API接過來的資料，沒辦法搜尋到資料庫所有資料
  //即時模糊搜尋功能 By input event
  changeInput(event: Event) {
    let data: PeriodicElement[] = []
    // as HTMLInputElement 轉型，之後才能使用.value
    // console.log((event.target as HTMLInputElement).value)
    this.listData.forEach((res) => {
      if (res.title.indexOf((event.target as HTMLInputElement).value) != -1) {
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
          if (res.title.indexOf(this.seachName) != -1) {
            data2.push(res)
          }
        })
        this.dataSource.data = data2
        return

      }
    } else {
      this.listData.forEach((res) => {
        if (res.title.indexOf(this.seachName) != -1) {
          data.push(res)
        }
      });
    }
    this.dataSource.data = data
  }

  //顯示用戶統計頁的返回按鍵
  showBackButton() {
    this.quesStatus.showBackButton = true
  }

  status(element: any) {
    //取得問卷狀態，依狀態讓問卷可編輯或是不可編輯
    this.quesStatus.quesStatus = element
    this.quesStatus.showBackButton = false
    console.log(this.quesStatus.quesStatus);

  }
  addQues() {
    this.quesStatus.quesStatus = 'new'
  }

  //取得問卷資訊(之後要傳到後台)
  quesInfo(element: any) {
    console.log(element);
  }

}
