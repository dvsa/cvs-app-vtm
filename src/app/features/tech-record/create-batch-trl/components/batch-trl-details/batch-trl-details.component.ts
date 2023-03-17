import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { combineLatest, debounceTime, Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-batch-trl-details',
  templateUrl: './batch-trl-details.component.html',
  styleUrls: ['./batch-trl-details.component.scss']
})
export class BatchTrlDetailsComponent implements OnInit, OnDestroy {
  readonly maxNumberOfVehicles = 40;
  private destroy$ = new Subject<void>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private globalErrorService: GlobalErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.form = this.fb.group({
      vehicles: this.fb.array([]),
      applicationId: new FormControl(null, [Validators.required])
    });
  }

  private startingObject = { vin: '' };

  ngOnInit() {
    this.addVehicles(this.maxNumberOfVehicles);

    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) {
        this.back();
      }
    });

    combineLatest([this.technicalRecordService.batchVehicles$, this.technicalRecordService.applicationId$])
      .pipe(take(1))
      .subscribe({
        next: ([vehicles, applicationId]) => {
          if (this.form && vehicles.length) {
            this.form.patchValue({ vehicles, applicationId });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  watchNumberOfVehicles() {
    this.form
      .get('numberOfVehicles')
      ?.valueChanges.pipe(withLatestFrom(this.technicalRecordService.generateNumber$.pipe(take(1))), takeUntil(this.destroy$), debounceTime(500))
      .subscribe({
        next: ([val, generateNumber]) => {
          const n = Math.min(val, this.maxNumberOfVehicles);
          if (isNaN(n) || n > this.maxNumberOfVehicles) {
            return;
          }

          const currentList = this.vehicles.controls.length;

          if (currentList > val) {
            this.vehicles.controls.length = n;
          } else {
            this.addVehicles(n - currentList);
          }
        }
      });
  }

  addVehicles(n: number) {
    for (let i = 0; i < n; i++) {
      this.vehicles.push(this.vehicleForm());
    }
  }

  removeAt(i: number) {
    this.vehicles.removeAt(i);
  }

  vehicleForm() {
    return this.fb.group({
      vin: [null, [Validators.minLength(3), Validators.maxLength(21)], [this.technicalRecordService.validateVin()]],
      trailerId: ['', [Validators.minLength(7), Validators.maxLength(8), CustomValidators.alphanumeric()]]
    });
  }

  getNumberOfFields(qty: number) {
    return Array.from(Array(qty));
  }

  get vehicles() {
    return this.form.get('vehicles') as FormArray;
  }

  get generateNumber$() {
    return this.technicalRecordService.generateNumber$;
  }

  getVin(group: AbstractControl) {
    return group.get('vin');
  }

  get filledVinsInForm(): typeof this.startingObject[] {
    return this.vehicles.value ?? [];
  }

  showErrors(): void {
    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors, false);
    this.globalErrorService.setErrors(errors);
  }

  private cleanEmptyValues(input: { vin: string; trailerId?: string }[]): { vin: string; trailerId?: string }[] {
    return input.filter(formInput => !!formInput.vin);
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.showErrors();
      return;
    }

    this.globalErrorService.setErrors([]);
    this.technicalRecordService.setApplicationId(this.form.get('applicationId')?.value);
    this.technicalRecordService.upsertVehicleBatch(this.cleanEmptyValues(this.vehicles.value));
    this.back();
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  get width() {
    return FormNodeWidth;
  }
}
