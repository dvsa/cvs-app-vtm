import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatbeltInstallationCheckEditComponent } from './seatbelt-installation-check-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

describe('SeatbeltInstallationCheckEditComponent', () => {
  let component: SeatbeltInstallationCheckEditComponent;
  let fixture: ComponentFixture<SeatbeltInstallationCheckEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeatbeltInstallationCheckEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatbeltInstallationCheckEditComponent);
    component = fixture.componentInstance;
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    component.testTypeGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should set seatbeltOptionSelected to Yes', () => {
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType({
      seatbeltInstallationCheckDate: true
    });
    component.ngOnInit();
    expect(component.seatbeltOptionSelected).toEqual('Yes');
  });

  it('should set seatbeltOptionSelected to No', () => {
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType({
      seatbeltInstallationCheckDate: false
    });
    component.ngOnInit();
    expect(component.seatbeltOptionSelected).toEqual('No');
  });
});
