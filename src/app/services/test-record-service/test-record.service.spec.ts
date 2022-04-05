import { TestBed } from '@angular/core/testing';

import { TestRecordService } from './test-record.service';

describe('TestRecordService', () => {
  let service: TestRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
