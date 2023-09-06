import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { archiveTechRecordSuccess, promoteTechRecordSuccess } from '@store/technical-records';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tech-record-unarchive',
  templateUrl: './tech-record-unarchive.component.html'
})
export class TechRecordUnarchiveComponent implements OnInit, OnDestroy {
  techRecord: TechRecordType<'get'> | undefined;

  statusCodes: Array<FormNodeOption<string>> = [
    { label: 'Provisional', value: StatusCodes.PROVISIONAL },
    { label: 'Current', value: StatusCodes.CURRENT }
  ];

  form: CustomFormGroup;

  isPromotion = false;
  isProvisional = false;

  destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.form = new CustomFormGroup(
      { name: 'unarchivalForm', type: FormNodeTypes.GROUP },
      {
        newRecordStatus: new CustomFormControl({ name: 'newRecordStatus', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]),
        reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required])
      }
    );

    this.isProvisional = this.router.url.includes('provisional');
  }

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      this.techRecord = record as TechRecordType<'get'>;
    });

    this.actions$.pipe(ofType(promoteTechRecordSuccess, archiveTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`]);

      this.technicalRecordService.clearEditingTechRecord();
    });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => (this.isPromotion = params.get('to') === 'current'));
  }

  ngOnDestroy(): void {
    this.destroy$.next;
    this.destroy$.complete;
  }

  navigateBack(relativePath: string = '..'): void {
    this.router.navigate([relativePath], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string, newRecordStatus: string }): void {
    if (!this.techRecord) {
      return;
    }

    this.form.valid
      ? this.errorService.clearErrors()
      : this.validateControls();

    if (!this.form.valid || !form.reason || !form.newRecordStatus) {
      return;
    }

    let body = {
      systemNumber: this.techRecord.systemNumber,
      createdTimestamp: this.techRecord.createdTimestamp,
      reason: this.form.value.reason,
      status: this.form.value.newRecordStatus
    }

    //TODO: Figure out what we're passing into the new end point

    // if (this.isPromotion) {
    //   this.store.dispatch(
    //     promoteTechRecord(body)
    //   );
    // } else {
    //   this.store.dispatch(
    //     promoteTechRecord(body)
    //   );
    // }
  }

  private validateControls() {
    const reasonControl = this.form.controls['reason'];
    const newRecordStatus = this.form.controls['newRecordStatus'];

    let errors = [];
    if(!reasonControl.valid){
      errors.push({ error: `Reason for unarchival is required`, anchorLink: 'reason' });
    }

    if(!newRecordStatus.valid){
      errors.push({ error: 'New Record Status is required', anchorLink: 'newRecordStatus' });
    }

    this.errorService.setErrors(errors);
  }
}
