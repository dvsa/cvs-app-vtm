import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReasonForGenerating, TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { catchError, map, of, take, tap, throwError } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-generate-plate',
  templateUrl: './tech-record-generate-plate.component.html',
  styleUrls: ['./tech-record-generate-plate.component.scss']
})
export class GeneratePlateComponent implements OnInit, OnChanges {
  reasons: Array<FormNodeOption<string>> = [
    { label: 'Free replacement', value: ReasonForGenerating.FREE_REPLACEMENT },
    { label: 'Replacement', value: ReasonForGenerating.REPLACEMENT },
    { label: 'Destroyed', value: ReasonForGenerating.DESTROYED },
    { label: 'Provisional', value: ReasonForGenerating.PROVISIONAL },
    { label: 'Original', value: ReasonForGenerating.ORIGINAL },
    { label: 'Manual', value: ReasonForGenerating.MANUAL }
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
        name: 'plateSerialNumber',
        label: 'Plate Serial Number',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [
          { name: ValidatorNames.Required },
          { name: ValidatorNames.MaxLength, args: 12 },
          { name: ValidatorNames.MinLength, args: 1 },
          { name: ValidatorNames.Alphanumeric }
        ]
      },
      {
        name: 'plateIssueDate',
        label: 'Plate Issue Date',
        value: '',
        type: FormNodeTypes.CONTROL,
        editType: FormNodeEditTypes.DATE,
        validators: [{ name: ValidatorNames.Required }]
      },
      {
        name: 'plateReason',
        label: 'Reason for generating plate',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.Required }]
      },
      {
        name: 'plateIssuer',
        label: 'Plate Issuer',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 12 }, { name: ValidatorNames.MinLength, args: 1 }]
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

  handleSubmit(plateSerialNumber: string): void {
    // this.globalErrorService.clearErrors();
    // if (newVrm === '' || (newVrm === this.vrm ?? '')) {
    //   return this.globalErrorService.addError({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    // }
    // this.technicalRecordService
    //   .isUnique(newVrm, SEARCH_TYPES.VRM)
    //   .pipe(
    //     take(1),
    //     catchError(error => (error.status == 404 ? of(true) : throwError(() => new Error('Error'))))
    //   )
    //   .subscribe({
    //     next: res => {
    //       if (!res) return this.globalErrorService.addError({ error: 'VRM already exists', anchorLink: 'newVrm' });
    //       const newVehicleRecord = this.amendVrm(this.vehicle!, newVrm);
    //       this.setReasonForCreation(newVehicleRecord);
    //       this.technicalRecordService.updateEditingTechRecord({ ...newVehicleRecord });
    //       this.store.dispatch(updateTechRecords({ systemNumber: this.vehicle!.systemNumber }));
    //     },
    //     error: e => this.globalErrorService.addError({ error: 'Internal Server Error', anchorLink: 'newVrm' })
    //   });
  }

  setReasonForCreation(vehicleRecord: VehicleTechRecordModel) {
    if (vehicleRecord.techRecord !== undefined) vehicleRecord.techRecord.forEach(record => (record.reasonForCreation = `Amending VRM.`));
  }
}
