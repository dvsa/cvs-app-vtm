import { TestBed } from '@angular/core/testing';

import { TestTypesService } from './test-types.service';

describe('TestTypesService', () => {
  let service: TestTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
