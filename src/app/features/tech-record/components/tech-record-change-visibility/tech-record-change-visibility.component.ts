import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { updateEditingTechRecord, updateTechRecords, updateTechRecordsSuccess } from '@store/technical-records';
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

  form: CustomFormGroup;

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private routerStore: Store<RouterReducerState>,
    private techRecordsStore: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;

    this.form = new CustomFormGroup(
      { name: 'reasonForChagingVisibility', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
  }

  get title(): string {
    return `${this.routeSuffix === 'hide-in-vta' ? 'Hide' : 'Show'} record in VTA`;
  }

  get buttonLabel(): string {
    return `${this.routeSuffix === 'hide-in-vta' ? 'Hide' : 'Show'} record`;
  }

  get routeSuffix(): string {
    return this.router.url.split('/').pop() || '';
  }

  ngOnInit(): void {
    this.actions$.pipe(ofType(updateTechRecordsSuccess), take(1)).subscribe(() => this.router.navigate(['..'], { relativeTo: this.route }));
  }

  goBack(): void {
    this.location.back();
  }

  handleSubmit(form: { reason: string }): void {
    this.form.valid
      ? this.errorService.clearErrors()
      : this.errorService.setErrors([
          { error: `Reason for ${this.routeSuffix === 'hide-in-vta' ? 'hiding' : 'showing'} is required`, anchorLink: 'reasonForChagingVisibility' }
        ]);

    if (!this.form.valid || !form.reason) {
      return;
    }

    this.technicalRecordService.techRecord$
      .pipe(
        filter(techRecord => !!techRecord),
        mergeMap(techRecord => {
          const updatedTechRecord: TechRecordModel = {
            ...cloneDeep(techRecord!),
            reasonForCreation: form.reason,
            hiddenInVta: this.routeSuffix === 'hide-in-vta'
          };

          this.techRecordsStore.dispatch(updateEditingTechRecord({ techRecord: updatedTechRecord }));

          return this.routerStore.select(selectRouteNestedParams);
        }),
        take(1)
      )
      .subscribe(({ systemNumber }) => this.techRecordsStore.dispatch(updateTechRecords({ systemNumber })));
  }
}
