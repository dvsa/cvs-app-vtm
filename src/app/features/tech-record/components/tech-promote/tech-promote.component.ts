import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { updateEditingTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-tech-promote',
  templateUrl: './tech-promote.component.html'
})
export class TechPromoteComponent {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  techRecord?: TechRecordModel;

  form: CustomFormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routerStore: Store<RouterReducerState>,
    private techRecordsStore: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$.pipe(
      tap(
        vehicleTechRecord =>
          (this.techRecord = cloneDeep(vehicleTechRecord?.techRecord.find(record => record.statusCode === StatusCodes.PROVISIONAL))!)
      )
    );

    this.form = new CustomFormGroup(
      { name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined) }
    );
  }

  handleSubmit(form: { reason: string }): void {
    if (!this.techRecord) {
      return;
    }

    this.techRecord.reasonForCreation = form.reason;

    this.techRecordsStore.dispatch(updateEditingTechRecord({ techRecord: this.techRecord }));

    this.routerStore.pipe(select(selectRouteNestedParams), take(1)).subscribe(({ systemNumber }) => {
      this.techRecordsStore.dispatch(
        updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );

      this.router.navigate([`../..`], { relativeTo: this.route });
    });
  }
}
