import { Component, OnChanges, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, firstValueFrom, map, take } from 'rxjs';

@Component({
  selector: 'app-change-amend-vin',
  templateUrl: './tech-record-amend-vin.component.html'
})
export class AmendVinComponent implements OnInit, OnChanges {
  vehicle?: VehicleTechRecordModel;
  techRecord?: TechRecordModel;
  isVinUniqueCheckComplete: boolean = false;
  vinUnique: boolean = false;
  error?: string;

  form = new FormGroup({
    newVin: new CustomFormControl(
      {
        name: 'newVin',
        type: FormNodeTypes.CONTROL
      },
      '',
      [Validators.minLength(3), Validators.maxLength(21), Validators.required]
    )
  });

  constructor(
    private actions$: Actions,
    public dfs: DynamicFormService,
    public globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));

    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(techRecord => (this.techRecord = techRecord));
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  ngOnInit(): void {
    if (!this.techRecord) {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(updateTechRecordsSuccess), take(1)).subscribe(() => this.navigateBack());
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
    this.isVinUniqueCheckComplete = false;
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

  async handleSubmit() {
    if (!this.isVinUniqueCheckComplete) {
      this.vinUnique = await this.isVinUnique();
      if (!this.vinUnique) {
        this.globalErrorService.addError({
          error: 'This VIN already exists. It will be associated to more than one technical record if you continue',
          anchorLink: 'vinError'
        });
        return;
      }
    }
  }

  isFormValid(): boolean {
    this.globalErrorService.clearErrors();

    const errors: GlobalError[] = [];

    DynamicFormService.updateValidity(this.form, errors);

    if (errors?.length) {
      this.globalErrorService.setErrors(errors);
    }

    return this.form.valid;
  }

  async isVinUnique(): Promise<boolean> {
    this.vehicle!.vin = this.form.value.vin;
    const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(this.vehicle!.vin!, SEARCH_TYPES.VIN));
    this.isVinUniqueCheckComplete = true;
    return isVinUnique;
  }

  getInlineErrorMessage(name: string): Observable<boolean> {
    return this.globalErrorService.errors$.pipe(map(errors => errors.some(error => error.anchorLink === name)));
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
}
