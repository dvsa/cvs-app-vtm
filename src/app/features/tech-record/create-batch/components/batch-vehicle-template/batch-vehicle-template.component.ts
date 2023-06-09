import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { map, Observable, take, withLatestFrom } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-batch-vehicle-template',
  templateUrl: './batch-vehicle-template.component.html'
})
export class BatchVehicleTemplateComponent {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  isInvalid: boolean = false;
  form: CustomFormGroup;
  public vehicleStatusOptions: MultiOptions = [
    { label: 'Provisional', value: StatusCodes.PROVISIONAL },
    { label: 'Current', value: StatusCodes.CURRENT }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private batchTechRecordService: BatchTechnicalRecordService,
    private globalErrorService: GlobalErrorService
  ) {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) this.router.navigate(['..'], { relativeTo: this.route });
    });

    this.form = new CustomFormGroup(
      { name: 'form-group', type: FormNodeTypes.GROUP },
      {
        vehicleStatus: new CustomFormControl({ name: 'change-vehicle-status-select', label: 'Vehicle status', type: FormNodeTypes.CONTROL }, '', [
          Validators.required
        ])
      }
    );

    this.batchTechRecordService.vehicleStatus$.pipe(take(1)).subscribe(vehicleStatus => {
      if (this.form) {
        this.form.patchValue({ vehicleStatus });
      }
    });
  }

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$;
  }

  get applicationId$() {
    return this.batchTechRecordService.applicationId$;
  }

  get vehicleStatus$() {
    return this.batchTechRecordService.vehicleStatus$;
  }

  get isBatch$() {
    return this.batchTechRecordService.isBatchCreate$;
  }

  get batchCount$() {
    return this.batchTechRecordService.batchCount$;
  }

  getVehicleType(techRecord: TechRecordModel): VehicleTypes {
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord);
  }

  statusChange(): void {
    return this.batchTechRecordService.setVehicleStatus(this.form.get('vehicleStatus')?.value);
  }

  get isVehicleStatusValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    return this.form.valid;
  }

  handleSubmit() {
    this.summary?.checkForms();
    const check = this.isVehicleStatusValid;

    if (!this.isInvalid && check) {
      this.technicalRecordService.editableVehicleTechRecord$
        .pipe(
          withLatestFrom(this.batchTechRecordService.batchVehicles$),
          take(1),
          map(([record, batch]) =>
            batch.map(
              v =>
                ({
                  ...record!,
                  techRecord: [
                    { ...record?.techRecord[0], statusCode: this.form.value.vehicleStatus ?? StatusCodes.PROVISIONAL } as unknown as TechRecordModel
                  ],
                  vin: v.vin,
                  vrms: v.trailerId ? [{ vrm: v.trailerId, isPrimary: true }] : null,
                  trailerId: v.trailerId ? v.trailerId : null,
                  systemNumber: v.systemNumber ? v.systemNumber : null,
                  oldVehicleStatus: v.oldVehicleStatus ? v.oldVehicleStatus : null
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
                  recordToArchiveStatus: vehicle.oldVehicleStatus ?? StatusCodes.PROVISIONAL,
                  newStatus: vehicle.techRecord[0]?.statusCode ?? StatusCodes.CURRENT
                })
              );
            }
          });

          this.router.navigate(['batch-results'], { relativeTo: this.route });
        });
    } else {
      return;
    }
  }
}
