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

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {}
}
