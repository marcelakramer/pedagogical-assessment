import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, from, map } from 'rxjs';
import { Assessment } from '../../models/assessment';


@Injectable({
  providedIn: 'root'
})
export class AssessmentFirestoreService {
  COLLECTION_NAME: string = 'assessments'
  assessmentsCollection: AngularFirestoreCollection<Assessment>;

  constructor(private afs: AngularFirestore) {
    this.assessmentsCollection = afs.collection(this.COLLECTION_NAME);
  }

  getByTeacherId(id: string): Observable<Assessment[]> {
    return this.afs.collection<Assessment>(this.COLLECTION_NAME, ref => ref.where('teacherId', '==', id))
      .valueChanges({ idField: 'id' });
  }

  create(assessment: Assessment): Observable<Assessment> {
    //@ts-expect-error the id gets here as a empty string
    delete assessment.id;
    return from(this.assessmentsCollection.add({...assessment}))
      .pipe(
        map((docRef) => {
          assessment.id = docRef.id;
          return assessment;
        })
      );
  }
}
