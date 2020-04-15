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
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { of } from 'rxjs';

describe('DimensionsEditComponent', () => {
  let component: DimensionsEditComponent;
  let fixture: ComponentFixture<DimensionsEditComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [DimensionsEditComponent],
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
    fixture = TestBed.createComponent(DimensionsEditComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      frontAxleTo5thWheelMin: 456,
      frontAxleTo5thWheelMax: 660,
      frontAxleTo5thWheelCouplingMin: 100,
      frontAxleTo5thWheelCouplingMax: 150,
      dimensions: TESTING_UTILS.mockDimensions()
    } as TechRecord;
  });

  it('should create with initialized form dimensions controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render AXLE SPACING controls on initialization', () => {
    component.techRecord = TESTING_UTILS.mockTechRecord({
      dimensions: TESTING_UTILS.mockDimensions({
        axleSpacing: [
          TESTING_UTILS.mockAxleSpacing(),
          TESTING_UTILS.mockAxleSpacing({
            axles: '2-3',
            value: 800
          })
        ]
      })
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(component.axleSpacing.length).toBe(2);
  });

  describe('handleFormChanges', () => {
    it('should render increased AXLE SPACING controls by the number of axles', () => {
      const noOfAxles = 4;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxles));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxles);
      expect(component.axleSpacing.length).toBe(noOfAxles - 1);
    });

    it('should not render AXLE SPACING controls when number of axles selected is 1', () => {
      const noOfAxlesSelected = 1;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxlesSelected));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxlesSelected);
      expect(component.axleSpacing.length).toBe(0);
    });

    it('should remove all existing AXLE SPACING controls when number of axles selected is 1', () => {
      component.techRecord = TESTING_UTILS.mockTechRecord({
        dimensions: TESTING_UTILS.mockDimensions({
          axleSpacing: [
            TESTING_UTILS.mockAxleSpacing(),
            TESTING_UTILS.mockAxleSpacing({
              axles: '2-3',
              value: 800
            })
          ]
        })
      });

      const noOfAxlesSelected = 1;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxlesSelected));

      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      expect(numReceived).toBe(noOfAxlesSelected);
      expect(component.axleSpacing.length).toBe(0);
    });

    it('should render decreased AXLE SPACING controls by the number of axles', () => {
      // Arrange - previous number of axles would have been 4
      component.techRecord = TESTING_UTILS.mockTechRecord({
        dimensions: TESTING_UTILS.mockDimensions({
          axleSpacing: [
            TESTING_UTILS.mockAxleSpacing(),
            TESTING_UTILS.mockAxleSpacing({
              axles: '2-3',
              value: 800
            }),
            TESTING_UTILS.mockAxleSpacing({
              axles: '3-4',
              value: 500
            })
          ]
        })
      });

      const noOfAxlesSelected = 3;
      spyOn(techRecHelper, 'getNumberOfAxles').and.returnValue(of(noOfAxlesSelected));

      // Act
      fixture.detectChanges();

      let numReceived: number;
      component.numberOfAxles$.subscribe((value) => (numReceived = value));

      // Assert
      expect(numReceived).toBe(noOfAxlesSelected);
      expect(component.axleSpacing.length).toBe(2);
    });
  });
});
