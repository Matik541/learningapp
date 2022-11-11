import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'lesson-question-write',
  templateUrl: './question-write.component.html',
  styleUrls: ['./question-write.component.scss'],
})
export class QuestionWriteComponent implements OnInit {
  @Input() question: string
  @Output() answer = new EventEmitter<string>()

  answerControl: FormControl = new FormControl('')

  constructor() {}

  ngOnInit(): void {}

  sendAnswer(): void {
    this.answer.emit(this.answerControl.value)
  }
}
