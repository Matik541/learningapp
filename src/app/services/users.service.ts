import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { User, UserMe, CallError } from 'src/app/enums/enums'
import { API_URL } from 'src/environments/environment'
import { Observable, catchError, map, of, tap } from 'rxjs'
import jwt_decode from 'jwt-decode'

// {
//   "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwiaWF0IjoxNjk3MTIzMjY4LCJleHAiOjE2OTc3MjgwNjh9.EZqrXzCfAMKbbQywJqT9T7RvTMcpJKT_Niu9AJNM8wU",
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwiaWF0IjoxNjk3MTIzMjY4LCJleHAiOjE2OTc3MjgwNjh9.Pt0115c4n6zPJYDqFbHYdWgg_tBJbwCXQNmvqptRakU"
// }

type Tokens = { authToken: string; refreshToken: string }

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private logged: User = null

  get user(): User {
    return this.logged
  }

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    if (this.refreshToken())
      this.authRefreshToken()
  }

  private snackBar(
    message: string,
    action: string,
    config: {} = { duration: 2000 },
  ) {
    this._snackBar.open(message, action, config)
  }
  private hashPassword(password: string): string {
    let i = 0
    return password
      .split('')
      .sort(() => (i++ % 2) - 1)
      .join('')
  }
  private loggedIn(tokens: Tokens): User {
    this.strokeTokens(tokens)

    let decode = jwt_decode(tokens.authToken) as {
      username: string
      sub: number
    }

    this.logged = {
      userName: decode?.username,
      id: decode?.sub,
    }
    return this.logged
  }

  private loggedOut(): void {
    this.logged = null
    this.clearTokens()
  }

  private error(err: any) {
    console.error(err)
    this.snackBar(
      'Error: something went wrong, check console for more info',
      'Close',
    )
  }

  authRegister(
    userName: string,
    email: string,
    password: string,
  ): Observable<User | CallError> {
    console.log(this.hashPassword(password))
    return this.http
      .post(`${API_URL}/auth/register`, {
        userName,
        email,
        hashedPassword: this.hashPassword(password),
      })
      .pipe(
        tap((tokens) => {
          this.snackBar('Account created', 'Close')
          return of(this.loggedIn(tokens as Tokens))
        }),
        catchError((err) => {
          this.error(err)
          return of(err.error)
        }),
      ) as Observable<User | CallError>
  }

  authLogin(email: string, password: string): Observable<User | CallError> {
    return this.http
      .post(`${API_URL}/auth/login`, {
        email,
        hashedPassword: this.hashPassword(password),
      })
      .pipe(
        tap((tokens) => {
          this.snackBar('Logged in', 'Close')
          return this.loggedIn(tokens as Tokens)
        }),
        catchError((err: CallError) => {
          this.error(err)
          return of(err.error)
        }),
      ) as Observable<User | CallError>
  }
  authLogout(): Observable<boolean> {
    this.loggedOut()
    return this.http.post<boolean>(`${API_URL}/auth/logout`, null).pipe(
      tap(() => {
        this.snackBar('Logged out', 'Close')
        return true
      }),
      catchError((err) => {
        this.error(err)
        return of(false)
      }),
    )
  }

  authRefreshToken(): void {
    this.http.post<Tokens>(`${API_URL}/auth/refreshtoken`, null, {
      headers: { Authorization: `Bearer ${this.refreshToken()}` },
    }).pipe(
      tap((tokens) => this.loggedIn(tokens)),
      catchError((err) => {
        this.error(err)
        return of()
      }),
    ).subscribe((tokens) => this.loggedIn(tokens))
  }

  usersMe(): Observable<UserMe> {
    return this.http.get<UserMe>(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${this.accessToken()}` },
    })
  }

  users(id: number): Observable<UserMe> {
    return this.http.get<UserMe>(`${API_URL}/users/${id}`)
  }

  // TODO: better storage system for tokens
  private strokeTokens(tokens: any): void {
    localStorage.setItem('access_token', tokens.authToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)
  }
  
  private clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  private refreshToken = (): string => localStorage.getItem('refresh_token') ?? ''
  public accessToken = (): string => localStorage.getItem('access_token') ?? ''
}
