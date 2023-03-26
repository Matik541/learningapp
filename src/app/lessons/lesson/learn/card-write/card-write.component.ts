import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'learn-card-write',
  templateUrl: './card-write.component.html',
  styleUrls: ['./card-write.component.scss'],
})
export class CardWriteComponent {
  @Input() question: string = '';
  @Input() answer: string = '';
  @Output() answerChange = new EventEmitter<string>();

  onChange() {
    this.answerChange.emit(this.answer.toLowerCase());
  }
}
