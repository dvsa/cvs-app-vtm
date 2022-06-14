import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState, State } from '@store/.';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let technicalRecordService: TechnicalRecordService;
  let searchBySpy = jest.fn();
  let store: MockStore<State>;
  let mockSelectQueryParams: MemoizedSelector<any, Params, DefaultProjectorFn<Params>>;
  let router: Router;
  let globalErrorService: GlobalErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TechnicalRecordService,
        provideMockStore({
          initialState: initialAppState
        }),
        GlobalErrorService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    mockSelectQueryParams = store.overrideSelector(selectQueryParams, {});
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    technicalRecordService.searchBy = searchBySpy;
    router = TestBed.inject(Router);
    globalErrorService = TestBed.inject(GlobalErrorService);

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searching', () => {
    describe('manually', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should call the service to search by VIN', () => {
        const searchParams = { searchTerm: 'A_VIN_', type: SEARCH_TYPES.VIN };
        component.searchTechRecords(searchParams.searchTerm, searchParams.type);

        expect(searchBySpy).toBeCalledWith(searchParams);
      });

      it('should call the service to search by partialVin', () => {
        const searchParams = { searchTerm: 'A_PARTIAL_VIN_', type: SEARCH_TYPES.PARTIAL_VIN};
        component.searchTechRecords(searchParams.searchTerm, searchParams.type)

        expect(searchBySpy).toBeCalledWith(searchParams);
      })

      it('should not call service', () => {
        component.searchTechRecords('', SEARCH_TYPES.VIN);
        fixture.detectChanges();
        expect(searchBySpy).not.toHaveBeenCalled();
      });
    });

    describe('by URL params', () => {
      it('should call the service to search by vin with "someVin"', fakeAsync(() => {
        const vin = 'someVin';
        mockSelectQueryParams.setResult({ vin: vin });
        store.refreshState();

        tick();
        fixture.detectChanges();

        expect(searchBySpy).toHaveBeenCalledWith({ searchTerm: vin, type: 'vin'});
      }));

      it('should call the service to search by partialVin with "somePartialVin"', fakeAsync(() => {
        const partialVin = 'somePartialVin';
        mockSelectQueryParams.setResult({ partialVin: partialVin });
        store.refreshState();

        tick();
        fixture.detectChanges();

        expect(searchBySpy).toHaveBeenCalledWith({ searchTerm: partialVin, type: 'partialVin'});
      }))
    });

    describe('navigateSearch', () => {
      it('should navigate to vin search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const vin = 'someVin';
        component.navigateSearch(vin, SEARCH_TYPES.VIN);

        expect(navigateSpy).toHaveBeenCalledWith(['/search'], { queryParams: { vin: 'someVin'} });
      });

      it('should navigate to partialVin search result', () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

        const partialVin = 'somePartialVin';
        component.navigateSearch(partialVin, SEARCH_TYPES.PARTIAL_VIN);

        expect(navigateSpy).toHaveBeenCalledWith(['/search'], { queryParams: { partialVin: 'somePartialVin'} });
      })

      it('should add error', () => {
        const addErrorSpy = jest.spyOn(globalErrorService, 'addError').mockImplementation(() => {});

        component.navigateSearch('', '');

        expect(addErrorSpy).toHaveBeenCalledWith({ error: component.searchErrorMessage, anchorLink: 'search-term' });
      });
    });
  });
});
