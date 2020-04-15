import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { of } from 'rxjs';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { WeightsEditComponent } from './weights-edit.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { TechRecord } from '@app/models/tech-record.model';

describe('WeightsEditComponent', () => {
  let component: WeightsEditComponent;
  let fixture: ComponentFixture<WeightsEditComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [WeightsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TechRecordHelperService,
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
    techRecHelper = TestBed.get(TechRecordHelperService);
    fixture = TestBed.createComponent(WeightsEditComponent);
    component = fixture.componentInstance;
    component.techRecord = TESTING_UTILS.mockTechRecord({
      grossGbWeight: 3,
      grossEecWeight: 3,
      grossDesignWeight: 2,
      trainGbWeight: 20,
      trainEecWeight: 10,
      trainDesignWeight: 15
    });
  });

  it('should create with initialized form weights controls', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render AXLE weights controls on initialization', () => {
    component.techRecord = TESTING_UTILS.mockTechRecord({
      axles: [TESTING_UTILS.mockAxle()]
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(component.axlesWeigths.length).toBe(1);
  });

  describe('handleFormChanges', () => {
    it('should render increased AXLE weights controls by the number of axles', () => {
      const noOfAxles = 4;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxles));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxles);
      expect(component.axlesWeigths.length).toBe(noOfAxles);
    });

    it('should render decreased AXLE weights controls by the number of axles', () => {
      component.techRecord = {
        noOfAxles: 3,
        axles: [
          TESTING_UTILS.mockAxle(),
          TESTING_UTILS.mockAxle({ axleNumber: 2 }),
          TESTING_UTILS.mockAxle({ axleNumber: 3 })
        ]
      } as TechRecord;

      const noOfAxlesToDecreaseBy = 2;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxlesToDecreaseBy));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxlesToDecreaseBy);
      expect(component.axlesWeigths.length).toBe(noOfAxlesToDecreaseBy);
    });
  });
});
