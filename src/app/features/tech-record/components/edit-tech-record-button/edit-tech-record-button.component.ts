import { Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { postProvisionalTechRecord, postProvisionalTechRecordSuccess, putUpdateTechRecords, putUpdateTechRecordsSuccess } from '@store/technical-records';
import { ofType, Actions } from '@ngrx/effects';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() viewableTechRecord?: TechRecordModel;
  editableState = false;
  isArchived?: boolean;
  isCurrent?: boolean;
  hasProvisional?: boolean;

  constructor(private store: Store, private actions$: Actions, private router: Router) {}

  ngOnInit() {
    this.isArchived = this.viewableTechRecord?.statusCode === StatusCodes.ARCHIVED ? true : false;
    this.isCurrent = this.viewableTechRecord?.statusCode === StatusCodes.CURRENT ? true : false;
    this.hasProvisional = this.vehicleTechRecord?.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
    this.watchForEditSuccess();
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
  }

  get systemNumber() {
    return this.vehicleTechRecord!.systemNumber;
  }

  watchForEditSuccess() {
    this.actions$
      .pipe(ofType(putUpdateTechRecordsSuccess, postProvisionalTechRecordSuccess), take(1))
      .subscribe(action =>
        this.router.navigateByUrl(
          `/tech-records/${action.vehicleTechRecords[0].systemNumber}/${this.getLatestRecordTimestamp(action.vehicleTechRecords[0])}`
        )
      );
  }

  getLatestRecordTimestamp(record: VehicleTechRecordModel): number {
    return Math.max(...record.techRecord.map(record => new Date(record.createdAt).getTime()));
  }

  submitTechRecord() {
    if (this.hasProvisional && this.isCurrent) {
      this.store.dispatch(putUpdateTechRecords({ systemNumber: this.systemNumber, oldStatusCode: StatusCodes.PROVISIONAL }));
    } else if (this.hasProvisional) {
      this.store.dispatch(putUpdateTechRecords({ systemNumber: this.systemNumber }));
    } else {
      this.store.dispatch(postProvisionalTechRecord({ systemNumber: this.systemNumber }));
    }
    this.toggleEditMode();
  }
}
