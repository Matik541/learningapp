import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PractiseFlashcard } from 'src/app/enums/enums';

@Component({
  selector: 'methods-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss']
})
export class MultipleComponent {

  @Input() flashcard: PractiseFlashcard | undefined;
  
  @Output() answer = new EventEmitter<string>();

  options: string[] = [];
  answerValue: string = "";
  
  private out;

  constructor() { 
    this.out = setInterval(() => {
      if (this.flashcard?.options && this.flashcard?.answers) {
        this.options = [...this.flashcard.options, ...this.flashcard.answers].sort(() => Math.random() - 0.5);
        clearInterval(this.out);
      }
    }, 50);
  }
  
  onAnswerChange(answers: string) {
    this.answerValue = answers;
    this.answer.emit(answers);
  }
}
 