import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReasonForGenerating, TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { generatePlate, generatePlateSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';
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
        name: 'plateReason',
        label: 'Reason for generating plate',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.Required }]
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
    if (!this.currentTechRecord || (this.currentTechRecord.vehicleType !== 'hgv' && this.currentTechRecord.vehicleType !== 'trl')) {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(generatePlateSuccess), take(1)).subscribe(() => {
      this.navigateBack();
    });
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(plateReasonForGenerating: string): void {
    this.globalErrorService.clearErrors();
    if (plateReasonForGenerating === '') {
      return this.globalErrorService.addError({ error: 'Reason for generating plate is required', anchorLink: 'plateReasonForGenerating' });
    }

    console.log(plateReasonForGenerating);

    this.store.dispatch(generatePlate({ techRecord: this.currentTechRecord! }));
  }
}
