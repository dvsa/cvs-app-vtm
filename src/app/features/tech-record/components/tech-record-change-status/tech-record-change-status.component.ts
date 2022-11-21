import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import {
  archiveTechRecord,
  archiveTechRecordSuccess,
  updateEditingTechRecord,
  updateTechRecords,
  updateTechRecordsSuccess
} from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Observable, take } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tech-record-change-status',
  templateUrl: './tech-record-change-status.component.html',
  styleUrls: ['./tech-record-change-status-component.scss']
})
export class TechRecordChangeStatusComponent implements OnInit {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  techRecord?: TechRecordModel;

  form: CustomFormGroup;

  buttonLabel: string;

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerStore: Store<RouterReducerState>,
    private techRecordsStore: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private location: Location
  ) {
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;

    this.technicalRecordService.techRecord$.subscribe(techRecord => (this.techRecord = techRecord));

    this.buttonLabel = this.isPromotion ? 'Promote' : 'Archive';

    this.form = new CustomFormGroup(
      { name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
  }

  ngOnInit(): void {
    this.actions$
      .pipe(ofType(updateTechRecordsSuccess, archiveTechRecordSuccess), take(1))
      .subscribe(() => this.router.navigate([this.isPromotion ? '../..' : '..'], { relativeTo: this.route }));
  }

  get isPromotion(): boolean {
    return this.router.url.split('/').pop() === 'promote';
  }

  get label(): string {
    return `Reason for ${this.isPromotion ? 'promotion' : 'archiving'}`;
  }

  goBack(): void {
    this.location.back();
  }

  handleSubmit(form: { reason: string }): void {
    let newTechRecord: TechRecordModel = cloneDeep(this.techRecord!);
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

    this.techRecordsStore.dispatch(updateEditingTechRecord({ techRecord: newTechRecord }));

    this.routerStore.pipe(select(selectRouteNestedParams), take(1)).subscribe(({ systemNumber }) => {
      const action = this.isPromotion
        ? updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
        : archiveTechRecord({ systemNumber, reasonForArchiving: form.reason });

      this.techRecordsStore.dispatch(action);
    });
  }
}
