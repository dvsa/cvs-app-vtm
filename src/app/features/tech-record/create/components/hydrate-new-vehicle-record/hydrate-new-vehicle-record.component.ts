import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
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
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$.pipe(
      tap(vehicle => {
        if (!vehicle) this.navigateBack();
      })
    );
  }

  handleSubmit() {
    this.summary?.checkForms();

    if (!this.isInvalid) {
      this.technicalRecordService.editableVehicleTechRecord$
        .pipe(
          withLatestFrom(this.technicalRecordService.batchVehicles$),
          take(1),
          map(([record, batch]) => {
            const vehiclesToCreate = [record!];
            batch?.forEach(v => {
              const newVehicle = {
                ...record!,
                vin: v.vin,
                trailerId: v.trailerId ? v.trailerId : null
              } as VehicleTechRecordModel;

              vehiclesToCreate.push(newVehicle);
            });
            return vehiclesToCreate;
          })
        )
        .subscribe(vehicleList => {
          vehicleList.forEach(vehicle => {
            this.store.dispatch(createVehicleRecord({ vehicle }));
          });

          this.router.navigate(['batch-results'], { relativeTo: this.route });
        });
    }
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  addVehiclesToBatch() {
    this.router.navigate(['generate-batch-numbers'], { relativeTo: this.route });
  }

  get isBatch$() {
    return this.technicalRecordService.isBatchCreate$;
  }

  get batchCount$() {
    return this.technicalRecordService.batchCount$;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }
}
