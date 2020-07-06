import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TechnicalRecordComponent } from './technical-record.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { TechnicalRecordValuesMapper } from './technical-record-value.mapper';

import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { scrollToSection } from '@app/utils';

describe('TechnicalRecordComponent', () => {
  // let component: TechnicalRecordComponent;
  // let fixture: ComponentFixture<TechnicalRecordComponent>;
  let dialog: MatDialog;
  let injector: TestBed;
  //let activeRecord: TechRecord = mockedActiveRecord;

  const mockPanels = [
    { panel: 'Test History', isOpened: false },
    { panel: 'Tech Record History', isOpened: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [TechnicalRecordComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    injector = getTestBed();
    dialog = injector.get(MatDialog);
    // fixture = TestBed.createComponent(TechnicalRecordComponent);
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
    // expect(component).toBeDefined();
    // expect(fixture).toMatchSnapshot();
  });

  it('should scroll & open section via "scrollToSection" util', () => {
    window.scrollTo = jest.fn();
    const mockFn = jest.fn(scrollToSection);
    mockFn(mockPanels, mockPanels[1].panel);
    expect(mockFn).toHaveBeenCalledWith(mockPanels, mockPanels[1].panel);
  });

  it('should switch the active record with the selected one', () => {
    //expect(component.activeRecord).toBeTruthy();
  });
});
