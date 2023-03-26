import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lesson-question-select',
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss'],
})
export class QuestionSelectComponent implements OnInit {
  @Input() question: { question: string; answers: string[] };
  @Output() answer = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  sendAnswer(answer: string, event: Event): void {
    let btn = event.target as HTMLElement;
    while (btn.tagName != 'BUTTON') btn = btn.parentElement ?? btn;
    let siblings = btn?.parentElement?.children;
    if (siblings)
      for (let i = 0; i < siblings.length; i++)
        siblings[i].classList.remove('selected');

    btn.classList.add('selected');
    this.answer.emit(answer);
  }
}
