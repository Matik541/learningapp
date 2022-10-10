import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FlashcardsService {

  constructor(private http: HttpClient) { }

  getFLashcards(id: number): {title: string, icon: string, id: number}[] {
    this.http.get(API_URL + '/flashcards/' + id);
    return [{title: "Flashcards", icon: "flash_on", id: 0}]
  }

}
