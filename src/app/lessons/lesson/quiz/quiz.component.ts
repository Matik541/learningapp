import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Flashcard, Lesson } from 'src/environments/environment'
@Component({
  selector: 'lesson-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() lesson: Lesson = {} as Lesson
  @Input() quiz: any[][] = []

  answers: any[][] = [[], [], []]

  constructor() {}

  ngOnInit(): void {}

  submit(): void {
    console.log(this.answers)
  }

  chooseAnswer(event: string, id: number): void {
    this.answers[2][id] = event
  }

  matchAnswer(event: string, id: number): void {
    this.answers[1][id] = event
  }

  writeAnswer(event: string, id: number): void {
    this.answers[0][id] = event
  }
}
