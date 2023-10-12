import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Tag } from '../enums/enums'
import { API_URL } from 'src/environments/environment'
import { UsersService } from './users.service'

@Injectable({
  providedIn: 'root',
})
export class TagsService {
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

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${API_URL}/tags`).pipe(
      tap((data) => data),
      catchError((err) => {
        this.error(err)
        return []
      }),
    )
  }

  addTag(tagName: string): Observable<Tag | null> {
    return this.http
      .post<Tag>(
        `${API_URL}/tags/add`,
        { tagName },
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

  updateTag(id: number, tagName: string): Observable<Tag | null> {
    return this.http
      .put<Tag>(
        `${API_URL}/tags/${id}`,
        { tagName },
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

  deleteTag(id: number): Observable<Tag | null> {
    return this.http
      .delete<Tag | null>(`${API_URL}/tags/${id}`, {
        headers: {
          Authorization: `Bearer ${this.usersService.accessToken()}`,
        },
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
