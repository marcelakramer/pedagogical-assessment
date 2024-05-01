import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Teaching } from '../../models/teaching';


@Injectable({
  providedIn: 'root'
})
export class TeachingFirestoreService {
  COLLECTION_NAME: string = 'teachings'
  teachingsCollection: AngularFirestoreCollection<Teaching>;

  constructor(private afs: AngularFirestore) {
    this.teachingsCollection = afs.collection(this.COLLECTION_NAME);
  }

  getByTeacherId(id: string): Observable<Teaching[]> {
    return this.afs.collection<Teaching>(this.COLLECTION_NAME, ref => ref.where('teacherId', '==', id))
      .valueChanges({ idField: 'id' });
  }
}
