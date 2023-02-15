import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, Observable, of, tap } from 'rxjs'
import {
  AddLesson,
  API_URL,
  Flashcard,
  Lesson,
  Tag,
  Comment,
} from 'src/environments/environment'
import { UsersService } from './users.service'
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar'

type Alltags = {
  id: number
  tagName: string
}[]
@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private _snackBar: MatSnackBar
  ) {}
  snackBar(message: string, action: string, config: {} = {}) {
    return this._snackBar.open(message, action, config)
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(API_URL + '/lessons')
  }

  getLesson(id: number): Observable<Lesson | null> {
    let result = this.http.get<Lesson>(API_URL + '/lessons/' + id).pipe(
      tap((data) => data),
      catchError((err) => {
        console.log(err)
        return of(null)
      })
    )
    return result
  }

  getTags(): Observable<Alltags> {
    let result = this.http.get<Alltags>(API_URL + '/lessons/tags').pipe(
      tap((data) => data),
      catchError((err) => {
        console.log(err)
        return of([])
      })
    )
    return result
  }

  update(
    id: number,
    lesson: {
      title: string
      description: string
      iconPath: string
      tags: Tag[]
      flashcards: Flashcard[]
    }
  ): Observable<boolean> {
    this.snackBar('Lesson updated', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.put<boolean>(API_URL + '/lessons/' + id, lesson, {
      headers: headers,
    })
  }

  delete(id: number): Observable<boolean> {
    // TODO: check if it's working - backend consultation needed
    this.snackBar('Lesson deleted', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.delete<boolean>(API_URL + '/lessons/' + id, {
      headers: headers,
    })
  }

  create(lesson: AddLesson): Observable<boolean> {
    this.snackBar('Lesson created', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.post<boolean>(API_URL + '/lessons/add', lesson, {
      headers: headers,
    })
  }

  addComment(lessonId: number, comment: string): Observable<boolean> {
    this.snackBar('Comment added', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.post<boolean>(
      API_URL + '/lessons/comment/add/' + lessonId,
      {
        comment: comment,
      },
      {
        headers: headers,
      }
    )
  }

  updateComment(id: number, comment: string) {
    this.snackBar('Comment updated', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.put<boolean>(
      API_URL + '/lessons/comment/' + id,
      {
        comment: comment,
      },
      {
        headers: headers,
      }
    )
  }

  deleteComment(id: number) {
    this.snackBar('Comment deleted', 'OK', { duration: 2000 })
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.delete<boolean>(API_URL + '/lessons/comment/' + id, {
      headers: headers,
    })
  }

  reportComment(id: number): void {
    this.snackBar('Comment reported', 'OK', { duration: 2000 })
  }
}
