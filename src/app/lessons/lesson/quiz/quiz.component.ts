import { Component, Input, OnInit } from '@angular/core'
import { Lesson } from 'src/environments/environment'

@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  constructor() {}

  ngOnInit(): void {}
}
