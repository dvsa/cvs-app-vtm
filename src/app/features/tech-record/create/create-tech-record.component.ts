import { Component, OnChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create-tech-record.component.html'
})
export class CreateTechRecordComponent implements OnChanges {
  vehicle: Partial<VehicleTechRecordModel> = {};

  isDuplicateVinAllowed: boolean = false;
  isVinUniqueCheckComplete: boolean = false;

  vinUnique: boolean = false;
  vrmUnique: boolean = false;
  trlUnique: boolean = false;

  form = new CustomFormGroup(
    { name: 'main-form', type: FormNodeTypes.GROUP },
    {
      vin: new CustomFormControl({ name: 'input-vin', label: 'Vin', type: FormNodeTypes.CONTROL }, '', [
        Validators.minLength(3),
        Validators.maxLength(21),
        Validators.required
      ]),
      vrmTrm: new CustomFormControl({ name: 'input-vrm-or-trailer-id', label: 'VRM/TRM', type: FormNodeTypes.CONTROL }, '', [
        CustomValidators.alphanumeric(),
        CustomValidators.notZNumber,
        Validators.maxLength(9),
        Validators.minLength(1),
        Validators.required
      ]),
      vehicleStatus: new CustomFormControl(
        { name: 'change-vehicle-status-select', label: 'Vehicle status', type: FormNodeTypes.CONTROL },
        StatusCodes.PROVISIONAL,
        [Validators.required]
      ),
      vehicleType: new CustomFormControl({ name: 'change-vehicle-type-select', label: 'Vehicle type', type: FormNodeTypes.CONTROL }, '', [
        Validators.required
      ]),
      generateID: new CustomFormControl({ name: 'generate-c-or-z-num', type: FormNodeTypes.CONTROL }, null)
    }
  );

  public vehicleTypeOptions: MultiOptions = [
    { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
    { label: 'Light goods vehicle (LGV)', value: VehicleTypes.LGV },
    { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
    { label: 'Trailer (TRL)', value: VehicleTypes.TRL },
    { label: 'Small Trailer (Small TRL)', value: VehicleTypes.SMALL_TRL },
    { label: 'Car', value: VehicleTypes.CAR },
    { label: 'Motorcycle', value: VehicleTypes.MOTORCYCLE }
  ];

  constructor(
    private globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.isVinUniqueCheckComplete = false;
  }

  get primaryVrm(): string {
    return this.vehicle.vrms?.find(vrm => vrm.isPrimary)?.vrm ?? '';
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.form, errors);

    this.globalErrorService.setErrors(errors);

    return this.form.valid;
  }

  get vehicleStatusOptions(): MultiOptions {
    return [{ label: 'Provisional', value: StatusCodes.PROVISIONAL }];
  }

  get checkboxOptions(): MultiOptions {
    return [{ value: true, label: 'Generate a C/T/Z number on submission of the new record' }];
  }

  toggleVrmInput(checked: any) {
    const vrmTrm = this.form.controls['vrmTrm'];

    if (checked.value) {
      vrmTrm.removeValidators(Validators.required);
      vrmTrm.setValue(null);
      vrmTrm.disable();
    } else {
      vrmTrm.addValidators(Validators.required);
      vrmTrm.setValue('');
      vrmTrm.enable();
    }
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async handleSubmit() {
    if (!this.isFormValid) {
      return;
    }

    if (!(await this.isFormValueUnique())) {
      this.isDuplicateVinAllowed = true;
      return;
    }

    this.technicalRecordService.updateEditingTechRecord(this.vehicle as VehicleTechRecordModel);
    this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(this.vehicle.techRecord![0].vehicleType);
    this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
  }

  async isFormValueUnique() {
    const isTrailer = this.form.value.vehicleType === VehicleTypes.TRL;
    this.vehicle.techRecord = [{ vehicleType: this.form.value.vehicleType, statusCode: this.form.value.vehicleStatus } as TechRecordModel];

    if (!this.isVinUniqueCheckComplete) {
      this.vinUnique = await this.isVinUnique();
    }

    if (this.form.controls['generateID'].value) {
      return this.vinUnique || this.isDuplicateVinAllowed;
    }

    if (isTrailer) {
      this.trlUnique = await this.isTrailerIdUnique();
      return (this.vinUnique || this.isDuplicateVinAllowed) && this.trlUnique;
    } else {
      this.vrmUnique = await this.isVrmUnique();
      return (this.vinUnique || this.isDuplicateVinAllowed) && this.vrmUnique;
    }
  }

  async isVinUnique(): Promise<boolean> {
    this.vehicle.vin = this.form.value.vin;
    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN));
    this.isVinUniqueCheckComplete = true;
    return isVinUnique;
  }

  async isVrmUnique() {
    this.vehicle.vrms = [{ vrm: this.form.value.vrmTrm, isPrimary: true }];
    const isVrmUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.primaryVrm.replace(/\s+/g, ''), SEARCH_TYPES.VRM));
    if (!isVrmUnique) {
      this.globalErrorService.addError({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isVrmUnique;
  }

  async isTrailerIdUnique() {
    this.vehicle.trailerId = this.form.value.vrmTrm;
    this.vehicle.vrms = [{ vrm: this.form.value.vrmTrm, isPrimary: true }];
    const isTrailerIdUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID));
    if (!isTrailerIdUnique) {
      this.globalErrorService.addError({ error: 'TrailerId not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isTrailerIdUnique;
  }
}
