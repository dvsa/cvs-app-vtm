import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { techRecordDataResolver } from './tech-record-data.resolver';

describe('techRecordDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => techRecordDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
