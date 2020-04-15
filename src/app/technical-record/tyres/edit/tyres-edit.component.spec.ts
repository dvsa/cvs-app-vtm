import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl,
  FormArray,
  FormControl
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';
import { TyresEditComponent } from './tyres-edit.component';

describe('TyresEditComponent', () => {
  let component: TyresEditComponent;
  let fixture: ComponentFixture<TyresEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TyresEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
              axles: new FormArray([
                new FormGroup({
                  axleNumber: new FormControl(1)
                })
              ])
            }) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form tyre controls', () => {
    component.techRecord = {
      tyreUseCode: '3'
    } as TechRecord;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  // TODO: CVSB-10619 test for AXLE Tyres control
  // it('should create with initialized form AXLE tyres controls', () => {
  //   component.techRecord = {
  //     tyreUseCode: 'usedTrye2488',
  //     axles: [TESTING_UTILS.mockAxle()]
  //   } as TechRecord;

  //   fixture.detectChanges();

  //   expect(fixture).toMatchSnapshot();
  // });
});
