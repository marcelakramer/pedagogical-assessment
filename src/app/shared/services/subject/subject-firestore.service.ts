import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, filter, map } from 'rxjs';
import { Subject } from '../../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectFirestoreService {
  COLLECTION_NAME: string = 'subjects'
  subjectsCollection: AngularFirestoreCollection<Subject>;

  constructor(private afs: AngularFirestore) {
    this.subjectsCollection = afs.collection(this.COLLECTION_NAME);
  }

  getAll(): Observable<Subject[]> {
    return this.subjectsCollection.valueChanges({idField: 'id'});
  }

  getById(id: string): Observable<Subject> {
    const subjectDoc: AngularFirestoreDocument<Subject> = this.afs.doc(`${this.COLLECTION_NAME}/${id}`);

    return subjectDoc.valueChanges({ idField: 'id' }).pipe(
      filter(subject => !!subject),
      map(subject => subject as Subject)
    );
  }

  getManyByIds(ids: string[]): Observable<Subject[]> {
    return this.getAll().pipe(
      map(subjects => subjects.filter(subject => ids.includes(subject.id)))
    );
  }
}
