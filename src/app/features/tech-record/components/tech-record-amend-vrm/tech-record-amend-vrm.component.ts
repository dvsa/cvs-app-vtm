import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { NotTrailer, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, catchError, filter, of, switchMap, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnDestroy, OnInit {
  techRecord?: NotTrailer;
  makeAndModel?: string;

  form = new FormGroup({
    isCherishedTransfer: new CustomFormControl(
      { name: 'is-cherished-transfer', label: 'Why do you want to amend this VRM?', type: FormNodeTypes.CONTROL },
      false,
      [Validators.required]
    ),
    newVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.validateVrmForUpdate(this.techRecord?.primaryVrm ?? undefined)]
    ),
    donorVrm: new CustomFormControl(
      { name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.checkVehicleExists()]
    ),
    recipientVrm: new CustomFormControl({ name: 'recipient-vrm', label: 'recipient vehicle VRM', type: FormNodeTypes.CONTROL }),
    newDonorVrm: new CustomFormControl(
      { name: 'new-donor-vrm', label: 'Input a new VRM for donor vehicle', type: FormNodeTypes.CONTROL },
      '',
      [CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)],
      [this.technicalRecordService.validateVrmForUpdate(this.techRecord?.primaryVrm ?? undefined)]
    )
  });

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    public dfs: DynamicFormService,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      if (record?.techRecord_statusCode === 'archived' || !record) {
        return this.navigateBack();
      }
      this.techRecord = record as NotTrailer;
      this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
    });

    this.actions$.pipe(ofType(amendVrmSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
      this.router.navigate(['/tech-records', `${vehicleTechRecord.systemNumber}`, `${vehicleTechRecord.createdTimestamp}`]);
    });
    this.form.get('recipientVrm')?.setValue(this.techRecord?.primaryVrm);
    this.form.get('recipientVrm')?.disable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get reasons(): Array<FormNodeOption<boolean>> {
    return [
      { label: 'Cherished transfer', value: true, hint: 'Current VRM will be archived' },
      { label: 'Correcting an error', value: false, hint: 'Current VRM will not be archived' }
    ];
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    if (!this.isFormValid()) return;

    this.store.dispatch(
      amendVrm({
        newVrm: this.form.value.isCherishedTransfer ? this.form.value.donorVrm : this.form.value.newVrm,
        cherishedTransfer: this.form.value.isCherishedTransfer,
        systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber!,
        createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp!
      })
    );
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    if (this.form.value.newVrm === '' || (this.form.value.newVrm === this.techRecord?.primaryVrm ?? '')) {
      this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
      return false;
    }
    if (this.form.value.isCherishedTransfer === '' || this.form.value.isCherishedTransfer === undefined) {
      this.globalErrorService.addError({ error: 'You must provide a reason for amending', anchorLink: 'cherishedTransfer' });
      return false;
    }

    return this.form.valid;
  }
}
