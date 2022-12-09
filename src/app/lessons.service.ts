import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { AddLesson, API_URL, Lesson, Tag } from 'src/environments/environment'
import { UsersService } from './users.service'

type Alltags = {
  id: number
  tagName: string
}[]
@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  constructor(private http: HttpClient, private usersService: UsersService) {}

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(API_URL + '/lessons')
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

  getLesson(id: number): Observable<Lesson | null> {
    let result = this.http.get<Lesson>(API_URL + '/lessons/' + id).pipe(
      tap((data) => data),
      catchError((err) => {
        console.error(err)
        return of(null)
      })
    )
    return result
  }

  update(id: number, lesson: Lesson): Observable<boolean> {
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.put<boolean>(API_URL + '/lessons/' + id, lesson, {
      headers: headers,
    })
  }

  delete(id: number): Observable<boolean> {
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.delete<boolean>(API_URL + '/lessons/' + id, {
      headers: headers,
    })
  }

  create(lesson: AddLesson): Observable<boolean> {
    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.post<boolean>(API_URL + '/lessons/add', lesson, {
      headers: headers,
    })
  }
}
