import { Flashcard, Lesson, User } from 'src/environments/environment'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UsersService } from 'src/app/users.service'
import { LessonsService } from 'src/app/lessons.service'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy {
  id: number = 0
  private sub: any

  logged: User = this.usersService.loggedUser

  flashcards: Flashcard[] = [
    { question: 'What is Angular?', answer: 'A framework' },
  ]
  lesson: Lesson = {} as Lesson
  private ObsLesson: any

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private lessonsService: LessonsService
  ) {
    this.logged = this.usersService.loggedUser
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id']
    })

    this.ObsLesson = this.lessonsService
      .getLesson(this.id)
      .subscribe((data) => {
        console.log(this.logged)

        this.lesson.creator = data.creator
        this.lesson.description = data.description
        this.lesson.flashcards = data.flashcards
        // this.lesson.icon = data.icon
        this.lesson.tags = data.tags
        this.lesson.title = data.title

        console.log(data)
        console.log(this.lesson)
      })
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
