import { TestBed } from '@angular/core/testing';

import { AssessmentFirestoreService } from './assessment-firestore.service';

describe('AssessmentFirestoreService', () => {
  let service: AssessmentFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
