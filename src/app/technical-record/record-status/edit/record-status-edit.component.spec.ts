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
import { RECORD_STATUS } from '@app/app.enums';

describe('RecordStatusEditComponent', () => {
  let component: RecordStatusEditComponent;
  let fixture: ComponentFixture<RecordStatusEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [RecordStatusEditComponent],
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
    fixture = TestBed.createComponent(RecordStatusEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form controls', () => {
    component.techRecord = {
      statusCode: RECORD_STATUS.PROVISIONAL
    } as TechRecord;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
