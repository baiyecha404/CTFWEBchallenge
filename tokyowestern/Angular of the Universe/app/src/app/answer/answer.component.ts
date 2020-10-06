import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from './answer.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  public query: string
  public answer: string = '42'

  constructor(private route: ActivatedRoute, private service: AnswerService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q']
    })

    // fetch answer via API
    this.service.getAnswer().subscribe((answer: string) => {
      this.answer = answer
    })
  }
}
