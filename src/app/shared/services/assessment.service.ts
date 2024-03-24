import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../models/assessment';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private baseUrl: string = 'http://localhost:3000/assessments';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}`);
  }

  getById(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.baseUrl}/${id}`);
  }

  getByTeacherId(teacherId: string): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}?teacherId=${teacherId}`);
  }

  create(assessment: Assessment): Observable<Assessment> {
    const { id, ...assessmentWithoutId } = assessment;
    return this.http.post<Assessment>(`${this.baseUrl}`, assessmentWithoutId);
  }

  update(assessment: Assessment): Observable<Assessment> {
    return this.http.put<Assessment>(`${this.baseUrl}/${assessment.id}`, assessment);
  }

  delete(assessment: Assessment): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${assessment.id}`);
  }
}
