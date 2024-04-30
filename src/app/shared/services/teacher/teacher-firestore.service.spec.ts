import { TestBed } from '@angular/core/testing';

import { TeacherFirestoreService } from './teacher-firestore.service';

describe('TeacherFirestoreService', () => {
  let service: TeacherFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
