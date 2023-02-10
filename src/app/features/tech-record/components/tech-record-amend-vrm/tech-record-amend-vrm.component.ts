import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { catchError, filter, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnInit, OnChanges {
  reasons: Array<FormNodeOption<string>> = [
    { label: 'Cherished transfer', value: 'true', hint: 'Current VRM will be archived' },
    { label: 'Correcting an error', value: 'false', hint: 'Current VRM will not be archived' }
  ];

  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form: CustomFormGroup;
  width: FormNodeWidth = FormNodeWidth.L;

  template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'newVrm',
        label: 'Input a new VRM',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [
          { name: ValidatorNames.Alphanumeric },
          { name: ValidatorNames.MaxLength, args: 9 },
          { name: ValidatorNames.MinLength, args: 1 },
          { name: ValidatorNames.NotZNumber }
        ]
      }
    ]
  };

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

    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(techRecord => (this.currentTechRecord = techRecord));

    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  ngOnInit(): void {
    if (!this.currentTechRecord) {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(updateTechRecordsSuccess), take(1)).subscribe(() => {
      this.navigateBack();
    });
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  get makeAndModel(): string {
    const c = this.currentTechRecord;
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

  handleSubmit(newVrm: string, cherishedTransfer: string): void {
    this.globalErrorService.clearErrors();
    if (newVrm === '' || (newVrm === this.vrm ?? '')) {
      this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    }
    if (cherishedTransfer === '' || cherishedTransfer === undefined) {
      this.globalErrorService.addError({ error: 'You must provide a reason for amending', anchorLink: 'cherishedTransfer' });
    }

    this.globalErrorService.errors$
      .pipe(
        take(1),
        filter(errors => !errors.length),
        switchMap(() => this.technicalRecordService.isUnique(newVrm, SEARCH_TYPES.VRM)),
        take(1),
        catchError(error => (error.status == 404 ? of(true) : throwError(() => new Error('Error'))))
      )
      .subscribe({
        next: res => {
          if (!res) return this.globalErrorService.addError({ error: 'VRM already exists', anchorLink: 'newVrm' });

          const newVehicleRecord = this.amendVrm(this.vehicle!, newVrm, cherishedTransfer === 'true');

          this.setReasonForCreation(newVehicleRecord);
          this.technicalRecordService.updateEditingTechRecord({ ...newVehicleRecord });
          this.store.dispatch(updateTechRecords({ systemNumber: this.vehicle!.systemNumber }));
        },
        error: e => this.globalErrorService.addError({ error: 'Internal Server Error', anchorLink: 'newVrm' })
      });
  }

  amendVrm(record: VehicleTechRecordModel, newVrm: string, cherishedTransfer: boolean) {
    const newModel: VehicleTechRecordModel = cloneDeep(record);
    if (!cherishedTransfer) {
      const primaryVrm = newModel.vrms.find(vrm => vrm.isPrimary);
      newModel.vrms.splice(newModel.vrms.indexOf(primaryVrm!), 1);
    }

    newModel.vrms.forEach(x => (x.isPrimary = false));

    const existingVrmObject = newModel.vrms.find(vrm => vrm.vrm == newVrm);
    if (existingVrmObject == null) {
      const vrmObject: Vrm = { vrm: newVrm.toUpperCase(), isPrimary: true };
      newModel.vrms.push(vrmObject);
    } else existingVrmObject.isPrimary = true;

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

  setReasonForCreation(vehicleRecord: VehicleTechRecordModel) {
    if (vehicleRecord.techRecord !== undefined) vehicleRecord.techRecord.forEach(record => (record.reasonForCreation = `Amending VRM.`));
  }
}
