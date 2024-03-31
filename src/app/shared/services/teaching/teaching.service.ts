import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teaching } from '../../models/teaching';

@Injectable({
  providedIn: 'root'
})
export class TeachingService {
  private baseUrl: string = 'http://localhost:3000/teachings';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Teaching[]> {
    return this.http.get<Teaching[]>(`${this.baseUrl}`);
  }

  getById(id: string): Observable<Teaching> {
    return this.http.get<Teaching>(`${this.baseUrl}/${id}`);
  }

  getByTeacherId(teacherId: string): Observable<Teaching[]> {
    return this.http.get<Teaching[]>(`${this.baseUrl}?teacherId=${teacherId}`);
  }

  create(teaching: Teaching): Observable<Teaching> {
    return this.http.post<Teaching>(`${this.baseUrl}`, teaching);
  }

  update(teaching: Teaching): Observable<Teaching> {
    return this.http.put<Teaching>(`${this.baseUrl}/${teaching.id}`, teaching);
  }

  delete(teaching: Teaching): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${teaching.id}`);
  }
}
