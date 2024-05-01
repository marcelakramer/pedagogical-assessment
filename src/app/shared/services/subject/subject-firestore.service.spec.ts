import { TestBed } from '@angular/core/testing';

import { SubjectFirestoreService } from './subject-firestore.service';

describe('SubjectFirestoreService', () => {
  let service: SubjectFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
