import { TestBed } from '@angular/core/testing';

import { DefectsTaxonomyResolver } from './defects-taxonomy.resolver';

describe('DefectsTaxonomyResolver', () => {
  let resolver: DefectsTaxonomyResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DefectsTaxonomyResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
