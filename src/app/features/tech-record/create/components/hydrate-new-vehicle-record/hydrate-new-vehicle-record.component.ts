import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { createVehicleRecord, createVehicleRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { map, Observable, Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';
import { Actions, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';

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
      .subscribe(({ vehicleTechRecords }) => this.navigate(vehicleTechRecords[0].systemNumber));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$;
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

  navigate(systemNumber?: string): void {
    this.globalErrorService.clearErrors();

    if (systemNumber) {
      this.router.navigate(['/tech-records', systemNumber]);
    } else {
      this.router.navigate(['batch-results'], { relativeTo: this.route });
    }
  }

  handleSubmit(): void {
    this.summary?.checkForms();

    if (this.isInvalid) return;

    this.technicalRecordService.editableVehicleTechRecord$
      .pipe(
        withLatestFrom(this.batchTechRecordService.batchVehicles$),
        take(1),
        map(([record, batch]) =>
          (record ? [record] : []).concat(
            batch.map(
              v =>
                ({
                  ...record!,
                  vin: v.vin,
                  vrms: v.trailerId ? [{ vrm: v.trailerId, isPrimary: true }] : null,
                  trailerId: v.trailerId ?? null
                } as VehicleTechRecordModel)
            )
          )
        ),
        withLatestFrom(this.isBatch$)
      )
      .subscribe(([vehicleList, isBatch]) => {
        vehicleList.forEach(vehicle => this.store.dispatch(createVehicleRecord({ vehicle })));

        if (isBatch) this.navigate();
      });
  }
}
