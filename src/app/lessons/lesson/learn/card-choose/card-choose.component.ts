import { Component, Input } from '@angular/core';

@Component({
  selector: 'learn-card-choose',
  templateUrl: './card-choose.component.html',
  styleUrls: ['./card-choose.component.scss'],
})
export class CardChooseComponent {
  @Input() question: string = '';
}
