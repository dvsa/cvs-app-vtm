import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store, StoreModule } from '@ngrx/store';

import { hot } from 'jasmine-marbles';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { adrDetailsReducer } from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.reducer';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { TechnicalRecordSearchComponent } from './technical-record-search.component';

describe('TechnicalRecordSearchComponent', () => {

  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordSearchComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(appReducers),
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
      ],
      providers: [
        // {
        //   provide: Store,
        //   useValue: {
        //     dispatch: jest.fn(),
        //     pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
        //     select: jest.fn()
        //   }
        // },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
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
    expect(fixture).toMatchSnapshot();
  });

  it('should compile with error', () => {
    // TODO
    // introduce mock selector approach
  });

  // describe('searchTechRecords', () => {
  //   it('should dispatch get action when the button is pressed', () => {
  //     const searchTerm = 'test';
  //     component.searchTechRecords(searchTerm);

  //     expect(component.isLoading).toBe(true);
  //     expect(component.searchIdentifier).toBe(searchTerm);
  //     expect(store.dispatch).toHaveBeenCalledWith(new GetVehicleTechRecordModelHavingStatusAll(searchTerm));
  //   });
  // });
});
