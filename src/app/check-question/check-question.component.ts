import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewQuest } from '../service/newQuest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-question',
  standalone: true,
  imports: [],
  templateUrl: './check-question.component.html',
  styleUrl: './check-question.component.scss',
  //dialog
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckQuestionComponent {

  constructor(private ques : NewQuest, private router:Router){}



  //問卷基本資訊


  //問卷名
  title!: string;
  //問卷描述
  explain!: string;
  //起迄日期
  sDate!: string;
  eDate!: string;
  //問卷內容
  questArray!: Array<any>;
  //是否公布
  publish!:boolean;


  ngOnInit(): void {
    this.title = this.ques.title;
    this.explain = this.ques.explain;
    this.sDate = this.ques.sDate;
    this.eDate = this.ques.eDate;
    this.questArray = this.ques.questArray;
  }

  goBack(){
    this.router.navigateByUrl('/control_tab/add_list2')
  }

  PubAndSaveData(){
    alert('存檔並公布成功!')
    this.ques.reset();
    this.router.navigateByUrl('/list');
  }

  saveData(){
    alert('僅存檔成功!')
    this.ques.reset();
    this.router.navigateByUrl('/list');
  }

}
