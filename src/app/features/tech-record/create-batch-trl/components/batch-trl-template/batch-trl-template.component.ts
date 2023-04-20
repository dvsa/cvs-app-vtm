import { Component, NgZone, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { map, Observable, take, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-batch-trl-template',
  templateUrl: './batch-trl-template.component.html'
})
export class BatchTrlTemplateComponent {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  isInvalid: boolean = false;
  batchForm?: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$;
  }

  get applicationId$() {
    return this.technicalRecordService.applicationId$;
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

  handleSubmit() {
    this.summary?.checkForms();

    if (!this.isInvalid) {
      this.technicalRecordService.editableVehicleTechRecord$
        .pipe(
          withLatestFrom(this.technicalRecordService.batchVehicles$),
          take(1),
          map(([record, batch]) =>
            batch.map(
              v =>
                ({
                  ...record!,
                  vin: v.vin,
                  vrms: v.trailerId ? [{ vrm: v.trailerId, isPrimary: true }] : null,
                  trailerId: v.trailerId ? v.trailerId : null,
                  systemNumber: v.systemNumber ? v.systemNumber : null
                } as VehicleTechRecordModel)
            )
          )
        )
        .subscribe(vehicleList => {
          vehicleList.forEach(vehicle => {
            if (!vehicle.systemNumber) {
              this.store.dispatch(createVehicleRecord({ vehicle }));
            } else {
              this.technicalRecordService.updateEditingTechRecord(vehicle);
              this.store.dispatch(
                updateTechRecords({
                  systemNumber: vehicle.systemNumber,
                  recordToArchiveStatus: StatusCodes.PROVISIONAL,
                  newStatus: StatusCodes.CURRENT
                })
              );
            }
          });
          this._ngZone.run(() => {
            this.router.navigate(['batch-results'], { relativeTo: this.route });
          });
        });
    }
  }
}
