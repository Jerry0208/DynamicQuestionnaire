import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ControlTabComponent } from '../control-tab/control-tab.component';


export interface answerTemp {
  answerId: number;
  answerName: string;
  answerDateTime: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements AfterViewInit {

  constructor( private tabLink : ControlTabComponent) {}

  ngOnInit(): void {
    // 讓tab標籤亮起來
    this.tabLink.switchTab('/control_tab/feedback')
    this.tabLink.quesStatus(sessionStorage.getItem("quesStatus"))
  }


  //假資料
  listData: answerTemp[] = [
    { answerId: 1, answerName: "aaa", answerDateTime: "2024-01-01 10:00", },
    { answerId: 2, answerName: "bbb", answerDateTime: "2024-04-01 10:00", },
    { answerId: 3, answerName: "ccc", answerDateTime: "2024-07-01 10:00", },
    { answerId: 4, answerName: "ddd", answerDateTime: "2024-01-01 10:00", },
    { answerId: 5, answerName: "eee", answerDateTime: "2024-04-01 10:00", },
  ];

  //table名、table資料來源
  displayedColumns: string[] = ['answerId', 'answerName', 'answerDateTime', 'lookAnswer'];
  dataSource = new MatTableDataSource<answerTemp>(this.listData);


  //顯示頁數
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //顯示頁數、將預設顯示的英文更改成中文
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "顯示筆數:"
    this.dataSource.paginator._intl.firstPageLabel = "第一頁:"
    this.dataSource.paginator._intl.previousPageLabel = "上一頁"
    this.dataSource.paginator._intl.nextPageLabel = "下一頁"
    this.dataSource.paginator._intl.lastPageLabel = "最後一頁"
  }

  //取得問卷資訊(之後要傳到後台)
  quesInfo(element: Element) {
    console.log(element);
  }

}
