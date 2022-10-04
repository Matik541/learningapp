import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, {email, password});
  }
  logout():Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, {});
  }
  register(userName: string, email: string, password: string):Observable<any> {
    let hashedPassword = password;
    return this.http.post(`${API_URL}/auth/register`, {userName, email, hashedPassword});
  }
}
