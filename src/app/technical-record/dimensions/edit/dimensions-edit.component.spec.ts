import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { DimensionsEditComponent } from './dimensions-edit.component';
import { TechRecord } from '@app/models/tech-record.model';

describe('DimensionsEditComponent', () => {
  let component: DimensionsEditComponent;
  let fixture: ComponentFixture<DimensionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [DimensionsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form dimensions controls', () => {
    component.techRecord = {
      frontAxleTo5thWheelMin: 456,
      frontAxleTo5thWheelMax: 660,
      frontAxleTo5thWheelCouplingMin: 100,
      frontAxleTo5thWheelCouplingMax: 150,
      dimensions: TESTING_UTILS.mockDimensions()
    } as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  // TODO: CVSB-10619 test for AXLE Dimension combination control;
});
