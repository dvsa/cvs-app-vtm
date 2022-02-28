import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { INITIAL_STATE, Store, StoreModule } from '@ngrx/store';

import { hot } from 'jasmine-marbles';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import { GetVehicleTechRecordHavingStatusAll } from '@app/store/actions/VehicleTechRecordModel.actions';
import { SearchParams } from '@app/models/search-params';

describe('TechnicalRecordSearchComponent', () => {
  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordSearchComponent],
      imports: [StoreModule.forRoot(appReducers)],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store.select).toHaveBeenCalled();
  });

  describe('searchTechRecords', () => {
    it('should dispatch get action when the button is pressed', () => {
      const searchIdentifier = 'test@23. com';
      const searchIdentifierEncoded = 'test%4023.%20com';
      const searchCriteria =
        'Vehicle registration mark, trailer ID or vehicle identification number';
      component.searchTechRecords(searchIdentifier, searchCriteria);

      expect(component.isLoading).toBe(true);
      expect(component.searchParams.searchIdentifier).toBe(searchIdentifierEncoded);
      expect(component.searchParams.searchCriteria).toBe('all');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });

    it('should have correct behaviour for VRM', () => {
      const searchParams: SearchParams = {
        searchIdentifier: 'test',
        searchCriteria: 'Vehicle registration mark (VRM)'
      };
      component.searchTechRecords(searchParams.searchIdentifier, searchParams.searchCriteria);

      expect(component.searchParams.searchCriteria).toBe('vrm');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });

    it('should have correct behaviour for FULL VIN', () => {
      const searchParams: SearchParams = {
        searchIdentifier: 'test',
        searchCriteria: 'Full vehicle identification number (VIN)'
      };
      component.searchTechRecords(searchParams.searchIdentifier, searchParams.searchCriteria);

      expect(component.searchParams.searchCriteria).toBe('vin');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });

    it('should have correct behaviour for PARTIAL VIN', () => {
      const searchParams: SearchParams = {
        searchIdentifier: 'test',
        searchCriteria: 'Partial VIN (last 6 characters)'
      };
      component.searchTechRecords(searchParams.searchIdentifier, searchParams.searchCriteria);

      expect(component.searchParams.searchCriteria).toBe('partialVin');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });

    it('should have correct behaviour for TRAILER ID', () => {
      const searchParams: SearchParams = {
        searchIdentifier: 'test',
        searchCriteria: 'Trailer ID'
      };
      component.searchTechRecords(searchParams.searchIdentifier, searchParams.searchCriteria);

      expect(component.searchParams.searchCriteria).toBe('trailerId');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });

    it('should have correct behaviour for default', () => {
      const searchParams: SearchParams = { searchIdentifier: 'test', searchCriteria: 'testing' };
      component.searchTechRecords(searchParams.searchIdentifier, searchParams.searchCriteria);

      expect(component.searchParams.searchCriteria).toBe('all');

      expect(store.dispatch).toHaveBeenCalledWith(
        new GetVehicleTechRecordHavingStatusAll(component.searchParams)
      );
    });
  });
});
