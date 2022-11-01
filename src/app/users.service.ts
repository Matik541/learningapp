import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { API_URL, User } from '../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ErrorsComponent } from './components/errors/errors.component'
import { AppComponent } from './app.component'
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private callSnackBar: boolean
  public loggedUser: User = null

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    if (this.accessToken()) {
      this.loggedUser = jwt_decode(this.accessToken())
    }
  }

  snackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 })
  }

  isLogged(): User {
    return this.loggedUser
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post(`${API_URL}/auth/login`, {
        email,
        hashedPassword: this.hashedPassword(password),
      })
      .pipe(
        tap((tokens) => this.loggedIn(tokens)),
        map(() => {
          return true
        }),
        catchError((err) => {
          console.log(err)
          return of(false)
        })
      )
  }
  logout(): Observable<boolean> {
    const headers = { Authorization: `Bearer ${this.accessToken()}` }
    this.loggedOut()
    let call: Observable<boolean> = this.http
      .post(`${API_URL}/auth/logout`, null, { headers: headers })
      .pipe(
        map(() => {
          return true
        }),
        catchError((err) => {
          console.log(err)
          return of(false)
        })
      )
    this.snackBar(call ? 'Logged out' : 'Error: Something went wrong', 'OK')
    return call
  }
  refreshToken(): Observable<boolean> {
    return this.http
      .post(`${API_URL}/auth/refresh`, {
        refreshToken: this.refreshTokens(),
      })
      .pipe(
        tap((tokens) => console.log(tokens)),
        map(() => {
          return true
        }),
        catchError((err) => {
          console.log(err)
          return of(false)
        })
      )
  }
  register(
    userName: string,
    email: string,
    password: string
  ): Observable<boolean> {
    let call: Observable<boolean> = this.http
      .post(`${API_URL}/auth/register`, {
        userName,
        email,
        hashedPassword: this.hashedPassword(password),
      })
      .pipe(
        map(() => {
          return true
        }),
        catchError((err) => {
          console.log(err)
          return of(false)
        })
      )
    this.snackBar(call ? 'User registered' : 'Error: Invalid form', 'OK')
    return call
  }

  private loggedIn(tokens: any): void {
    this.loggedUser = jwt_decode(tokens.authToken)
    console.log(this.loggedUser)
    this.strokeTokens(tokens)
  }
  private loggedOut(): void {
    this.loggedUser = null
    this.clearTokens()
  }

  private hashedPassword(password: string): string {
    return password
  }

  // TODO: better sorage system for tokens
  private strokeTokens(tokens: any): void {
    localStorage.setItem('access_token', tokens.authToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)
  }
  private clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
  private refreshTokens(): string {
    let token = localStorage.getItem('refresh_token')
    return token ? token : ''
  }
  public accessToken(): string {
    let token = localStorage.getItem('access_token')
    return token ? token : ''
  }
}
