import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, filter, map } from 'rxjs';
import { Teacher } from '../../models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherFirestoreService {
  COLLECTION_NAME: string = 'teachers'
  teachersCollection: AngularFirestoreCollection<Teacher>;

  constructor(private afs: AngularFirestore) {
    this.teachersCollection = afs.collection(this.COLLECTION_NAME);
  }

  getAll(): Observable<Teacher[]> {
    return this.teachersCollection.valueChanges({idField: 'id'});
  }

  getById(id: string): Observable<Teacher> {
    const teacherDoc: AngularFirestoreDocument<Teacher> = this.afs.doc(`${this.COLLECTION_NAME}/${id}`);

    return teacherDoc.valueChanges({ idField: 'id' }).pipe(
      filter(teacher => !!teacher),
      map(teacher => teacher as Teacher)
    );
  }
}
