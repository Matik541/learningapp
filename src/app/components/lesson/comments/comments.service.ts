import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CommentLesson } from 'src/app/enums/enums'
import { API_URL } from 'src/environments/environment'
import { UsersService } from 'src/app/components/auth/users.service'

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
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

  /**
   * Call API via http request to add comment to the database
   * @warning This method requires the user to be logged in
   * @param {string} comment The comment to add
   * @returns {Observable<CommentLesson>} The comment added
   *
   * @example addComment('This is a comment')
   */
  addComment(comment: string, lessonId: number): Observable<CommentLesson> {
    return this.http
      .post<CommentLesson>(
        `${API_URL}/comments/add/${lessonId}`,
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

  /**
   * Call API via http request to update a comment in the database
   * @warning This method requires the user to be creator of the comment
   * @param {number} id ID of the comment to update
   * @param {string} comment The new comment content
   * @returns {Observable<CommentLesson>} The updated comment
   *
   * @example updateComment(1, 'This is a new comment content')
   */
  updateComment(
    id: number,
    comment: string,
  ): Observable<CommentLesson> {
    return this.http
      .put<CommentLesson>(
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

  /**
   * Call API via http request to delete a comment from the database
   * @warning This method requires the user to be creator of the comment
   * @param {number} id ID of the comment to delete
   * @returns {Observable<CommentLesson>} The deleted comment
   *
   * @example deleteComment(1)
   */
  deleteComment(id: number): Observable<CommentLesson> {
    return this.http
      .delete<CommentLesson>(`${API_URL}/comments/${id}`, {
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
