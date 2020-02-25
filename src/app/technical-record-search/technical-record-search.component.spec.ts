import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { adrDetailsReducer } from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.reducer';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { INITIAL_STATE, Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Subject, of } from 'rxjs';
import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import { GetVehicleTechRecordModelHavingStatusAll } from '@app/store/actions/VehicleTechRecordModel.actions';

describe('TechnicalRecordSearchComponent', () => {

  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordSearchComponent],
      imports: [
        StoreModule.forRoot(appReducers),
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(store.select).toHaveBeenCalled();
  });

  describe('searchTechRecords', () => {
    it('should dispatch get action when the button is pressed', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'Vehicle registration mark, trailer ID or vehicle identification number';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.isLoading).toBe(true);
      expect(component.searchIdentifier).toBe(searchIdentifier);
      expect(component.searchCriteria).toBe('all');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

    it('should have correct behaviour for VRM', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'Vehicle registration mark (VRM)';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.searchCriteria).toBe('vrm');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

    it('should have correct behaviour for FULL VIN', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'Full vehicle identification number (VIN)';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.searchCriteria).toBe('vin');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

    it('should have correct behaviour for PARTIAL VIN', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'Partial VIN (last 6 characters)';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.searchCriteria).toBe('partialVin');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

    it('should have correct behaviour for TRAILER ID', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'Trailer ID';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.searchCriteria).toBe('trailerId');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

    it('should have correct behaviour for default', () => {
      const searchIdentifier = 'test';
      const searchCriteria   = 'testing';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.searchCriteria).toBe('all');

      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll([component.searchIdentifier, component.searchCriteria]));
    });

  });

});
