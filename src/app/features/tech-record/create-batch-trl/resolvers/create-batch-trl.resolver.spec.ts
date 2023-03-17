import { TestBed } from '@angular/core/testing';

import { CreateBatchTrlResolver } from './create-batch-trl.resolver';

describe('CreateBatchTrlResolver', () => {
  let resolver: CreateBatchTrlResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CreateBatchTrlResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
