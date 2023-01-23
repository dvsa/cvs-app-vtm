import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { getByVrmSuccess, updateEditingTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { catchError, map, of, take, throwError } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';

@Component({
  selector: 'app-change-amend-vrm',
  templateUrl: './tech-record-amend-vrm.component.html',
  styleUrls: ['./tech-record-amend-vrm.component.scss']
})
export class AmendVrmComponent implements OnInit, OnChanges {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form: CustomFormGroup;

  template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'newVRM',
        label: 'Input a new VRM',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.MaxLength, args: 9 }, { name: ValidatorNames.MinLength, args: 1 }, { name: ValidatorNames.Alphanumeric }]
      }
    ]
  };

  constructor(
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

  handleSubmit(newVRM: string): void {
    if (newVRM === '' && (newVRM !== this.vrm ?? '')) {
      return this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVRM' });
    }

    //TODO: Implement Tom's isUnique function when that is ready
    this.technicalRecordService
      .getByVrm(newVRM)
      .pipe(
        map(response => {
          console.log(response);
          if (response.length >= 1) {
            throw new HttpErrorResponse({
              status: 400,
              statusText: 'VRM already exists'
            });
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(true);
          }

          return throwError(() => new Error('stop'));
        })
      )
      .subscribe({
        next: res => {
          console.log('response:', res);
          const newVehicleRecord = this.amendVrm(newVRM, this.vehicle!);
          const newTechRecord = this.mapVrmToTech(newVehicleRecord, this.currentTechRecord!);
          this.technicalRecordService.updateEditingTechRecord({ ...newVehicleRecord, techRecord: [newTechRecord] });
          this.store.dispatch(updateTechRecords({ systemNumber: this.vehicle!.systemNumber }));
          this.navigateBack();
        },
        error: e => this.globalErrorService.addError({ error: 'VRM already exists', anchorLink: 'newVRM' })
      });
  }

  amendVrm(newVrm: string, record: VehicleTechRecordModel) {
    const newModel: VehicleTechRecordModel = cloneDeep(record);
    const vrmObject: Vrm = { vrm: newVrm.toUpperCase(), isPrimary: true };

    newModel.vrms.forEach(x => {
      x.isPrimary = false;
    });
    newModel.vrms.push(vrmObject);
    return newModel;
  }

  mapVrmToTech(vehicleRecord: VehicleTechRecordModel, techRecord: TechRecordModel) {
    const newTechModel: TechRecordModel = cloneDeep(techRecord);

    newTechModel.historicSecondaryVrms = [];

    vehicleRecord.vrms.forEach(vrm =>
      vrm.isPrimary ? (newTechModel.historicPrimaryVrm = vrm.vrm) : newTechModel.historicSecondaryVrms!.push(vrm.vrm)
    );
    return newTechModel;
  }
}
