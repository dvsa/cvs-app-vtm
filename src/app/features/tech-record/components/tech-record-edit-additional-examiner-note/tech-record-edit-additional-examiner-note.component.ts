import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { CustomFormControl, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tech-record-edit-additional-examiner-note',
  templateUrl: './tech-record-edit-additional-examiner-note.component.html',
  styleUrls: ['./tech-record-edit-additional-examiner-note.component.scss'],
})
export class TechRecordEditAdditionalExaminerNoteComponent implements OnInit {
  currentTechRecord!: TechRecordType<'hgv' | 'trl' | 'lgv'>;
  examinerNote!: AdditionalExaminerNotes;
  examinerNoteIndex!: number;
  destroy$ = new ReplaySubject<boolean>(1);
  form!: FormGroup;
  formControl!: CustomFormControl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService,
    private globalErrorService: GlobalErrorService,
  ) { }

  ngOnInit() {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
      this.currentTechRecord = currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
    });

    this.route.params.pipe(take(1)).subscribe((params) => {
      this.examinerNoteIndex = params['examinerNoteIndex'];
    });
    const additionalExaminerNotes = this.currentTechRecord?.techRecord_adrDetails_additionalExaminerNotes;
    if (additionalExaminerNotes) {
      this.examinerNote = additionalExaminerNotes[this.examinerNoteIndex];
      console.log(this.examinerNote);
    }
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
    if (!this.isFormValid()) {
      return;
    }
    console.log('should dispatch amendAdditionalExaminerNote action');
    // this.store.dispatch(
    //   amendAdditionalExaminerNote({})
    // );
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    // check for errors in form

    if (errors?.length > 0) {
      this.globalErrorService.setErrors(errors);
      return false;
    }
    return true;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get width(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

}
