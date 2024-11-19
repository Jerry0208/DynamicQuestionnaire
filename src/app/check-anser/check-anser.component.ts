import { Component} from '@angular/core';
import { SurveyService } from '../service/survey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-anser',
  standalone: true,
  imports: [],
  templateUrl: './check-anser.component.html',
  styleUrl: './check-anser.component.scss'
})
export class CheckAnserComponent {
  constructor(private surveyService: SurveyService, private router : Router) {}
  userData:any;
  quest: any;

  ngOnInit() {
    this.quest = this.surveyService.questData; // 獲取回答
  }

  backPage(){
    this.router.navigateByUrl('/new_anwser_page')
  }

  goLsit(){
    alert("感謝您回答問卷")
    this.surveyService.reset();
    this.router.navigateByUrl('/list');
  }

}
