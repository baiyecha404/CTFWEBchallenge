import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient, private platformLocation: PlatformLocation) { }

  getAnswer() {
    return this.http.get('/api/answer')
  }
}
