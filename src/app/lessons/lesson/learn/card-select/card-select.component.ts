import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'learn-card-select',
  templateUrl: './card-select.component.html',
  styleUrls: ['./card-select.component.scss'],
})
export class CardSelectComponent {
  @Input() question: string = '';
  @Input() answers: string[] = [];
  @Output() answered = new EventEmitter<string>();

  answer: string = '';

  onClick(answer: string) {
    this.answer = answer;
    this.answered.emit(answer);
  }
}
