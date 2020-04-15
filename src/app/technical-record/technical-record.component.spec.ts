import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { Store, StoreModule, INITIAL_STATE } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { of, Subject } from 'rxjs';
import { TechnicalRecordComponent } from './technical-record.component';

describe('TechnicalRecordComponent', () => {
  // let component: TechnicalRecordComponent;
  // let fixture: ComponentFixture<TechnicalRecordComponent>;
  let dialog: MatDialog;
  // const unsubscribe = new Subject<void>();
  let injector: TestBed;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [TechnicalRecordComponent],
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
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    // fixture = TestBed.createComponent(TechnicalRecordComponent);
    injector = getTestBed();
    dialog = injector.get(MatDialog);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  // afterEach(() => {
  //   fixture.destroy();
  //   unsubscribe.next();
  //   unsubscribe.complete();
  // });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });

  // it('should toggle panel open state', () => {
  //   component.togglePanel();
  //   for (const panel of component.panels) {
  //     expect(panel.isOpened).toEqual(true);
  //   }
  // });

  // describe('hasSecondaryVrms', () => {
  //   const vrms = [{ isPrimary: false }, { isPrimary: false }];

  //   test('should return false when passed less than 2 vrms', () => {
  //     expect(component.hasSecondaryVrms([vrms[0]])).toBe(false);
  //   });

  //   test('should return true when provided with more vrms that are not primary', () => {
  //     expect(component.hasSecondaryVrms(vrms)).toBe(true);
  //   });
  // });

  // it('should check if edit action updates variables properly', () => {
  //   component.adrEdit(
  //     {},
  //     ['1A', '1B', '2C'],
  //     ['Hydrogen', 'Expl (type 2)', 'Expl (type 3)'],
  //     false
  //   );
  //   expect(component.changeLabel).toEqual('Save technical record');
  //   expect(component.editRecord).toEqual(true);
  //   expect(component.adrData).toEqual(false);
  //   expect(component.showCheck).toEqual(true);
  //   expect(component.numberFee).toEqual(['1A', '1B', '2C']);
  //   // expect(component.dangerousGoods).toEqual(['Hydrogen', 'Expl (type 2)', 'Expl (type 3)']);
  //   expect(component.isAdrNull).toEqual(false);
  // });

  // it('should check if cancel action updates variables properly', () => {
  //   component.cancelAddrEdit();
  //   expect(component.changeLabel).toEqual('Change technical record');
  //   expect(component.adrData).toEqual(true);
  //   expect(component.showCheck).toEqual(false);
  //   expect(component.editRecord).toEqual(false);
  //   expect(component.hideForm).toEqual(false);
  // });

  // describe('onSaveChages', () => {
  //   test('should open modal and dispatch action with user input', () => {
  //     spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });

  //     component.onSaveChanges();
  //     expect(dialog.open).toHaveBeenCalled();
  //     expect(store.dispatch).toHaveBeenCalled();
  //   });
  // });

  // afterAll(() => {
  //   TestBed.resetTestingModule();
  // });

  // describe('canDeactivate', () => {
  //   test('return true if component can be deactivated ', () => {
  //     expect(component.canDeactivate()).toEqual(true);
  //   });

  //   test('return false if component can not be deactivated', () => {
  //     component.isFormDirty = true;

  //     expect(component.canDeactivate()).toEqual(false);
  //   });
  // });
});
