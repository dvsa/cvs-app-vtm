import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent implements OnDestroy, OnInit {
  techRecord?: V3TechRecordModel;
  form: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private routerService: RouterService,
    private store: Store<State>,
  ) {
    this.form = new FormGroup({
      vin: new CustomFormControl(
        {
          name: 'input-vin',
          label: 'Vin',
          type: FormNodeTypes.CONTROL
        },
        '',
        [
          CustomValidators.alphanumeric(),
          Validators.minLength(3),
          Validators.maxLength(21),
          Validators.required,
          CustomValidators.validateVinCharacters(),
        ],
        [this.technicalRecordService.validateVinForUpdate(this.techRecord?.vin)]
      )
    });
    this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`]);
    });
  }

  ngOnInit(): void {
    this.technicalRecordService.techRecord$
      .pipe(takeUntil(this.destroy$))
      .subscribe(record => (!record ? this.navigateBack() : (this.techRecord = record)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  get makeAndModel(): string | undefined {
    return this.techRecord ? this.technicalRecordService.getMakeAndModel(this.techRecord) : undefined;
  }

  get currentVrm(): string | undefined {
    return this.techRecord?.techRecord_vehicleType !== 'trl' ? this.techRecord?.primaryVrm ?? '' : undefined;
  }

  isFormValid(): boolean {
    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    this.globalErrorService.setErrors(errors);

    if (this.form.value.vin === this.techRecord?.vin) {
      this.globalErrorService.addError({ error: 'You must provide a new VIN', anchorLink: 'newVin' });
      return false;
    }

    return this.form.valid;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    const record = { ...this.techRecord! } as TechRecordType<'put'>;
    record.vin = this.form.value.vin;

    if (this.isFormValid() || (this.form.status === 'PENDING' && this.form.errors === null)) {
      this.technicalRecordService.updateEditingTechRecord({ ...record, techRecord_reasonForCreation: 'Vin changed' });
      this.routerService
        .getRouteNestedParam$('systemNumber')
        .pipe(take(1), takeUntil(this.destroy$), withLatestFrom(this.routerService.getRouteNestedParam$('createdTimestamp')))
        .subscribe(([systemNumber, createdTimestamp]) => {
          if (systemNumber && createdTimestamp) {
            this.store.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
          }
        });
    }
  }
}
