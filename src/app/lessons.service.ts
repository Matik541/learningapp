import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LessonsService {

  constructor(private http: HttpClient) { }

  getFlashcards(id: number): { title: string, icon: string, id: number } {
    this.http.get(API_URL + '/lessons/' + id)
    // .subscribe(() => { })

    return { title: "", icon: "flash_on", id: id }
  }

}
