import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditComponent } from './vehicle-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TestResultModel} from '@app/models/test-result.model';
import {Preparer} from '@app/models/preparer';
import {TESTING_UTILS} from '@app/utils/testing.utils';

describe('VehicleEditComponent', () => {
  let component: VehicleEditComponent;
  let fixture: ComponentFixture<VehicleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleEditComponent],
      imports: [ReactiveFormsModule, MatDialogModule],
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
    fixture = TestBed.createComponent(VehicleEditComponent);
    component = fixture.componentInstance;
    component.testRecord = { vehicleType: 'psv' } as TestResultModel;
    component.preparers = [{} as Preparer];
    component.preparersOptions = ['test'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
