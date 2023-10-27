import { TestBed } from '@angular/core/testing';

import { TechRecordReviewResolver } from './tech-record-review.resolver';

describe('TechRecordReviewResolver', () => {
  let resolver: TechRecordReviewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TechRecordReviewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
