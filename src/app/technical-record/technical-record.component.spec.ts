
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DownloadDocumentFileAction } from '@app/adr-details-form/store/adrDetails.actions';
import { adrDetailsReducer } from '@app/adr-details-form/store/adrDetails.reducer';
import { INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { of, Subject } from 'rxjs';
import { TechnicalRecordComponent } from './technical-record.component';

describe('TechnicalRecordComponent', () => {

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  let dialog: MatDialog;
  const unsubscribe = new Subject<void>();
  let injector: TestBed;
  let store: Store<IAppState>;
  const axles = [
    {
      'parkingBrakeMrk': false,
      'axleNumber': 1
    },
    {
      'parkingBrakeMrk': true,
      'axleNumber': 2
    }
  ];

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
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
        ReactiveFormsModule,
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
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordComponent);
    dialog = fixture.debugElement.injector.get(MatDialog);
    injector = getTestBed();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isNullOrEmpty', () => {
    test('should check for empty string', () => {
      const customObject = '';
      const result = component.isNullOrEmpty(customObject);

      expect(result).toEqual(true);
    });

    test('should check for null', () => {
      const customObject = null;
      const result = component.isNullOrEmpty(customObject);

      expect(result).toEqual(true);
    });

    test('should check for non empty string', () => {
      const customObject = 'one';
      const result = component.isNullOrEmpty(customObject);

      expect(result).toEqual(false);
    });

    it('should check for non empty number', () => {
      const customObject = 123;
      const result = component.isNullOrEmpty(customObject);

      expect(result).toEqual(false);
    });
  });

  it('should toggle panel open state', () => {
    component.togglePanel();
    for (const panel of component.panels) {
      expect(panel.isOpened).toEqual(true);
    }
  });

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  describe('axlesHasNoParkingBrakeMrk', () => {
    const axles = [{parkingBrakeMrk: true}, { parkingBrakeMrk: true}, { parkingBrakeMrk: false }];

    test('should return true if the axles has no parking brake when called', () => {
      expect(component.axlesHasNoParkingBrakeMrk( [] )).toBe(true);
    });

    test('should return false if one of the axles have parking brake when called', () => {
      expect(component.axlesHasNoParkingBrakeMrk(axles)).toBe(false);
    });
  });

  describe('hasSecondaryVrms', () => {
    const vrms = [{ isPrimary: false }, { isPrimary: false }];

    test('should return false when passed less than 2 vrms', () => {
      expect(component.hasSecondaryVrms([vrms[0]])).toBe(false);
    });

    test('should return true when provided with more vrms that are not primary', () => {
      expect(component.hasSecondaryVrms(vrms)).toBe(true);
    });
  });

  it('should check if edit action updates variables properly', () => {
    component.adrEdit({}, ['1A', '1B', '2C'], ['Hydrogen', 'Expl (type 2)', 'Expl (type 3)'], false);
    expect(component.changeLabel).toEqual('Save technical record');
    expect(component.isSubmit).toEqual(true);
    expect(component.adrData).toEqual(false);
    expect(component.showCheck).toEqual(true);
    expect(component.numberFee).toEqual(['1A', '1B', '2C']);
    // expect(component.dangerousGoods).toEqual(['Hydrogen', 'Expl (type 2)', 'Expl (type 3)']);
    expect(component.isAdrNull).toEqual(false);
  });

  it('should check if axles has no parking brake mrk', () => {
    component.axlesHasNoParkingBrakeMrk(axles);
    for (const axle of axles) {
      if (axle.parkingBrakeMrk === true) {
        expect(component.axlesHasNoParkingBrakeMrk(axles)).toBeFalsy();
      }
    }
  });

  it('should check if cancel action updates variables properly', () => {
    component.cancelAddrEdit();
    expect(component.changeLabel).toEqual('Change technical record');
    expect(component.adrData).toEqual(true);
    expect(component.showCheck).toEqual(false);
    expect(component.isSubmit).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  it('should switch ADR display conditionally', () => {
    const customObject = { 'currentTarget': { 'value': 'true' } };
    component.switchAdrDisplay(customObject as any);

    expect(component.adrData).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  describe('downloadDocument', () => {
    test('should dispatch download document action when called', () => {
      jest.spyOn(store, 'dispatch');
      const doc = 'test';

      component.downloadDocument(doc);
      expect(store.dispatch).toHaveBeenCalledWith(new DownloadDocumentFileAction(doc));
    });
  });

  describe('trackByIndex', () => {
    test('should return the index passed as an argument when called', () => { expect(component.trackByIndex(23)).toBe(23); })
  });

  describe('trackById', () => {
    test('should return the id passed as an argument when called', () => { expect(component.trackById(24, '123')).toBe('123'); })
  });

  describe('trackByFn', () => {
    test('should return the id of the argument when called', () => {
      expect(component.trackByFn(23, { id: 3 })).toBe(3);
    });
  });

  describe('onSaveChages', () => {
    test('should open modal and dispatch action with user input', () => {
      spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)});

      component.onSaveChanges();
      expect(dialog.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });


  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
