import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private isLoggedIn: boolean;
  private loggedUser: string | null = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<boolean> {
    return this.http.post(`${API_URL}/auth/login`, {email, password})
    .pipe(
      tap((tokens) => this.loggedIn(email, tokens)),
      map(() => { return true } ),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }

// var request = new HttpRequestMessage();
// request.RequestUri = new Uri("localhost:3000/auth/logout");
// request.Method = HttpMethod.Post;

// request.Headers.Add("Accept", "*/*");
// request.Headers.Add("User-Agent", "Thunder Client (https://www.thunderclient.com)");
// request.Headers.Add("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoic3RyaW5nc3RyaW5nIiwiaWF0IjoxNjY1MDU0OTkwLCJleHAiOjE2NjU2NTk3OTB9.76OmUcdKOCq7KQCRbe1ZKrgdqHB64g-vXPMVujm3kVc");

// var response = await client.SendAsync(request);
// var result = await response.Content.ReadAsStringAsync();
// Console.WriteLine(result);

  logout() {
    var request = new HttpRequestMessage();
    request.RequestUri = new Uri("localhost:3000/auth/logout");
    request.Method = HttpMethod.Post;
    
    request.Headers.Add("Accept", "*/*");
    request.Headers.Add("User-Agent", "Thunder Client (https://www.thunderclient.com)");
    request.Headers.Add("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoic3RyaW5nc3RyaW5nIiwiaWF0IjoxNjY1MDU0OTkwLCJleHAiOjE2NjU2NTk3OTB9.76OmUcdKOCq7KQCRbe1ZKrgdqHB64g-vXPMVujm3kVc");
    
    var response = await client.SendAsync(request);
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);

    
    let token = this.accesToken();

    console.log(token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    console.log(headers.get('Authorization'));

    this.http.post(`${API_URL}/auth/logout`, 
      { headers: headers }
    ).subscribe((data)=>{
      console.log(data);
    })
    return false;
  }
  refreshToken():Observable<any> {
    return this.http.post(`${API_URL}/auth/refresh`, {
      refreshToken: this.refreshTokens()
    })
    .pipe(
      tap((tokens) => console.log(tokens)),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }

  register(userName: string, email: string, password: string):Observable<boolean> {
    return this.http.post(`${API_URL}/auth/register`, 
      {userName, email, hashPassword: this.hashPassword(password)})
      .pipe(
        map(() => { return true } ),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      )
  }

  private loggedIn(email: string, tokens: any): void{
    this.loggedUser = email;
    this.strokeTokens(tokens);
  }
  private loggedOut(): void {
    this.loggedUser = null;
    this.clearTokens();
  }
  
  private hashPassword(password: string): string {
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
  private accesToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // !TODO: better sorage system for **JWT** tokens
  private strokeJWTToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }
  private clearJWTToken(): void {
    localStorage.removeItem('jwt_token');
  }
  private getJWTToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

}
