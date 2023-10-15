import { Flashcard } from 'src/app/enums/enums';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'methods-boolean',
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.scss']
})
export class BooleanComponent{
  @Input() flashcard: Flashcard | undefined;
  
  @Output() answer = new EventEmitter<string>();

  answerValue: boolean | undefined;

  constructor() { }

  onAnswerChange() {
    this.answer.emit(this.flashcard?.answer);
  }
}
