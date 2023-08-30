import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { BatchUpdateVehicleModel, StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord, selectTechRecord, updateTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, map, take, withLatestFrom } from 'rxjs';
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
    this.store
      .select(selectTechRecord)
      .pipe(take(1))
      .subscribe(vehicle => {
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

  get vehicle$(): Observable<V3TechRecordModel | undefined> {
    return this.store.select(selectTechRecord);
  }

  get applicationId$() {
    return this.batchTechRecordService.applicationId$;
  }

  get isBatch$() {
    return this.batchTechRecordService.isBatchCreate$;
  }

  get batchCount$() {
    return this.batchTechRecordService.batchCount$;
  }

  get vehicleType$() {
    return this.batchTechRecordService.vehicleType$;
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
      this.store
        .select(selectTechRecord)
        .pipe(
          withLatestFrom(this.batchTechRecordService.batchVehicles$),
          take(1),
          map(([record, batch]) =>
            batch.map(
              (v): BatchUpdateVehicleModel =>
                ({
                  ...record,
                  techRecord_statusCode: this.form.value.vehicleStatus ?? StatusCodes.PROVISIONAL,
                  vin: v.vin,
                  trailerId: v.vehicleType === VehicleTypes.TRL ? v.trailerIdOrVrm : undefined,
                  primaryVrm: v.vehicleType !== VehicleTypes.TRL ? v.trailerIdOrVrm : undefined,
                  systemNumber: v.systemNumber,
                  createdTimestamp: v.createdTimestamp
                } as BatchUpdateVehicleModel)
            )
          )
        )
        .subscribe(vehicleList => {
          vehicleList.forEach(vehicle => {
            if (!(vehicle as TechRecordType<'get'>).systemNumber) {
              this.store.dispatch(createVehicleRecord({ vehicle: vehicle as unknown as TechRecordType<'put'> }));
            } else {
              this.store.dispatch(updateTechRecord({ vehicleTechRecord: vehicle as unknown as TechRecordType<'put'> }));
            }
          });
          this.technicalRecordService.clearSectionTemplateStates();
          this.router.navigate(['batch-results'], { relativeTo: this.route });
        });
    } else {
      return;
    }
  }
}
