import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { TestTypesService } from './test-types.service';

describe('TestTypesService', () => {
  let service: TestTypesService;
  let httpTestingController: HttpTestingController;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestTypesService, provideMockStore({ initialState: initialAppState })]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
    service = TestBed.inject(TestTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
