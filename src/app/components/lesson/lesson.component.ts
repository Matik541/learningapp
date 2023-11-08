import { QuizService } from 'src/app/components/lesson/quiz/quiz.service';
import { UsersService } from '../auth/users.service'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Lesson } from 'src/app/enums/enums'
import { LessonsService } from 'src/app/components/lesson/lessons.service'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent {
  private id: number = 0
  private _categories = ['flashcards', 'practise', 'quiz', 'comments']
  category: number = 0
  lesson: Lesson = {} as Lesson

  constructor(
    public quizService: QuizService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private lessonsService: LessonsService,
  ) {
    if (
      this.activeRoute.snapshot.params['id'] == undefined ||
      this.activeRoute.snapshot.params['id'] <= 0
    )
      this.router.navigate(['/'])

    this.id = this.activeRoute.snapshot.params['id']

    if (
      this.activeRoute.snapshot.params['category'] == undefined ||
      this.activeRoute.snapshot.params['category'] == ''
    )
      this.router.navigate([`/lesson/${this.id}/flashcards`])

    this.category = this._categories.indexOf(
      this.activeRoute.snapshot.params['category'],
    )
  }

  ngOnInit() {
    this.lessonsService
      .getLesson(this.id)
      .subscribe((lesson) => (this.lesson = lesson))
  }

  updateUrl(goto: number): void {
    this.router.navigate(['lesson', this.id, this._categories[goto]])
  }
}
