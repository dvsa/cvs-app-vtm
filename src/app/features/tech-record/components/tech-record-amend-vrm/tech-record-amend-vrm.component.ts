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
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { catchError, filter, of, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnDestroy {
  vehicle?: VehicleTechRecordModel;
  techRecord?: TechRecordModel;

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
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));

    this.technicalRecordService.editableTechRecord$
      .pipe(take(1))
      .subscribe(techRecord => (!techRecord ? this.navigateBack() : (this.techRecord = techRecord)));

    this.actions$.pipe(ofType(updateTechRecordsSuccess), takeUntil(this.destroy$)).subscribe(() => this.navigateBack());
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
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord);
  }

  get makeAndModel(): string {
    const c = this.techRecord;
    if (!c?.make && !c?.chassisMake) return '';

    return `${c.vehicleType === 'psv' ? c.chassisMake : c.make} - ${c.vehicleType === 'psv' ? c.chassisModel : c.model}`;
  }

  get vrm(): string | undefined {
    return this.vehicle?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
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

          const newVehicleRecord = this.amendVrm(this.vehicle!, this.form.value.newVrm, this.form.value.isCherishedTransfer === 'true');

          if (newVehicleRecord.techRecord) {
            newVehicleRecord.techRecord.forEach(record => (record.reasonForCreation = `Amending VRM.`));
          }

          this.technicalRecordService.updateEditingTechRecord({ ...newVehicleRecord });
          this.store.dispatch(updateTechRecords({ systemNumber: this.vehicle!.systemNumber }));
        },
        error: e => this.globalErrorService.addError({ error: 'Internal Server Error', anchorLink: 'newVrm' })
      });
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.form, errors);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    if (this.form.value.newVrm === '' || (this.form.value.newVrm === this.vrm ?? '')) {
      this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
      return false;
    }
    if (this.form.value.isCherishedTransfer === '' || this.form.value.isCherishedTransfer === undefined) {
      this.globalErrorService.addError({ error: 'You must provide a reason for amending', anchorLink: 'cherishedTransfer' });
      return false;
    }

    return this.form.valid;
  }

  amendVrm(record: VehicleTechRecordModel, newVrm: string, cherishedTransfer: boolean) {
    const newModel: VehicleTechRecordModel = cloneDeep(record);

    if (!cherishedTransfer) {
      const primaryVrm = newModel.vrms.find(vrm => vrm.isPrimary)!;
      newModel.vrms.splice(newModel.vrms.indexOf(primaryVrm), 1);
    }

    newModel.vrms.forEach(x => (x.isPrimary = false));

    const existingVrmObject = newModel.vrms.find(vrm => vrm.vrm == newVrm);

    if (!existingVrmObject) {
      newModel.vrms.push({ vrm: newVrm.toUpperCase(), isPrimary: true });
    } else {
      existingVrmObject.isPrimary = true;
    }

    return newModel;
  }

  // Currently unused, to be discussed as a future ticket
  mapVrmToTech(vehicleRecord: VehicleTechRecordModel, techRecord: TechRecordModel) {
    const newTechModel: TechRecordModel = cloneDeep(techRecord);

    newTechModel.historicSecondaryVrms = [];

    vehicleRecord.vrms.forEach(vrm =>
      vrm.isPrimary ? (newTechModel.historicPrimaryVrm = vrm.vrm) : newTechModel.historicSecondaryVrms!.push(vrm.vrm)
    );
    return newTechModel;
  }
}
