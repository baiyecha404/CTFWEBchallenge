import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AnswerService } from '../../answer/answer.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  public answer: string = '42'
  public flag: string;

  constructor(private service: AnswerService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.flag = process?.env?.FLAG
    }

    this.service.getAnswer().subscribe((answer: string) => {
      this.answer = answer
    })
  }

}
