import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Lesson, Tag } from '../enums/enums'
import { API_URL } from 'src/environments/environment'
import { UsersService } from './users.service'


@Injectable({
  providedIn: 'root'
})
export class CommnetsService {
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

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_URL}/comments`).pipe(
      tap((data) => data),
      catchError((err) => {
        this.error(err)
        return []
      }),
    )
  }

  addComment(comment: string): Observable<Comment | null> {
    return this.http
      .post<Comment>(
        `${API_URL}/comments/add`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${this.usersService.accessToken()}`,
          },
        },
      )
      .pipe(
        tap((data) => data),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

  updateComment(id: number, comment: string): Observable<Comment | null> {
    return this.http
      .put<Comment>(
        `${API_URL}/comments/${id}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${this.usersService.accessToken()}`,
          },
        },
      )
      .pipe(
        tap((data) => data),
        catchError((err) => {
          this.error(err)
          return of(null)
        }),
      )
  }

  deleteComment(id: number): Observable<Comment | null> {
    return this.http
      .delete<Comment | null>(`${API_URL}/comments/${id}`, {
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
}
