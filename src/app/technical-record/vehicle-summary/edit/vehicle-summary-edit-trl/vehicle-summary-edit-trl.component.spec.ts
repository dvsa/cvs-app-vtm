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
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleSummaryEditTrlComponent } from './vehicle-summary-edit-trl.component';

const mockTechRecord = {
  firstUseDate: '2019-12-23',
  suspensionType: 'S',
  couplingType: 'C',
  maxLoadOnCoupling: 23,
  frameDescription: 'Box section'
} as TechRecord;

describe('VehicleSummaryEditHgvComponent', () => {
  let component: VehicleSummaryEditTrlComponent;
  let fixture: ComponentFixture<VehicleSummaryEditTrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [VehicleSummaryEditTrlComponent],
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
    fixture = TestBed.createComponent(VehicleSummaryEditTrlComponent);
    component = fixture.componentInstance;
  });

  it('should create with empty control states', () => {
    component.techRecord = {} as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(component.techRecordFg.get('firstUseDate').value).toEqual(null);
    expect(component.techRecordFg.get('suspensionType').value).toEqual(null);
    expect(component.techRecordFg.get('couplingType').value).toEqual(null);
    expect(component.techRecordFg.get('maxLoadOnCoupling').value).toEqual(null);
    expect(component.techRecordFg.get('frameDescription').value).toEqual(null);

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form controls', () => {
    component.techRecord = mockTechRecord;
    fixture.detectChanges();

    expect(component.techRecordFg.get('firstUseDate').value).toEqual(mockTechRecord.firstUseDate);
    expect(component.techRecordFg.get('couplingType').value).toEqual(mockTechRecord.couplingType);
    expect(component.techRecordFg.get('maxLoadOnCoupling').value).toEqual(
      mockTechRecord.maxLoadOnCoupling
    );
    expect(component.techRecordFg.get('frameDescription').value).toEqual(
      mockTechRecord.frameDescription
    );
  });
});
