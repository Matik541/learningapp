import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_URL, User } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private loggedUser: User = null;

  constructor(private http: HttpClient) { }

  isLogged(): User {
    return this.loggedUser;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap((tokens) => this.loggedIn(email, tokens)),
        map(() => { return true }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
  logout(): Observable<boolean> {
    const headers = { 'Authorization': `Bearer ${this.accessToken()}` }
    this.loggedOut()
    return this.http.post(`${API_URL}/auth/logout`, null, { headers: headers }
    ).pipe(
      map(() => { return true }),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    )
  }
  refreshToken(): Observable<boolean> {
    return this.http.post(`${API_URL}/auth/refresh`, {
      refreshToken: this.refreshTokens()
    })
      .pipe(
        tap((tokens) => console.log(tokens)),
        map(() => { return true }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
  register(userName: string, email: string, password: string): Observable<boolean> {
    return this.http.post(`${API_URL}/auth/register`,
      { userName, email, hashedPassword: this.hashedPassword(password) })
      .pipe(
        map(() => { return true }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      )
  }

  private loggedIn(email: string, tokens: any): void {
    this.loggedUser = { email: email, nickname: '', id: NaN };
    this.strokeTokens(tokens);
  }
  private loggedOut(): void {
    this.loggedUser = null;
    this.clearTokens();
  }

  private hashedPassword(password: string): string {
    // TODO: use jwt token to hash Password

    return password;
  }

  // TODO: better sorage system for tokens
  private strokeTokens(tokens: any): void {
    localStorage.setItem('access_token', tokens.authToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  private refreshTokens(): string | null {
    return localStorage.getItem('refresh_token');
  }
  public accessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
