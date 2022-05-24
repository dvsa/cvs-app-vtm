import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/.';
import { GlobalErrorService } from '../global-error/global-error.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let technicalRecordService: TechnicalRecordService;
  let searchBySpy = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState }), GlobalErrorService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    technicalRecordService.searchBy = searchBySpy;
    fixture.detectChanges();

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    it('should call the service to search by VIN', () => {
      const searchParams = { searchTerm: 'A_VIN_', type: 'vin' };
      component.searchTechRecords(searchParams.searchTerm);

      expect(searchBySpy).toBeCalledWith(searchParams);
    });

    it('should not call service', () => {
      component.searchTechRecords('');
      fixture.detectChanges();
      expect(searchBySpy).not.toHaveBeenCalled();
    });
  });
});
