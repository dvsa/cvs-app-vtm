import { TestBed } from '@angular/core/testing';

import { DefectsService } from './defects.service';

describe('DefectsService', () => {
  let service: DefectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
