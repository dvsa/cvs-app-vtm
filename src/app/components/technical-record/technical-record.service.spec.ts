import { TestBed, inject } from '@angular/core/testing';
import {TechnicalRecordService} from './technical-record.service';


describe('TechnicslRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnicalRecordService]
    });
  });

  it('should be created', inject([TechnicalRecordService], (service: TechnicalRecordService) => {
    expect(service).toBeTruthy();
  }));
});
