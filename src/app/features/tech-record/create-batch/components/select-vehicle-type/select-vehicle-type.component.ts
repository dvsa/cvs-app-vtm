import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-select-vehicle-type',
  templateUrl: './select-vehicle-type.component.html'
})
export class SelectVehicleTypeComponent {
  form: CustomFormGroup = new CustomFormGroup(
    { name: 'form-group', type: FormNodeTypes.GROUP },
    {
      vehicleType: new CustomFormControl({ name: 'vehicle-type', label: 'Vehicle type', type: FormNodeTypes.CONTROL }, '', [Validators.required])
    }
  );

  public vehicleTypeOptions: MultiOptions = [
    { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
    { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
    { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
  ];

  constructor(
    private globalErrorService: GlobalErrorService,
    private batchTechRecordService: BatchTechnicalRecordService,
    private trs: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.batchTechRecordService.clearBatch();
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    return this.form.valid;
  }

  cancel() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(type: VehicleTypes): void {
    if (!this.isFormValid) {
      return;
    }

    this.trs.editableVehicleTechRecord$.pipe(take(1)).subscribe(
      vehicle =>
        !vehicle &&
        this.trs.updateEditingTechRecord({
          techRecord: [{ vehicleType: type, statusCode: StatusCodes.PROVISIONAL }]
        } as VehicleTechRecordModel)
    );

    this.trs.generateEditingVehicleTechnicalRecordFromVehicleType(type);
    this.router.navigate([type], { relativeTo: this.route });
  }
}
