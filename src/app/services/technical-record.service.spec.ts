import { TestBed } from '@angular/core/testing';

import { TechnicalRecordService } from './technical-record.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
