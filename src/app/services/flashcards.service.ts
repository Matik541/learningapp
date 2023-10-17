import { Flashcard } from './../enums/enums'
import { Observable, catchError, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { API_URL } from 'src/environments/environment'
import { UsersService } from './users.service'

@Injectable({
  providedIn: 'root',
})
export class FlashcardsService {
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

  addFlashcard(id: number): Observable<Flashcard> {
    return this.http.get<Flashcard>(`${API_URL}/flashcards/${id}`).pipe(
      tap((data) => of(data)),
      catchError((err) => {
        this.error(err)
        return of()
      }),
    )
  }

  updateFlashcard(
    lessonID: number,
    flashcardId: number,
  ): Observable<Flashcard> {
    return this.http
      .put<Flashcard>(`${API_URL}/flashcards/${lessonID}/${flashcardId}`, {
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

  deleteFlashcard(
    lessonId: number,
    flashcardId: number,
  ): Observable<Flashcard> {
    return this.http
      .delete<Flashcard>(`${API_URL}/flashcards/${lessonId}/${flashcardId}`, {
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

  removeAllFlashcards(lessonId: number): Observable<Flashcard> {
    return this.http
      .delete<Flashcard>(`${API_URL}/flashcards/remove/all/${lessonId}`, {
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
