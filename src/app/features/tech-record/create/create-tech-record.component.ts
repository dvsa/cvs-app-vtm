import { Component, OnChanges } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
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

  vehicleForm = new FormGroup({
    vin: new CustomFormControl(
      {
        name: 'input-vin',
        label: 'Vin',
        type: FormNodeTypes.CONTROL
      },
      '',
      [Validators.minLength(3), Validators.maxLength(21), Validators.required]
    ),
    vrmTrm: new CustomFormControl({ name: 'input-vrm-or-trailer-id', label: 'VRM/TRM', type: FormNodeTypes.CONTROL }, '', [
      Validators.minLength(1),
      Validators.maxLength(9),
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
  });

  public vehicleTypeOptions: MultiOptions = [
    { label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
    { label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
    { label: 'Trailer (TRL)', value: VehicleTypes.TRL }
  ];

  public vehicleStatusOptions: MultiOptions = [{ label: 'Provisional', value: StatusCodes.PROVISIONAL }];

  constructor(
    private globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.isVinUniqueCheckComplete = false;
  }

  toggleVrmInput(checked: any) {
    const vrmTrm = this.vehicleForm.controls['vrmTrm'];
    checked.value ? this.generateID(vrmTrm) : this.vrmTrm(vrmTrm);
  }

  vrmTrm(vrmTrm: AbstractControl) {
    vrmTrm.addValidators(Validators.required);
    vrmTrm.setValue('');
    vrmTrm.enable();
  }

  generateID(vrmTrm: AbstractControl) {
    vrmTrm.removeValidators(Validators.required);
    vrmTrm.setValue(null);
    vrmTrm.disable();
  }

  get primaryVrm(): string {
    return this.vehicle.vrms?.find(vrm => vrm.isPrimary)?.vrm ?? '';
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.vehicleForm, errors);

    this.globalErrorService.setErrors(errors);

    return this.vehicleForm.valid;
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
    const isTrailer = this.vehicleForm.value.vehicleType === VehicleTypes.TRL;
    this.vehicle.techRecord = [
      { vehicleType: this.vehicleForm.value.vehicleType, statusCode: this.vehicleForm.value.vehicleStatus } as TechRecordModel
    ];

    if (!this.isVinUniqueCheckComplete) {
      this.vinUnique = await this.isVinUnique();
    }

    if (this.vehicleForm.controls['generateID'].value) {
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
    this.vehicle.vin = this.vehicleForm.value.vin;
    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.vin!, SEARCH_TYPES.VIN));
    this.isVinUniqueCheckComplete = true;
    return isVinUnique;
  }

  async isVrmUnique() {
    this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
    const isVrmUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.primaryVrm.replace(/\s+/g, ''), SEARCH_TYPES.VRM));
    if (!isVrmUnique) {
      this.globalErrorService.addError({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isVrmUnique;
  }

  async isTrailerIdUnique() {
    this.vehicle.trailerId = this.vehicleForm.value.vrmTrm;
    this.vehicle.vrms = [{ vrm: this.vehicleForm.value.vrmTrm, isPrimary: true }];
    const isTrailerIdUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle.trailerId!, SEARCH_TYPES.TRAILER_ID));
    if (!isTrailerIdUnique) {
      this.globalErrorService.addError({ error: 'TrailerId not unique', anchorLink: 'input-vrm-or-trailer-id' });
    }
    return isTrailerIdUnique;
  }
}
