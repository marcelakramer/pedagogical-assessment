import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl: string = 'http://localhost:3000/teachers';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}`);
  }

  getById(id: string) {
    return this.http.get<Teacher>(`${this.baseUrl}?id=${id}`)
  }

  create(Teacher: Teacher) {
    return this.http.post<Teacher>(`${this.baseUrl}`, Teacher);
  }

  update(Teacher: Teacher) {
    return this.http.put<Teacher>(`${this.baseUrl}/Teacher/${Teacher.id}`, Teacher);
  }

  delete(Teacher: Teacher) {
    return this.http.delete<Teacher>(`${this.baseUrl}/Teacher/${Teacher.id}`);
  }
}
