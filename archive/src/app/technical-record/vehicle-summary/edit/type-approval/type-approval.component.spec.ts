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
import { TypeApprovalComponent } from './type-approval.component';
import { TechRecord } from '@app/models/tech-record.model';

const mockTechRecord = {
  approvalType: 'NTA',
  approvalTypeNumber: 'approNum',
  variantNumber: 'varNum',
  variantVersionNumber: 'varVerNum'
} as TechRecord;

describe('TypeApprovalComponent', () => {
  let component: TypeApprovalComponent;
  let fixture: ComponentFixture<TypeApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TypeApprovalComponent],
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
    fixture = TestBed.createComponent(TypeApprovalComponent);
    component = fixture.componentInstance;
    component.techRecord = mockTechRecord;
  });

  it('should create with empty control states', () => {
    component.techRecord = {} as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(component.techRecordFg.get('approvalType').value).toEqual(null);
    expect(component.techRecordFg.get('approvalTypeNumber').value).toEqual(null);
    expect(component.techRecordFg.get('variantNumber').value).toEqual(null);
    expect(component.techRecordFg.get('variantVersionNumber').value).toEqual(null);

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component.techRecordFg.get('approvalType').value).toEqual(mockTechRecord.approvalType);
    expect(component.techRecordFg.get('approvalTypeNumber').value).toEqual(
      mockTechRecord.approvalTypeNumber
    );
    expect(component.techRecordFg.get('variantNumber').value).toEqual(
      mockTechRecord.variantNumber
    );
    expect(component.techRecordFg.get('variantVersionNumber').value).toEqual(
      mockTechRecord.variantVersionNumber
    );
  });
});
