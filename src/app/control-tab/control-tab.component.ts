import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs'; //Tab 用
import { Router, RouterLink, RouterOutlet } from '@angular/router';//路由用

@Component({
  selector: 'app-control-tab',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './control-tab.component.html',
  styleUrl: './control-tab.component.scss'
})
export class ControlTabComponent {
  constructor(private router: Router) { }

  activeLink = '';

  switchTab(event: string) {
    this.activeLink = event
  }

  quesStatus(status: any) {
    //讓狀態是已結束和進行中的問卷內容不能被修改
    if (status == '已結束' || status == '進行中') {
      this.links[0].hide = true;
      this.links[1].hide = true;
    }else{
      this.links[2].hide = true;
      this.links[3].hide = true;
    }

    //新增問卷狀態，讓 tab都不能被操作
    if (status == 'new') {
      this.links.forEach(link => {
        link.hide = true
      })
    }

  }

  links = [
    { path: '/control_tab/add_list1', name: '問卷', hide: false },
    { path: '/control_tab/add_list2', name: '題目', hide: false },
    { path: '/control_tab/feedback', name: '回饋', hide: false },
    { path: '/control_tab/statistics', name: '統計', hide: false }
  ];

  backList() {
    this.router.navigateByUrl('\list')
  }


}
