import { TestBed } from '@angular/core/testing';

import { TeachingFirestoreService } from './teaching-firestore.service';

describe('TeachingFirestoreService', () => {
  let service: TeachingFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachingFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
