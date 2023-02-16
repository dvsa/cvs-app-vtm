import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { LETTER_TYPES } from '@forms/templates/general/letter-types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { generateLetter, generateLetterSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-generate-letter',
  templateUrl: './tech-record-generate-letter.component.html',
  styleUrls: ['./tech-record-generate-letter.component.scss']
})
export class GenerateLetterComponent implements OnInit {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form = new FormGroup({
    letterType: new CustomFormControl({ name: 'letterType', label: 'Type of letter to generate', type: FormNodeTypes.CONTROL }, '', [
      Validators.required
    ])
  });
  width: FormNodeWidth = FormNodeWidth.L;

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
  }

  get reasons(): Array<FormNodeOption<string>> {
    return [
      { label: 'Trailer authorised', value: LETTER_TYPES[0].value },
      { label: 'Trailer rejected', value: LETTER_TYPES[1].value }
    ];
  }

  ngOnInit(): void {
    if (!this.currentTechRecord || this.currentTechRecord.vehicleType !== 'trl') {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(generateLetterSuccess), take(1)).subscribe(() => this.navigateBack());
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(letterType: string): void {
    this.globalErrorService.clearErrors();
    if (letterType === '') {
      return this.globalErrorService.addError({ error: 'Letter type is required', anchorLink: 'letterType' });
    }

    this.store.dispatch(generateLetter({ techRecord: this.currentTechRecord!, letterType: letterType }));
  }
}
