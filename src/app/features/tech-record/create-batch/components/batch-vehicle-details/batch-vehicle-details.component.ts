import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { combineLatest, filter, firstValueFrom, Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-batch-vehicle-details',
  templateUrl: './batch-vehicle-details.component.html',
  styleUrls: ['./batch-vehicle-details.component.scss']
})
export class BatchVehicleDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  techRecord?: TechRecordModel;
  readonly maxNumberOfVehicles = 40;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private globalErrorService: GlobalErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService,
    private batchTechRecordService: BatchTechnicalRecordService
  ) {
    this.form = this.fb.group({
      vehicles: this.fb.array([]),
      applicationId: new FormControl(null, [Validators.required])
    });

    this.technicalRecordService.editableVehicleTechRecord$
      .pipe(take(1))
      .subscribe(vehicle => (!vehicle ? this.back() : (this.techRecord = vehicle.techRecord[0])));

    combineLatest([this.batchTechRecordService.batchVehicles$, this.batchTechRecordService.applicationId$])
      .pipe(take(1))
      .subscribe(([vehicles, applicationId]) => {
        if (this.form && vehicles.length) {
          this.form.patchValue({ vehicles, applicationId });
        }
      });
  }
  ngOnInit(): void {
    this.addVehicles(this.maxNumberOfVehicles);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  get vehicles(): FormArray {
    return this.form.get('vehicles') as FormArray;
  }

  get generateNumber$(): Observable<boolean> {
    return this.batchTechRecordService.generateNumber$;
  }

  get filledVinsInForm() {
    return this.vehicles.value ?? [];
  }

  get width(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get vehicleForm(): FormGroup {
    return this.fb.group({
      vin: new CustomFormControl(
        { name: 'vin', type: FormNodeTypes.CONTROL },
        null,
        [CustomValidators.alphanumeric(), Validators.minLength(3), Validators.maxLength(21)],
        this.batchTechRecordService.validateForBatch()
      ),
      trailerId: new CustomFormControl({ name: 'trailerId', type: FormNodeTypes.CONTROL }, '', [
        CustomValidators.validateVRMTrailerIdLength('vehicleType'),
        CustomValidators.alphanumeric()
      ]),
      vehicleType: new CustomFormControl(
        {
          name: 'change-vehicle-type-select',
          label: 'Vehicle type',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.HIDDEN,
          editType: FormNodeEditTypes.HIDDEN
        },
        this.techRecord?.vehicleType
      ),
      systemNumber: [''],
      oldVehicleStatus: ['']
    });
  }

  validate(group: AbstractControl): void {
    group.get('vin')!.updateValueAndValidity();
  }

  getVinControl(group: AbstractControl): CustomFormControl | null {
    return group.get('vin') as CustomFormControl | null;
  }

  addVehicles(n: number): void {
    for (let i = 0; i < n; i++) {
      this.vehicles.push(this.vehicleForm);
    }
  }

  showErrors(): void {
    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors, false);
    this.globalErrorService.setErrors(errors);
  }

  back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async handleSubmit(): Promise<void> {
    const valid = await this.isFormValid();
    if (!valid) return;

    this.globalErrorService.setErrors([]);
    this.batchTechRecordService.setApplicationId(this.form.get('applicationId')?.value);
    this.batchTechRecordService.upsertVehicleBatch(this.cleanEmptyValues(this.vehicles.value));
    this.back();
  }

  private cleanEmptyValues(input: { vin: string; trailerId?: string }[]): { vin: string; trailerId?: string }[] {
    return input.filter(formInput => !!formInput.vin);
  }

  public checkDuplicateVins(input: { vin: string }[]) {
    const vinArray = input.map(item => item.vin);
    let duplicates: { vin: string; anchor: number }[] = [];
    vinArray.forEach((item, index) => {
      if (!!item && vinArray.indexOf(item) !== index) {
        duplicates.push({ vin: item, anchor: index });
      }
    });
    return duplicates;
  }

  async isFormValid(): Promise<boolean> {
    this.globalErrorService.clearErrors();
    this.form.markAllAsTouched();

    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors, true);
    await firstValueFrom(this.formStatus);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    if (this.cleanEmptyValues(this.vehicles.value).length == 0) {
      this.globalErrorService.addError({ error: 'At least 1 vehicle must be created or updated in a batch' });
      return false;
    }
    const duplicates = this.checkDuplicateVins(this.vehicles.value);
    if (duplicates.length > 0) {
      duplicates.forEach(element => {
        this.globalErrorService.addError({ error: `Remove duplicate VIN - ${element.vin}`, anchorLink: `input-vin${element.anchor.toString()}` });
      });
      return false;
    }
    return this.form.valid;
  }

  get formStatus(): Observable<FormControlStatus> {
    return this.form.statusChanges.pipe(filter(status => status !== 'PENDING'));
  }
}
