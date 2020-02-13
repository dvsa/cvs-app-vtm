import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { adrDetailsReducer } from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.reducer';
import { INITIAL_STATE } from '@app/technical-record/adr-details/adr-details-form/store/adrDetailsForm.state';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { of, Subject } from 'rxjs';
import { SpinnerLoaderComponent } from './spinner-loader.component';

describe('SpinnerLoaderComponent', () => {
  let component: SpinnerLoaderComponent;
  let fixture: ComponentFixture<SpinnerLoaderComponent>;
  let injector: TestBed;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
      ],
      declarations: [SpinnerLoaderComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn(),
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerLoaderComponent);
    injector = getTestBed();
    store = injector.get(Store);
    spyOn(store, 'pipe').and.callThrough();
    component = fixture.componentInstance;
    fixture.detectChanges;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

});
