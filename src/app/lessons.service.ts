import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { API_URL, Lesson, Tag } from 'src/environments/environment'
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

  getFlashcards(id: number): { title: string; icon: string; id: number } {
    this.http.get(API_URL + '/lessons/' + id)
    // .subscribe((data) => { console.log(data) })

    return { title: 'asd', icon: 'flash_on', id: id }
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(API_URL + '/lessons')
  }

  getTags(): Observable<Alltags> {
    return this.http.get<Alltags>(API_URL + '/lessons/tags')
  }

  getLesson(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(API_URL + '/lessons/' + id)
  }

  update(id: number, lesson: Lesson): Observable<boolean> {
    return this.http.put<boolean>(API_URL + '/lessons/' + id, lesson)
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(API_URL + '/lessons/' + id)
  }

  create(lesson: Lesson): Observable<boolean> {
    console.log(lesson)

    let headers = { Authorization: `Bearer ${this.usersService.accessToken()}` }
    return this.http.post<boolean>(API_URL + '/lessons/add', lesson, {
      headers: headers,
    })
  }
}
