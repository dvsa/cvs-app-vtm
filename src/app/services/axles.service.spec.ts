import { TestBed } from '@angular/core/testing';

import { AxlesService } from './axles.service';

describe('TechnicalRecordSummaryService', () => {
  let service: AxlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
