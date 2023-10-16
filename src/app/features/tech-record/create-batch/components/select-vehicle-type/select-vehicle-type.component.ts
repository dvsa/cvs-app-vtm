import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord } from '@store/technical-records';
import { take } from 'rxjs';

@Component({
  selector: 'app-select-vehicle-type',
  templateUrl: './select-vehicle-type.component.html'
})
export class SelectVehicleTypeComponent {
  form: CustomFormGroup = new CustomFormGroup(
    { name: 'form-group', type: FormNodeTypes.GROUP },
    {
      vehicleType: new CustomFormControl({ name: 'vehicle-type', label: 'Vehicle type', type: FormNodeTypes.CONTROL }, '', [Validators.required]),
      tes1Tes2: new CustomFormControl({ name: 'tes1-tes2', label: 'Trailer form type', type: FormNodeTypes.CONTROL }, '', [
        CustomValidators.requiredIfEquals('vehicleType', [VehicleTypes.TRL])
      ])
    }
  );

  public vehicleTypeOptions: Array<FormNodeOption<string>> = [
    { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
    { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
    { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
  ];

  public tes1Tes2Options: Array<FormNodeOption<string>> = [
    { label: 'TES 1', value: TrailerFormType.TES1 },
    { label: 'TES 2', value: TrailerFormType.TES2 }
  ];

  constructor(
    private globalErrorService: GlobalErrorService,
    private batchTechRecordService: BatchTechnicalRecordService,
    private trs: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.batchTechRecordService.clearBatch();
    this.trs.clearSectionTemplateStates();
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    return this.form.valid;
  }

  cancel() {
    this.globalErrorService.clearErrors();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(type: VehicleTypes): void {
    if (!this.isFormValid) {
      return;
    }
    if (type === VehicleTypes.PSV) {
      this.batchTechRecordService.setVehicleStatus(StatusCodes.CURRENT);
    } else if (type === VehicleTypes.TRL && this.form.value.tes1Tes2 === TrailerFormType.TES2) {
      this.batchTechRecordService.setVehicleStatus(StatusCodes.PROVISIONAL);
    }

    this.batchTechRecordService.setVehicleType(type);

    this.store
      .select(selectTechRecord)
      .pipe(take(1))
      .subscribe(vehicle => !vehicle && this.trs.updateEditingTechRecord({ ...vehicle!, techRecord_vehicleType: type } as TechRecordType<'put'>));

    this.trs.generateEditingVehicleTechnicalRecordFromVehicleType(type);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.router.navigate([type], { relativeTo: this.route });
  }
}
