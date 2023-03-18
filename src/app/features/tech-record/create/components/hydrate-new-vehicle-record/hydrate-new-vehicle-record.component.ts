import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { map, Observable, take, tap, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html'
})
export class HydrateNewVehicleRecordComponent {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  isInvalid: boolean = false;
  batchForm?: FormGroup;

  constructor(
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$.pipe(
      tap(vehicle => {
        if (!vehicle) this.navigateTo();
      })
    );
  }

  get isBatch$(): Observable<boolean> {
    return this.technicalRecordService.isBatchCreate$;
  }

  get batchCount$(): Observable<number> {
    return this.technicalRecordService.batchCount$;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  navigateTo(route: string = '..'): void {
    this.globalErrorService.clearErrors();
    this.router.navigate([route], { relativeTo: this.route });
  }

  handleSubmit(): void {
    this.summary?.checkForms();

    if (this.isInvalid) return;

    this.technicalRecordService.editableVehicleTechRecord$
      .pipe(
        withLatestFrom(this.technicalRecordService.batchVehicles$),
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
        )
      )
      .subscribe(vehicleList => {
        vehicleList.forEach(vehicle => this.store.dispatch(createVehicleRecord({ vehicle })));

        this.navigateTo('batch-results');
      });
  }
}
