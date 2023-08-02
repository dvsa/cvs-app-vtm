import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { archiveTechRecord, archiveTechRecordSuccess, selectTechRecord, updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { Observable, Subject, Subscription, take, takeUntil } from 'rxjs';

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
    this.store
      .select(selectTechRecord)
      .pipe(takeUntil(this.destroy$))
      .subscribe(record => {
        this.techRecord = record;
      });

    this.route.queryParamMap.subscribe(params => (this.isPromotion = params.get('to') === 'current'));

    this.actions$.pipe(ofType(updateTechRecordsSuccess, archiveTechRecordSuccess), take(1)).subscribe(() => {
      const relativePath = this.isProvisional ? '../..' : '..';
      this.navigateBack(relativePath);

      this.technicalRecordService.clearEditingTechRecord();
    });
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
    const newTechRecord: V3TechRecordModel = cloneDeep(this.techRecord!);
    if (!this.techRecord) {
      return;
    }

    if (this.isPromotion) {
      newTechRecord.techRecord_reasonForCreation = form.reason;
    }

    this.form.valid
      ? this.errorService.clearErrors()
      : this.errorService.setErrors([
          { error: `Reason for ${this.isPromotion ? 'promotion' : 'archiving'} is required`, anchorLink: 'reasonForAmend' }
        ]);

    if (!this.form.valid || !form.reason) {
      return;
    }

    this.technicalRecordService.updateEditingTechRecord(newTechRecord);

    this.store.pipe(select(selectRouteNestedParams), take(1)).subscribe(({ systemNumber }) => {
      const action = this.isPromotion
        ? updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
        : archiveTechRecord({ systemNumber, reasonForArchiving: form.reason });

      this.store.dispatch(action);
    });
  }
}
