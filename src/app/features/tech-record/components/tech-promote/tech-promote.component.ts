import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { archiveTechRecord, updateEditingTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { Observable, tap } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';

@Component({
  selector: 'app-tech-promote',
  templateUrl: './tech-promote.component.html'
})
export class TechPromoteComponent {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  techRecord!: TechRecordModel;

  form: CustomFormGroup;
  buttonLabel: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    const condition = this.isPromotion
      ? (record: TechRecordModel) => record.statusCode === StatusCodes.PROVISIONAL
      : (record: TechRecordModel) => record.statusCode === StatusCodes.CURRENT;

    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$.pipe(
      tap(vehicleTechRecord => (this.techRecord = cloneDeep(vehicleTechRecord?.techRecord.find(condition))!))
    );

    this.buttonLabel = this.isPromotion ? 'Promote' : 'Archive';

    this.form = new CustomFormGroup(
      { name: 'reasonGroup', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL, validators: [{ name: ValidatorNames.Required }] }, undefined) }
    );
  }

  get isPromotion(): boolean {
    return this.router.url.split('/').pop() === 'promote';
  }

  get label(): string {
    return `Reason for ${this.isPromotion ? 'promotion' : 'archiving'}`;
  }

  handleSubmit(): void {
    const reason = this.form.get('reason')?.value;

    if (this.isPromotion) {
      this.techRecord.reasonForCreation = reason;
    }

    this.store.dispatch(updateEditingTechRecord({ techRecord: this.techRecord }));

    const systemNumber = this.router.url.split('/')[2];

    const action = this.isPromotion
      ? updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      : archiveTechRecord({ systemNumber, reasonForArchiving: reason });

    this.store.dispatch(action);

    this.router.navigate([this.isPromotion ? '../..' : '..'], { relativeTo: this.route });
  }
}
