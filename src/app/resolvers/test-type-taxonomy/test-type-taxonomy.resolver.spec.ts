import { TestBed } from '@angular/core/testing';

import { TestTypeTaxonomyResolver } from './test-type-taxonomy.resolver';

describe('TestTypeTaxonomyResolver', () => {
  let resolver: TestTypeTaxonomyResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TestTypeTaxonomyResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
