import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import {
  CustomFormControl,
  FormNodeEditTypes,
  FormNodeTypes,
  FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { updateExistingADRAdditionalExaminerNote } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { isEqual } from 'lodash';

@Component({
  selector: 'tech-record-edit-additional-examiner-note',
  templateUrl: './tech-record-edit-additional-examiner-note.component.html',
  styleUrls: ['./tech-record-edit-additional-examiner-note.component.scss'],
})
export class TechRecordEditAdditionalExaminerNoteComponent implements OnInit {
  currentTechRecord!: TechRecordType<'hgv' | 'trl' | 'lgv'>;
  examinerNote!: AdditionalExaminerNotes;
  examinerNoteOriginal!: AdditionalExaminerNotes;
  examinerNoteIndex!: number;
  editedExaminerNote?: string | null;
  destroy$ = new ReplaySubject<boolean>(1);
  form!: FormGroup;
  formControl!: CustomFormControl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService,
    private globalErrorService: GlobalErrorService,
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
      this.currentTechRecord = currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
    });
    this.getExaminerNote();
    this.setupForm();
  }

  getExaminerNote() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.examinerNoteIndex = params['examinerNoteIndex'];
    });
    const additionalExaminerNotes = this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes;
    if (additionalExaminerNotes) {
      this.examinerNote = additionalExaminerNotes[this.examinerNoteIndex];
      this.examinerNoteOriginal = cloneDeep(this.examinerNote);
    }
    this.editedExaminerNote = this.examinerNote.note;
  }

  setupForm() {
    this.formControl = new CustomFormControl({
      name: 'additionalExaminerNote', type: FormNodeTypes.CONTROL,
    }, '', [Validators.required]);
    this.form = new FormGroup({
      additionalExaminerNote: this.formControl,
    });
    this.formControl.patchValue(this.examinerNote.note);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    void this.router.navigate(['../../'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    if (!isEqual(this.examinerNote, this.examinerNoteOriginal)) {
      this.store.dispatch(
        updateExistingADRAdditionalExaminerNote({
          examinerNoteIndex: this.examinerNoteIndex,
          additionalExaminerNote: this.examinerNote,
        }),
      );
    }
    this.navigateBack();
  }

  ngOnChanges(examinerNote: string) {
    this.editedExaminerNote = examinerNote;
    this.examinerNote.note = examinerNote;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get width(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

}
