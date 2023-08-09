import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { createVehicleRecord, createVehicleRecordSuccess, selectTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { map, Observable, Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';
import { Actions, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { BatchRecord } from '@store/technical-records/reducers/batch-create.reducer';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html'
})
export class HydrateNewVehicleRecordComponent implements OnDestroy {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  isInvalid: boolean = false;
  batchForm?: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private batchTechRecordService: BatchTechnicalRecordService
  ) {
    this.actions$
      .pipe(ofType(createVehicleRecordSuccess), takeUntil(this.destroy$))
      .subscribe(({ vehicleTechRecord }) =>
        this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`])
      );

    this.store
      .select(selectTechRecord)
      .pipe(take(1))
      .subscribe(vehicle => {
        if (!vehicle) this.router.navigate(['..'], { relativeTo: this.route });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicle$(): Observable<V3TechRecordModel | undefined> {
    return this.store.select(selectTechRecord);
  }

  get isBatch$(): Observable<boolean> {
    return this.batchTechRecordService.isBatchCreate$;
  }

  get batchCount$(): Observable<number> {
    return this.batchTechRecordService.batchCount$;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  navigate(systemNumber?: string, createdTimestamp?: string): void {
    this.globalErrorService.clearErrors();

    if (systemNumber && createdTimestamp) {
      this.router.navigate([`/tech-records/${systemNumber}/${createdTimestamp}`]);
    } else {
      this.router.navigate(['batch-results'], { relativeTo: this.route });
    }
  }

  handleSubmit(): void {
    this.summary?.checkForms();

    if (this.isInvalid) return;

    this.store
      .select(selectTechRecord)
      .pipe(
        withLatestFrom(this.batchTechRecordService.batchVehicles$),
        take(1),
        map(([record, batch]) =>
          (record ? [record as BatchRecord] : []).concat(
            batch.map(
              v =>
                ({
                  ...(record! as BatchRecord),
                  vin: v.vin,
                  vrms: v.vehicleType !== VehicleTypes.TRL && v.trailerIdOrVrm ? [{ vrm: v.trailerIdOrVrm, isPrimary: true }] : null,
                  trailerId: v.vehicleType === VehicleTypes.TRL && v.trailerIdOrVrm ? v.trailerIdOrVrm : null
                } as VehicleTechRecordModel)
            )
          )
        ),
        withLatestFrom(this.isBatch$)
      )
      .subscribe(([vehicleList, isBatch]) => {
        vehicleList.forEach(vehicle => this.store.dispatch(createVehicleRecord({ vehicle: vehicle as V3TechRecordModel })));
        this.technicalRecordService.clearSectionTemplateStates();
        if (isBatch) this.navigate();
      });
  }
}
