import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { User } from 'src/app/enums/enums'
import { API_URL } from 'src/environments/environment'
import { Observable, catchError, map, of, tap } from 'rxjs'
import jwt_decode from 'jwt-decode'

// {
//   "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwiaWF0IjoxNjk3MTIzMjY4LCJleHAiOjE2OTc3MjgwNjh9.EZqrXzCfAMKbbQywJqT9T7RvTMcpJKT_Niu9AJNM8wU",
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwiaWF0IjoxNjk3MTIzMjY4LCJleHAiOjE2OTc3MjgwNjh9.Pt0115c4n6zPJYDqFbHYdWgg_tBJbwCXQNmvqptRakU"
// }

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private logged: User = null

  get user(): User {
    return this.logged
  }

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  private snackBar(
    message: string,
    action: string,
    config: {} = { duration: 2000 },
  ) {
    this._snackBar.open(message, action, config)
  }
  private hashPassword(password: string) {
    return jwt_decode(password)
  }
  private loggedIn(tokens: { authToken: string; refreshToken: string }): void {
    let decode = jwt_decode(tokens.authToken) as {
      username: string
      sub: number
    }
    this.logged = {
      userName: decode?.username,
      id: decode?.sub,
    }

    this.strokeTokens(tokens)
  }
  private loggedOut(): void {
    this.logged = null
    this.clearTokens()
  }
  private error(err: any) {
    console.error(err)
    this.snackBar('Error: something went wrong, check console for more info', 'Close')
  }

  authRegister(userName: string, email: string, password: string): void {
    this.http.post(`${API_URL}/auth/register`, {
      userName,
      email,
      password: this.hashPassword(password),
    })
      .pipe(
        tap(() => this.snackBar('Account created', 'Close')),
        catchError((err) => {
          this.error(err);
          return of(null)
        }),
      )
  }

  authLogin(email: string, password: string): Observable<User> {
    return this.http.post<{ authToken: string; refreshToken: string }>(`${API_URL}/auth/login`, {
      email,
      password: this.hashPassword(password),
    })
      .pipe(
        tap((tokens) => this.loggedIn(tokens)),
        map(() => {
          this.snackBar('Logged in', 'Close')
          return this.logged
        }),
        catchError((err) => {
          this.error(err);
          return of(null)
        }),
      )
  }
  authLogout(): Observable<boolean> {
    return this.http.post<User>(`${API_URL}/auth/logout`, null).pipe(
      map(() => {
        this.snackBar('Logged out', 'Close')
        return true 
      }),
      catchError((err) => {
        this.error(err);
        return of(false)
      }),
    )
  }

  authRefreshToken(): void {
    this.http.post<{ authToken: string; refreshToken: string }>(`${API_URL}/auth/refreshtoken`, null)
      .pipe(
        tap((tokens) => this.loggedIn(tokens)),
        catchError((err) => {
          this.error(err);
          return of(null)
        }),
      )
  }

  usersMe(): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/me`)
  }

  users(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/${id}`)
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
  private refreshToken(): string {
    let token = localStorage.getItem('refresh_token')
    return token ? token : ''
  }
  public accessToken(): string {
    let token = localStorage.getItem('access_token')
    return token ? token : ''
  }
}
