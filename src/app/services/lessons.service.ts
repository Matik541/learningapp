import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Lesson } from '../enums/enums'
import { API_URL } from 'src/environments/environment'
import { UsersService } from './users.service'

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private usersService: UsersService,
  ) {}

  private snackBar(
    message: string,
    action: string,
    config: {} = { duration: 2000 },
  ) {
    return this._snackBar.open(message, action, config)
  }
  private error(err: any) {
    console.error(err)
    this.snackBar(
      'Error: something went wrong, check console for more info',
      'Close',
    )
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${API_URL}/lessons`).pipe(
      tap((data) => data),
      catchError((err) => {
        this.error(err)
        return []
      }),
    )
  }

  getLesson(id: number): Observable<Lesson | null> {
    return this.http.get<Lesson>(`${API_URL}/lessons/${id}`).pipe(
      tap((data) => data),
      catchError((err) => {
        this.error(err)
        return of(null)
      }),
    )
  }

  updateLesson(id: number, lesson: Lesson): Observable<Lesson | null> {
    return this.http
      .put<Lesson>(`${API_URL}/lessons/${id}`, lesson, {
        headers: { Authorization: `Bearer ${this.usersService.accessToken()}` },
      })
      .pipe(
        tap((data) => data),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

  deleteLesson(id: number): Observable<Lesson | null> {
    return this.http
      .delete<Lesson | null>(`${API_URL}/lessons/${id}`, {
        headers: { Authorization: `Bearer ${this.usersService.accessToken()}` },
      })
      .pipe(
        tap((data) => data),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

  addLesson(lesson: Lesson): Observable<Lesson | null> {
    return this.http
      .post<Lesson>(`${API_URL}/lessons`, lesson, {
        headers: { Authorization: `Bearer ${this.usersService.accessToken()}` },
      })
      .pipe(
        tap((data) => data),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

  completeLesson(id: number, percent: number): void {
    this.http
      .post<{ score: number }>(`${API_URL}/lessons/complete${id}`, percent, {
        headers: { Authorization: `Bearer ${this.usersService.accessToken()}` },
      })
      .pipe(
        tap((data) => {
          this.snackBar(`Your score is saved, ${data.score}`, 'Close')
        }),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

}
