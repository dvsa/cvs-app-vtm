import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { debounceTime, Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-batch-create',
  templateUrl: './batch-create.component.html'
})
export class BatchCreateComponent implements OnInit, OnDestroy {
  readonly maxNumberOfvehicles = 39;
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
      numberOfVehicles: [0, [Validators.max(39)]],
      vehicles: this.fb.array([])
    });
  }

  private startingObject = { vin: '' };

  ngOnInit() {
    // this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
    //   if (!vehicle) this.back();
    // });

    this.technicalRecordService.batchVehicles$.pipe(take(1)).subscribe({
      next: vehicles => {
        if (vehicles && vehicles.length) {
          this.addVehicles(vehicles.length);
          this.form.setValue({ numberOfVehicles: vehicles.length, vehicles });
        }
      }
    });

    this.watchNumberOfVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  watchNumberOfVehicles() {
    this.form
      .get('numberOfVehicles')
      ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe({
        next: val => {
          const n = Math.min(val, this.maxNumberOfvehicles);
          if (isNaN(n) || n > this.maxNumberOfvehicles) {
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
      this.vehicles.push(this.vehicleForm);
    }
  }

  removeAt(i: number) {
    this.vehicles.removeAt(i);
  }

  get vehicleForm() {
    return this.fb.group({
      vin: ['', [Validators.required]]
    });
  }

  getNumberOfFields(qty: number) {
    return Array.from(Array(qty));
  }

  get vehicles() {
    return this.form.get('vehicles') as FormArray;
  }

  get filledVinsInForm(): typeof this.startingObject[] {
    return this.vehicles.value ?? [];
  }

  get isFormValid(): boolean {
    const errors: GlobalError[] = [];
    DynamicFormService.updateValidity(this.form, errors);
    this.globalErrorService.setErrors(errors);
    return this.form.valid;
  }

  private cleanEmptyValues<T extends Record<string, any>>(input: T[]): T[] {
    return input.filter(formInput => Object.values(formInput).some(value => !!value));
  }

  handleSubmit() {
    if (!this.isFormValid) {
      return;
    }

    console.log(this.cleanEmptyValues(this.filledVinsInForm));
    this.technicalRecordService.upsertVehicleBatch(this.vehicles.value);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  get width() {
    return FormNodeWidth;
  }
}
