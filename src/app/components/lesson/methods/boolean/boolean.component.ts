import { PractiseFlashcard } from 'src/app/enums/enums';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'methods-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.scss']
})
export class BooleanComponent{
  @Input() flashcard: PractiseFlashcard | undefined;
  
  @Output() answer = new EventEmitter<string | null>();

  answerValue: boolean | null = null;

  constructor() { }

  onAnswerChange(answer: boolean) {
    this.answerValue = answer;
    this.answer.emit(answer ? this.flashcard?.answer : null);
  }
}
