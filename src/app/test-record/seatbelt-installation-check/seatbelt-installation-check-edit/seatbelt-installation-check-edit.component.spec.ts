import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatbeltInstallationCheckEditComponent } from './seatbelt-installation-check-edit.component';
import { TestType } from '@app/models/test.type';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';

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
    component.testType = {} as TestType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
