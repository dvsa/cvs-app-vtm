import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { adrDetailsReducer } from '@app/technical-record/adr-details-form/store/adrDetails.reducer';
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
      const searchTerm = 'test';
      component.searchTechRecords(searchTerm);

      expect(component.isLoading).toBe(true);
      expect(component.searchIdentifier).toBe(searchTerm);
      expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll(searchTerm));
    });
  });

});
