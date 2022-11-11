import { Flashcard, Lesson, User } from 'src/environments/environment'
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
  private lec: any

  logged: User = this.usersService.loggedUser

  lesson: Lesson = {} as Lesson

  write: string[] = []
  match: { question: string; answers: string[] }[] = []
  choose: Flashcard[] = []

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
    this.lec = this.lessonsService.getLesson(this.id).subscribe((data) => {
      this.lesson.creator = data.creator
      this.lesson.description = data.description
      this.lesson.flashcards = data.flashcards
      // this.lesson.icon = data.icon
      this.lesson.tags = data.tags
      this.lesson.title = data.title

      this.write = this.setWrite(4)
      this.match = this.setMatch(5)
      this.choose = this.setChoose(3)
    })
  }

  setWrite(bound: number): string[] {
    let write: string[] = []
    for (let i = 0; i < bound; i++) {
      let index = Math.floor(Math.random() * this.lesson.flashcards.length)
      write.push(this.lesson.flashcards[index].question)
    }
    return write
  }
  setMatch(bound: number): { question: string; answers: string[] }[] {
    let match: { question: string; answers: string[] }[] = []
    for (let i = 0; i < bound; i++) {
      let question: Flashcard =
        this.lesson.flashcards[
          Math.floor(Math.random() * this.lesson.flashcards.length)
        ]
      let answers = this.lesson.flashcards.map((f) => f.answer)
      answers = answers.filter((a) => a !== question.answer)

      answers.length = 4
      answers[Math.floor(Math.random() * answers.length)] = question.answer
      answers.sort(() => Math.random() - 0.5)

      match.push({ question: question.question, answers: answers })
    }
    return match
  }
  setChoose(bound: number): Flashcard[] {
    let choose: Flashcard[] = []
    for (let i = 0; i < bound; i++) {
      let answers: string[] = this.lesson.flashcards.map((f) => f.answer)
      let question: Flashcard =
        this.lesson.flashcards[Math.floor(Math.random() * answers.length)]
      if (Math.random() < 0.5)
        question.answer = answers[Math.floor(Math.random() * answers.length)]
      choose.push(question)
    }
    return choose
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
    this.lec.unsubscribe()
  }
}
