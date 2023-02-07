import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { archiveTechRecord, archiveTechRecordSuccess, updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-change-status',
  templateUrl: './tech-record-change-status.component.html',
  styleUrls: ['./tech-record-change-status.component.scss']
})
export class TechRecordChangeStatusComponent implements OnInit {
  vehicle$: Observable<VehicleTechRecordModel | undefined>;

  techRecord?: TechRecordModel;

  form: CustomFormGroup;

  isPromotion = false;

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.vehicle$ = this.technicalRecordService.selectedVehicleTechRecord$;

    this.technicalRecordService.techRecord$.subscribe(techRecord => (this.techRecord = techRecord));

    this.form = new CustomFormGroup(
      { name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => (this.isPromotion = params.get('to') === 'current'));

    this.actions$.pipe(ofType(updateTechRecordsSuccess, archiveTechRecordSuccess), take(1)).subscribe(() => this.goBack(true));
  }

  get label(): string {
    return `Reason for ${this.isPromotion ? 'promotion' : 'archiving'}`;
  }

  get buttonLabel(): string {
    return this.isPromotion ? 'Promote' : 'Archive';
  }

  goBack(isAfterSubmission: boolean = false): void {
    this.router.navigate([isAfterSubmission && this.isPromotion ? '../..' : '..'], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string }): void {
    const newTechRecord: TechRecordModel = cloneDeep(this.techRecord!);
    if (!this.techRecord) {
      return;
    }

    if (this.isPromotion) {
      newTechRecord.reasonForCreation = form.reason;
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
