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

  onClick(answer: string, event: Event) {
    let btn = event.target as HTMLElement;
    while (btn.tagName != 'BUTTON') btn = btn.parentElement ?? btn;
    let siblings = btn?.parentElement?.children;
    if (siblings)
      for (let i = 0; i < siblings.length; i++)
        siblings[i].classList.remove('selected');

    btn.classList.add('selected');
    this.answered.emit(answer);
  }
}
