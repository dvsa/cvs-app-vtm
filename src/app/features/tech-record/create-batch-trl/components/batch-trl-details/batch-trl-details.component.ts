import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { combineLatest, Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-batch-trl-details',
  templateUrl: './batch-trl-details.component.html',
  styleUrls: ['./batch-trl-details.component.scss']
})
export class BatchTrlDetailsComponent implements OnDestroy {
  form: FormGroup;

  readonly maxNumberOfVehicles = 40;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private globalErrorService: GlobalErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.form = this.fb.group({ vehicles: this.fb.array([]), applicationId: new FormControl(null, [Validators.required]) });

    this.addVehicles(this.maxNumberOfVehicles);

    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) this.back();
    });

    combineLatest([this.technicalRecordService.batchVehicles$, this.technicalRecordService.applicationId$])
      .pipe(take(1))
      .subscribe(([vehicles, applicationId]) => {
        if (this.form && vehicles.length) {
          this.form.patchValue({ vehicles, applicationId });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicles(): FormArray {
    return this.form.get('vehicles') as FormArray;
  }

  get generateNumber$(): Observable<boolean> {
    return this.technicalRecordService.generateNumber$;
  }

  get filledVinsInForm() {
    return this.vehicles.value ?? [];
  }

  get width(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get vehicleForm(): FormGroup {
    return this.fb.group({
      vin: [null, [Validators.minLength(3), Validators.maxLength(21)], [this.technicalRecordService.validateVin()]],
      trailerId: ['', [Validators.minLength(7), Validators.maxLength(8), CustomValidators.alphanumeric()]]
    });
  }

  getVin(group: AbstractControl): AbstractControl | null {
    return group.get('vin');
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

  handleSubmit(): void {
    if (this.form.invalid) return this.showErrors();

    this.globalErrorService.setErrors([]);
    this.technicalRecordService.setApplicationId(this.form.get('applicationId')?.value);
    this.technicalRecordService.upsertVehicleBatch(this.cleanEmptyValues(this.vehicles.value));
    this.back();
  }

  private cleanEmptyValues(input: { vin: string; trailerId?: string }[]): { vin: string; trailerId?: string }[] {
    return input.filter(formInput => !!formInput.vin);
  }
}
