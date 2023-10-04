import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { TestTypesService } from './test-types.service';

describe('TestTypesService', () => {
  let service: TestTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestTypesService, provideMockStore({ initialState: initialAppState })],
    });

    service = TestBed.inject(TestTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
