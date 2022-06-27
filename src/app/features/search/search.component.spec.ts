import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/.';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
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
    router = TestBed.inject(Router);
    globalErrorService = TestBed.inject(GlobalErrorService);

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

      it('should add error', () => {
        const addErrorSpy = jest.spyOn(globalErrorService, 'addError').mockImplementation(() => {});

        component.navigateSearch('', '');

        expect(addErrorSpy).toHaveBeenCalledWith({ error: component.missingTermErrorMessage, anchorLink: 'search-term' });
      });
    });
  });
});
