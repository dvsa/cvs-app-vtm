import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateEditingTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tech-promote',
  templateUrl: './tech-promote.component.html'
})
export class TechPromoteComponent {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  techRecord!: TechRecordModel;

  form: CustomFormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService) {
    const condition = this.isPromotion
        ? (record: TechRecordModel) => record.statusCode === StatusCodes.PROVISIONAL
        : (record: TechRecordModel) => record.statusCode === StatusCodes.CURRENT;

    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$.pipe(
      tap(vehicleTechRecord => this.techRecord = cloneDeep(vehicleTechRecord?.techRecord.find(condition))!)
      );

    this.form = new CustomFormGroup(
      { name: 'reasonGroup', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined) }
    );
  }

  get isPromotion(): boolean {
    return this.router.url.split('/').pop() === 'promote';
  }

  get label(): string {
    return `Are you sure you want to ${this.isPromotion ? 'promote this to a current' : 'archive this'} record?`;
  }

  handleSubmit(): void {
    this.techRecord.reasonForCreation = this.form.get('reason')?.value;

    this.store.dispatch(updateEditingTechRecord({ techRecord: this.techRecord }));

    const systemNumber = this.router.url.split('/')[2];

    if (this.isPromotion) {
      this.store.dispatch(updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT }));

      this.router.navigate([`../..`], { relativeTo: this.route });
    } else {
      // do your thing Tom ;)
    }
  }
}
