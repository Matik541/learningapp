import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Flashcard } from 'src/environments/environment'

@Component({
  selector: 'lesson-question-choose',
  templateUrl: './question-choose.component.html',
  styleUrls: ['./question-choose.component.scss'],
})
export class QuestionChooseComponent implements OnInit {
  @Input() question: Flashcard
  @Output() answer = new EventEmitter<string>()
  constructor() {}

  ngOnInit(): void {}

  sendAnswer(answer: string, event: Event): void {
    let btn = event.target as HTMLElement
    while (btn.tagName != 'BUTTON') btn = btn.parentElement ?? btn
    let siblings = btn?.parentElement?.children
    if (siblings)
      for (let i = 0; i < siblings.length; i++)
        siblings[i].classList.remove('selected')

    btn.classList.add('selected')
    this.answer.emit(answer)
  }
}
