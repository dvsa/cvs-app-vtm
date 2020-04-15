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
import { TechRecord, Tyres } from '@app/models/tech-record.model';
import { TyresEditComponent } from './tyres-edit.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';

describe('TyresEditComponent', () => {
  let component: TyresEditComponent;
  let fixture: ComponentFixture<TyresEditComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TyresEditComponent],
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
    fixture = TestBed.createComponent(TyresEditComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      tyreUseCode: '3'
    } as TechRecord;
  });

  it('should create with initialized form tyre controls', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form AXLE tyres controls on initialization', () => {
    component.techRecord = {
      tyreUseCode: 'usedTrye2488',
      axles: [
        TESTING_UTILS.mockAxle(),
        TESTING_UTILS.mockAxle({
          tyres: {
            tyreSize: '16',
            plyRating: '12S',
            fitmentCode: '12313',
            dataTrAxles: 1234
          } as Tyres
        })
      ]
    } as TechRecord;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(component.axlesTyres.length).toBe(2);
  });

  describe('handleFormChanges', () => {
    it('should render increased AXLE tyres controls by the number of axles', () => {
      const noOfAxles = 5;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxles));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxles);
      expect(component.axlesTyres.length).toBe(noOfAxles);
    });

    it('should render decreased AXLE tyres controls by the number of axles', () => {
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
      expect(component.axlesTyres.length).toBe(noOfAxlesToDecreaseBy);
    });
  });
});
