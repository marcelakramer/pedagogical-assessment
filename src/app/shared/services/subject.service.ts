import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Subject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private baseUrl: string = 'http://localhost:3000/subjects';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseUrl}`);
  }
  
  getById(id: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.baseUrl}/${id}`);
  }
  
  create(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(`${this.baseUrl}`, subject);
  }
  
  update(subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(`${this.baseUrl}/${subject.id}`, subject);
  }
  
  delete(subject: Subject): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${subject.id}`);
  }

  getSubjectsByIds(ids: string[]): Observable<Subject[]> {
    return this.getAll().pipe(
      map(subjects => subjects.filter(subject => ids.includes(subject.id)))
    );
  }
}
