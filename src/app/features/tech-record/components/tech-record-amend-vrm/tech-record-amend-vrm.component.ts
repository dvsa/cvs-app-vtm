import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { CustomValidators } from '@forms/validators/custom-validators';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord, updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { catchError, filter, map, of, skipWhile, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { StatusCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/skeleton';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnDestroy {
  techRecord?: V3TechRecordModel;

  form = new FormGroup({
    newVrm: new CustomFormControl({ name: 'new-vrm', label: 'Input a new VRM', type: FormNodeTypes.CONTROL }, '', [
      CustomValidators.alphanumeric(),
      CustomValidators.notZNumber,
      Validators.minLength(3),
      Validators.maxLength(9)
    ]),
    isCherishedTransfer: new CustomFormControl(
      { name: 'is-cherished-transfer', label: 'Why do you want to amend this VRM?', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required]
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
  ) {
    this.store
      .select(selectTechRecord)
      .pipe(takeUntil(this.destroy$))
      .subscribe(record => {
        // TODO: check status codes
        if (record?.techRecord_statusCode === 'archived') {
          return this.navigateBack();
        }
        this.techRecord = record;
      });

    this.actions$
      .pipe(ofType(updateTechRecordsSuccess), takeUntil(this.destroy$))
      .subscribe(newRecord => this.router.navigate([`/tech-records/${newRecord.systemNumber}/${newRecord.createdTimestamp}`]));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get reasons(): Array<FormNodeOption<string>> {
    return [
      { label: 'Cherished transfer', value: 'true', hint: 'Current VRM will be archived' },
      { label: 'Correcting an error', value: 'false', hint: 'Current VRM will not be archived' }
    ];
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  get makeAndModel(): string {
    const c = this.techRecord;
    if (!(c as any)?.techRecord_make && !(c as any)?.techRecord_chassisMake) return '';

    return `${c?.techRecord_vehicleType === 'psv' ? (c as any).techRecord_chassisMake : (c as any).techRecord_make} - ${
      (c as any).vehicleType === 'psv' ? (c as any).chassisModel : (c as any).model
    }`;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    if (!this.isFormValid()) return;

    this.globalErrorService.errors$
      .pipe(
        take(1),
        filter(errors => !errors.length),
        switchMap(() => this.technicalRecordService.isUnique(this.form.value.newVrm, SEARCH_TYPES.VRM)),
        take(1),
        catchError(error => (error.status == 404 ? of(true) : throwError(() => new Error('Error'))))
      )
      .subscribe({
        next: res => {
          if (!res) return this.globalErrorService.addError({ error: 'VRM already exists', anchorLink: 'newVrm' });

          const newVehicleRecord: V3TechRecordModel = this.amendVrm(
            this.techRecord!,
            this.form.value.newVrm,
            this.form.value.isCherishedTransfer === 'true'
          );

          this.store.dispatch(updateTechRecords({ vehicleTechRecord: newVehicleRecord }));
        },
        error: e => this.globalErrorService.addError({ error: 'Internal Server Error', anchorLink: 'newVrm' })
      });
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    DynamicFormService.validate(this.form, errors);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    if (this.form.value.newVrm === '' || (this.form.value.newVrm === this.techRecord!.primaryVrm ?? '')) {
      this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
      return false;
    }
    if (this.form.value.isCherishedTransfer === '' || this.form.value.isCherishedTransfer === undefined) {
      this.globalErrorService.addError({ error: 'You must provide a reason for amending', anchorLink: 'cherishedTransfer' });
      return false;
    }

    return this.form.valid;
  }

  amendVrm(record: V3TechRecordModel, newVrm: string, cherishedTransfer: boolean) {
    const newModel: V3TechRecordModel = cloneDeep(record);

    if (cherishedTransfer) {
      // TODO: remove as any
      (newModel as any).secondaryVrms.push(newModel.primaryVrm);
    }

    newModel.primaryVrm = newVrm;
    newModel.techRecord_reasonForCreation = `Amending VRM.`;

    return newModel;
  }
}
