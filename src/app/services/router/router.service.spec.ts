import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { RouterService } from './router.service';

describe('RouterService', () => {
  let service: RouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({ initialState: initialAppState })] });
    service = TestBed.inject(RouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
