import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { RecordStatusEditComponent } from './record-status-edit.component';
import { TESTING_UTILS } from '@app/utils';
import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS, RECORD_COMPLETENESS, RECORD_COMPLETENESS_testable } from '@app/app.enums';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';

describe('RecordStatusEditComponent', () => {
  let component: RecordStatusEditComponent;
  let fixture: ComponentFixture<RecordStatusEditComponent>;
  let techRecHelper: TechRecordHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [RecordStatusEditComponent],
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
    fixture = TestBed.createComponent(RecordStatusEditComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      statusCode: RECORD_STATUS.PROVISIONAL,
      recordCompleteness: RECORD_COMPLETENESS_testable
    } as TechRecord;
  });

  it('should create with initialized form controls', () => {
    jest
      .spyOn(techRecHelper, 'getCompletenessInfoByKey')
      .mockReturnValue(RECORD_COMPLETENESS[RECORD_COMPLETENESS_testable]);

    fixture.detectChanges();

    expect(techRecHelper.getCompletenessInfoByKey).toHaveBeenCalledWith(
      RECORD_COMPLETENESS_testable
    );
    expect(fixture).toMatchSnapshot();
  });
});
