import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { editableVehicleTechRecord, updateEditingTechRecord, updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { filter, mergeMap, Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-change-visibility',
  templateUrl: './tech-record-change-visibility.component.html',
  styleUrls: ['./tech-record-change-visibility.component.scss']
})
export class TechRecordChangeVisibilityComponent implements OnInit {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;
  techRecord?: TechRecordModel;

  form: CustomFormGroup;

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;

    this.technicalRecordService.techRecord$.subscribe(techRecord => (this.techRecord = techRecord));

    this.form = new CustomFormGroup(
      { name: 'reasonForChagingVisibility', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
  }

  get title(): string {
    return `${this.isHidden ? 'Show' : 'Hide'} record in VTA`;
  }

  get buttonLabel(): string {
    return `${this.isHidden ? 'Show' : 'Hide'} record`;
  }

  get isHidden(): boolean {
    return this.techRecord?.hiddenInVta || false;
  }

  ngOnInit(): void {
    this.actions$.pipe(ofType(updateTechRecordsSuccess), take(1)).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string }): void {
    this.form.valid
      ? this.errorService.clearErrors()
      : this.errorService.setErrors([
          { error: `Reason for ${this.isHidden ? 'showing' : 'hiding'} is required`, anchorLink: 'reasonForChagingVisibility' }
        ]);

    if (!this.form.valid || !form.reason) {
      return;
    }

    const updatedTechRecord: TechRecordModel = {
      ...cloneDeep(this.techRecord!),
      reasonForCreation: form.reason,
      hiddenInVta: !this.isHidden
    };

    this.store.pipe(select(editableVehicleTechRecord), take(1)).subscribe(vehicleTechRecord => {
      if (vehicleTechRecord) {
        this.store.dispatch(updateEditingTechRecord({ ...vehicleTechRecord, techRecord: [updatedTechRecord] }));
      }
    });

    this.store
      .select(selectRouteNestedParams)
      .pipe(take(1))
      .subscribe(({ systemNumber }) => this.store.dispatch(updateTechRecords({ systemNumber })));
  }
}
