import { TestBed } from '@angular/core/testing';

import { ContingencyTestResolver } from './contingency-test.resolver';

describe('ContingencyTestResolver', () => {
  let resolver: ContingencyTestResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ContingencyTestResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
