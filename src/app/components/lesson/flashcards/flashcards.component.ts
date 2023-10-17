import { Flashcard } from './../../../enums/enums';
import { Component, Input } from '@angular/core';
import { Lesson } from 'src/app/enums/enums';

@Component({
  selector: 'lesson-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss']
})
export class FlashcardsComponent {
  @Input() flashcards: Flashcard[] | undefined = [{question: 'a', answer: 'b'}, {question: 'c', answer: 'd'}];
  index: number = 0;

  side: boolean = true;

  constructor() {}

  next(): void {
    if (this.flashcards == undefined) return;
    this.side = true;
    this.index = (this.index + 1) % this.flashcards.length;
  }
  prev(): void {
    if (this.flashcards == undefined) return;
    this.side = true;
    this.index = (this.index - 1 + this.flashcards.length) % this.flashcards.length;
  }
}
