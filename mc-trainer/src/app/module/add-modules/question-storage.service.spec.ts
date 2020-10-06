import { TestBed } from '@angular/core/testing';

import { QuestionStorageService } from './question-storage.service';

describe('QuestionStorageService', () => {
  let service: QuestionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
