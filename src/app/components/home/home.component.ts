import { Component } from '@angular/core';
import { Lesson } from 'src/app/enums/enums';
import { LessonsService } from '../lesson/lessons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  lessons: Lesson[] = [];

  constructor(lessonsService: LessonsService) {
    lessonsService.getLessons().subscribe((lessons) => {
      this.lessons = lessons;
    });
  }
}
