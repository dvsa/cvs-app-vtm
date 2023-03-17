import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { combineLatest, debounceTime, forkJoin, Subject, take, takeUntil, withLatestFrom } from 'rxjs';
@Component({
  selector: 'app-batch-create',
  templateUrl: './batch-create.component.html'
})
export class BatchCreateComponent implements OnInit, OnDestroy {
  readonly maxNumberOfVehicles = 39;
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
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) {
        this.back();
      }
    });

    combineLatest([this.technicalRecordService.batchVehicles$, this.technicalRecordService.batchCount$, this.technicalRecordService.batchId$])
      .pipe(take(1))
      .subscribe({
        next: ([vehicles, numberOfVehicles, batchId]) => {
          if (numberOfVehicles) {
            this.addVehicles(numberOfVehicles, !!batchId);
            this.form.setValue({ numberOfVehicles, vehicles });
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
            this.addVehicles(n - currentList, generateNumber);
          }
        }
      });
  }

  addVehicles(n: number, withNumber = false) {
    for (let i = 0; i < n; i++) {
      this.vehicles.push(this.vehicleForm(withNumber));
    }
  }

  removeAt(i: number) {
    this.vehicles.removeAt(i);
  }

  vehicleForm(withNumber = false) {
    const f = this.fb.group({
      vin: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(21)], [this.technicalRecordService.validateVin()]]
    });

    if (withNumber) {
      f.addControl(
        'trailerId',
        this.fb.control('', [Validators.required, Validators.maxLength(8), CustomValidators.alphanumeric()]) //Validators.minLength(7)
      );
    }

    return f;
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

  private cleanEmptyValues<T extends Record<string, any>>(input: T[]): T[] {
    return input.filter(formInput => Object.values(formInput).some(value => !!value));
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.showErrors();
      return;
    }

    this.globalErrorService.setErrors([]);
    this.technicalRecordService.upsertVehicleBatch(this.vehicles.value);
    this.back();
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  get width() {
    return FormNodeWidth;
  }
}
