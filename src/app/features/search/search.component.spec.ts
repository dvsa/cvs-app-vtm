import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Roles } from '@models/roles.enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState, State } from '@store/.';
import { globalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let globalErrorService: GlobalErrorService;
  let router: Router;
  let store: MockStore<State>;
  const expectedError: GlobalError = { error: 'some-error', anchorLink: 'some-link' };
  const expectedErrors: GlobalError[] = [expectedError];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [GlobalErrorService, TechnicalRecordService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(globalErrorState, expectedErrors);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    globalErrorService = TestBed.inject(GlobalErrorService);
    router = TestBed.inject(Router);

    jest.clearAllMocks();
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('searching', () => {
    describe('navigateSearch', () => {
      it('should navigate to vin search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const expectedVin = 'someVin';
        component.navigateSearch(expectedVin, SEARCH_TYPES.VIN);

        expect(navigateSpy).toHaveBeenCalledWith(['/search/results'], { queryParams: { vin: expectedVin } });
      });

      it('should navigate to partialVin search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const expectedPartialVin = 'somePartialVin';
        component.navigateSearch(expectedPartialVin, SEARCH_TYPES.PARTIAL_VIN);

        expect(navigateSpy).toHaveBeenCalledWith(['/search/results'], { queryParams: { partialVin: expectedPartialVin } });
      });

      it('should navigate to vrm search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const expectedVrm = 'someVrm';
        component.navigateSearch(expectedVrm, SEARCH_TYPES.VRM);

        expect(navigateSpy).toHaveBeenCalledWith(['/search/results'], { queryParams: { primaryVrm: expectedVrm } });
      });

      it('should navigate to trailerId search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const expectedTrailerId = 'someTrailerId';
        component.navigateSearch(expectedTrailerId, SEARCH_TYPES.TRAILER_ID);

        expect(navigateSpy).toHaveBeenCalledWith(['/search/results'], { queryParams: { trailerId: expectedTrailerId } });
      });
    });

    describe('invalid input', () => {
      it('should add search-term error', () => {
        const addErrorSpy = jest.spyOn(globalErrorService, 'addError').mockImplementation(() => {});

        component.navigateSearch('', '');

        expect(addErrorSpy).toHaveBeenCalledWith({ error: component.missingTermErrorMessage, anchorLink: 'search-term' });
      });

      it('should add search-type error', () => {
        const addErrorSpy = jest.spyOn(globalErrorService, 'addError').mockImplementation(() => {});

        component.navigateSearch('some term', '');

        expect(addErrorSpy).toHaveBeenCalledWith({ error: component.missingTypeErrorMessage, anchorLink: 'search-type' });
      });
    });

    describe('helper methods', () => {
      it('should get inline error message', done => {
        const addErrorSpy = jest.spyOn(globalErrorService, 'errors$', 'get').mockImplementation(() => of(expectedErrors));

        component.getInlineErrorMessage(expectedError.anchorLink!).subscribe(response => {
          expect(response).toBeTruthy();
          done();
        }); // subscribe to activate the map inside 'getInlineErrorMessage()'

        expect(addErrorSpy).toHaveBeenCalled();
      });

      it('should get error by name', () => {
        const error = component.getErrorByName(expectedErrors, expectedError.anchorLink!);

        expect(error).toEqual(expectedError);
      });

      it('should return roles', () => {
        const roles = component.roles;

        expect(roles).toBe(Roles);
      });
    });
  });
});
