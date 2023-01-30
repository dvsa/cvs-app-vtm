import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, CustomFormArray } from '@forms/services/dynamic-form.types';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord, createVehicleRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, take, tap } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../tech-record/components/tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html'
})
export class HydrateNewVehicleRecordComponent implements OnInit {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}
  ngOnInit(): void {
    this.handleFormState();
  }

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$.pipe(
      tap(techRecord => {
        if (!techRecord) this.navigateBack();
      })
    );
  }

  isInvalid: boolean = false;
  vehicleType?: VehicleTypes;

  get customSectionForms(): Array<CustomFormGroup> {
    if (this.summary && this.vehicleType) {
      const commonCustomSections = [this.summary.body.form, this.summary.dimensions.form, this.summary.tyres.form, this.summary.weights.form];

      switch (this.vehicleType) {
        case VehicleTypes.PSV:
          return [...commonCustomSections, this.summary.psvBrakes!.form];
        case VehicleTypes.HGV:
          return commonCustomSections;
        case VehicleTypes.TRL:
          return [...commonCustomSections, this.summary.trlBrakes!.form];
        default:
          return [];
      }
    } else return [];
  }

  handleFormState(): void {
    this.vehicle$.pipe(take(1)).subscribe(data => (this.vehicleType = data?.techRecord[0].vehicleType));
    const form = this.summary?.sections.map(section => section.form).concat(this.customSectionForms);
    if (form) {
      this.isInvalid = this.isAnyFormInvalid(form);
    }
  }

  isAnyFormInvalid(forms: Array<CustomFormGroup | CustomFormArray>): boolean {
    const errors: GlobalError[] = [];
    forms.forEach(form => DynamicFormService.updateValidity(form, errors));
    errors.length ? this.globalErrorService.setErrors(errors) : this.globalErrorService.clearErrors();
    return forms.some(form => form.invalid);
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit() {
    this.handleFormState();
    if (!this.isInvalid) {
      this.store.dispatch(createVehicleRecord());
      this.actions$.pipe(ofType(createVehicleRecordSuccess), take(1)).subscribe(() => this.navigateBack());
    }
  }
}
