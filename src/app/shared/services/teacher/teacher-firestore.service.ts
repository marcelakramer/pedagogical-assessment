import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
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
}
