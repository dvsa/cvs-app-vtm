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
import { WeightsEditComponent } from './weights-edit.component';

describe('WeightsEditComponent', () => {
  let component: WeightsEditComponent;
  let fixture: ComponentFixture<WeightsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [WeightsEditComponent],
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
    fixture = TestBed.createComponent(WeightsEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form weights controls', () => {
    component.techRecord = TESTING_UTILS.mockTechRecord({
      grossGbWeight: 3,
      grossEecWeight: 3,
      grossDesignWeight: 2,
      trainGbWeight: 20,
      trainEecWeight: 10,
      trainDesignWeight: 15
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form AXLE weights controls', () => {
    component.techRecord = TESTING_UTILS.mockTechRecord({
      axles: [TESTING_UTILS.mockAxle()]
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
