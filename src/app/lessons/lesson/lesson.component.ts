import { Flashcard, User } from 'src/environments/environment'
import { Router } from '@angular/router'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UsersService } from 'src/app/users.service'
import { LessonsService } from 'src/app/lessons.service'

type Category = 'flashcards' | 'learn' | 'quiz' | 'comments'
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy {
  id: number = 0
  category: Category = 'flashcards'
  private sub: any

  logged: User = this.usersService.loggedUser
  error: string = ''

  write: string[] = []
  match: { question: string; answers: string[] }[] = []
  choose: Flashcard[] = []

  message: string
  displayMessage: boolean = false

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private usersService: UsersService,
    private lessonsService: LessonsService
  ) {
    this.logged = this.usersService.loggedUser
    this.sub = this.activeRoute.params.subscribe((params) => {
      this.id = +params['id']
      if (params['category'].match(/flashcards|learn|quiz|comments/) !== null)
        this.category = params['category']
      else this.route.navigate(['lesson', this.id, 'flashcards'])
    })
  }

  ngOnInit(): void {
    this.lessonsService.getLesson(this.id).subscribe((lesson) => {
      if (lesson === null) this.route.navigate(['error404'])
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
