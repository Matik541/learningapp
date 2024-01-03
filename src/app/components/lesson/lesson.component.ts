import { QuizService } from 'src/app/components/lesson/quiz/quiz.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/enums/enums';
import { LessonsService } from 'src/app/components/lesson/lessons.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent {
  private id: number = 0;
  private _categories = [
    'details',
    'flashcards',
    'practise',
    'quiz',
    'comments',
  ];
  category: number = 0;
  lesson: Lesson = {} as Lesson;

  constructor(
    public quizService: QuizService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private lessonsService: LessonsService
  ) {
    if (
      this.activeRoute.snapshot.params['id'] == undefined ||
      this.activeRoute.snapshot.params['id'] <= 0
    )
      this.router.navigate(['/']);

    this.id = this.activeRoute.snapshot.params['id'];

    this.category = this._categories.indexOf(
      this.activeRoute.snapshot.params['category']
    );

    if (this.category != -1)
      return;
    this.router.navigate([`/lesson/${this.id}/flashcards`]);
    this.category = 1;
  }

  ngOnInit() {
    this.lessonsService
      .getLesson(this.id)
      .subscribe((lesson) => (this.lesson = lesson));
  }

  updateUrl(goto: number): void {
    this.router.navigate(['lesson', this.id, this._categories[goto]]);
  }
}