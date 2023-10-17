import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Comment } from 'src/app/enums/enums'
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
      tap((data) => of(data)),
      catchError((err) => {
        this.error(err)
        return []
      }),
    )
  }

  addComment(comment: string): Observable<Comment> {
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
        tap((data) => of(data)),
        catchError((err) => {
          this.error(err)
          return of()
        }),
      )
  }

  updateComment(id: number, comment: string): Observable<Comment> {
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
        tap((data) => of(data)),
        catchError((err) => {
          this.error(err)
          return of()
        }),
      )
  }

  deleteComment(id: number): Observable<Comment> {
    return this.http
      .delete<Comment>(`${API_URL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${this.usersService.accessToken()}` },
      })
      .pipe(
        tap((data) => of(data)),
        catchError((err) => {
          this.error(err)
          return of()
        }),
      )
  }
}
