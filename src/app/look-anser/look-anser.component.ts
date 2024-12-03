import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { New_question } from '../service/new_question.service';
import { Feedback_dto } from '../service/feedback_dto.service';

@Component({
  selector: 'app-look-anser',
  standalone: true,
  imports: [],
  templateUrl: './look-anser.component.html',
  styleUrl: './look-anser.component.scss'
})
export class LookAnserComponent {
  constructor(
    private router: Router,
    private quiz_info: New_question,
    private feedback_dto: Feedback_dto,
  ) { }

  feedback: any = {}

  ngOnInit(): void {

    if (this.quiz_info.id !== 0) {
      this.feedback = {
        id: this.quiz_info.id,
        name: this.quiz_info.name,
        description: this.quiz_info.description,
        user_name: this.feedback_dto.user_name,
        phone: this.feedback_dto.phone,
        email: this.feedback_dto.email,
        age: this.feedback_dto.age,
        start_date: this.quiz_info.start_date,
        end_date: this.quiz_info.end_date,
        answer: this.feedback_dto.answer,
      }
      sessionStorage.setItem("feedback", JSON.stringify(this.feedback))
    } else {
      let feedbackStr: string = sessionStorage.getItem("feedback")!;
      this.feedback = JSON.parse(feedbackStr);
    }
  }

  backPage() {
    this.router.navigateByUrl('/control_tab/feedback')
  }

}
