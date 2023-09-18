import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { selectTechRecordHistory, unarchiveTechRecord, unarchiveTechRecordSuccess } from '@store/technical-records';
import { Subject, map, takeUntil } from 'rxjs';
import { getBySystemNumber } from '@store/technical-records';

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
  hasNonArchivedRecords: boolean | undefined;

  form: CustomFormGroup;

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
  }

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      this.techRecord = record as TechRecordType<'get'>;
      this.store.dispatch(getBySystemNumber({ systemNumber: this.techRecord?.systemNumber as string }));
    });

    this.actions$.pipe(ofType(unarchiveTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`]);

      this.technicalRecordService.clearEditingTechRecord();
    });

    this.techRecordHistory$.pipe(map(records => records?.some((techRecordHistory) => {
      return techRecordHistory.techRecord_statusCode !== StatusCodes.ARCHIVED &&
        this.techRecord?.techRecord_vehicleType !== 'trl' &&
        techRecordHistory.primaryVrm === this.techRecord?.primaryVrm;
      })),
      takeUntil(this.destroy$))
      .subscribe(value => this.hasNonArchivedRecords = value);
  }

  ngOnDestroy(): void {
    this.destroy$.next;
    this.destroy$.complete;
  }

  get techRecordHistory$() {
    return this.store.select(selectTechRecordHistory);
  }

  navigateBack(relativePath: string = '..'): void {
    this.router.navigate([relativePath], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string, newRecordStatus: string }): void {
    if (!this.techRecord) {
      return;
    }

    if(this.hasNonArchivedRecords){
      this.errorService.setErrors([{ error: 'Cannot unarchive a record with Provisional or Current records' }]);
      return;
    }

    this.form.valid
      ? this.errorService.clearErrors()
      : this.validateControls();

    if (!this.form.valid || !form.reason || !form.newRecordStatus) {
      return;
    }

    this.store.dispatch(
      unarchiveTechRecord({
        systemNumber: this.techRecord.systemNumber,
        createdTimestamp: this.techRecord.createdTimestamp,
        reasonForUnarchiving: this.form.value.reason,
        status: this.form.value.newRecordStatus
      })
    );
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