import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestRecordService } from './test-record.service';
import { initialAppState } from '@store/.';
import { provideMockStore } from '@ngrx/store/testing';

describe('TestRecordService', () => {
  let service: TestRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();

    service = TestBed.inject(TestRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
