import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecords } from '@store/technical-records';
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

  handleSubmit(newVrm: string): void {
    this.globalErrorService.clearErrors();
    if (newVrm === '' || (newVrm === this.vrm ?? '')) {
      return this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    }

    this.technicalRecordService
      .isUnique(newVrm, SEARCH_TYPES.VRM)
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status == 404) {
            return of(true);
          }
          return throwError(() => new Error('Error'));
        })
      )
      .subscribe({
        next: res => {
          if (res == true) {
            console.log('response:', res);
            const newVehicleRecord = this.amendVrm(this.vehicle!, newVrm);

            this.setReasonForCreation(newVehicleRecord);
            //const newTechRecord = this.mapVrmToTech(newVehicleRecord, this.currentTechRecord!);
            this.technicalRecordService.updateEditingTechRecord({ ...newVehicleRecord });
            this.store.dispatch(updateTechRecords({ systemNumber: this.vehicle!.systemNumber }));
          } else this.globalErrorService.addError({ error: 'VRM already exists', anchorLink: 'newVrm' });
        },
        error: e => this.globalErrorService.addError({ error: 'Internal Server Error', anchorLink: 'newVrm' })
      });
    if (!this.globalErrorService.errors$) {
      this.navigateBack();
    }
  }

  amendVrm(record: VehicleTechRecordModel, newVrm: string) {
    const newModel: VehicleTechRecordModel = cloneDeep(record);
    newModel.vrms.forEach(x => {
      x.isPrimary = false;
    });

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
