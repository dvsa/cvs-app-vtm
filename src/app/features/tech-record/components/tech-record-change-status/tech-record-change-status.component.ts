import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { archiveTechRecord, archiveTechRecordSuccess, promoteTechRecord, promoteTechRecordSuccess } from '@store/technical-records';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tech-record-change-status',
  templateUrl: './tech-record-change-status.component.html'
})
export class TechRecordChangeStatusComponent implements OnInit, OnDestroy {
  techRecord: V3TechRecordModel | undefined;

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
      { name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
    this.isProvisional = this.router.url.includes('provisional');
  }

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      this.techRecord = record;
    });

    this.actions$.pipe(ofType(promoteTechRecordSuccess, archiveTechRecordSuccess), takeUntil(this.destroy$)).subscribe(newRecord => {
      this.router.navigate([`/tech-records/${newRecord.systemNumber}/${newRecord.createdTimestamp}`]);

      this.technicalRecordService.clearEditingTechRecord();
    });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => (this.isPromotion = params.get('to') === 'current'));
  }

  ngOnDestroy(): void {
    this.destroy$.next;
    this.destroy$.complete;
  }

  get label(): string {
    return `Reason for ${this.isPromotion ? 'promotion' : 'archiving'}`;
  }

  get buttonLabel(): string {
    return this.isPromotion ? 'Promote' : 'Archive';
  }

  navigateBack(relativePath: string = '..'): void {
    this.router.navigate([relativePath], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string }): void {
    if (!this.techRecord) {
      return;
    }

    this.form.valid
      ? this.errorService.clearErrors()
      : this.errorService.setErrors([
          { error: `Reason for ${this.isPromotion ? 'promotion' : 'archiving'} is required`, anchorLink: 'reasonForAmend' }
        ]);

    if (!this.form.valid || !form.reason) {
      return;
    }

    if (this.isPromotion) {
      this.store.dispatch(
        promoteTechRecord({
          systemNumber: this.techRecord.systemNumber,
          createdTimestamp: this.techRecord.createdTimestamp,
          reasonForPromoting: this.form.value.reason
        })
      );
    } else {
      this.store.dispatch(
        archiveTechRecord({
          systemNumber: this.techRecord.systemNumber,
          createdTimestamp: this.techRecord.createdTimestamp,
          reasonForArchiving: this.form.value.reason
        })
      );
    }
  }
}
