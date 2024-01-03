import { Component, Input } from '@angular/core';
import { Lesson } from 'src/app/enums/enums';

@Component({
  selector: 'lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss']
})
export class LessonCardComponent {
  @Input() lesson!: Lesson;

}
