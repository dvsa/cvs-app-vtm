import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { postProvisionalTechRecord, putUpdateTechRecords } from '@store/technical-records';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() viewableTechRecord?: TechRecordModel;
  @Input() editableState = false;
  @Input() isDirty: boolean = false;
  @Input() isInvalid: boolean = false;
  isArchived?: boolean;
  isCurrent?: boolean;
  hasProvisional?: boolean;

  @Output() editableStateChange = new EventEmitter<boolean>()

  constructor(private store: Store) {}

  ngOnInit() {
    this.isArchived = this.viewableTechRecord?.statusCode === StatusCodes.ARCHIVED;
    this.isCurrent = this.viewableTechRecord?.statusCode === StatusCodes.CURRENT;
    this.hasProvisional = this.vehicleTechRecord?.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
    this.editableStateChange.emit(this.editableState)
  }

  get systemNumber() {
    return this.vehicleTechRecord!.systemNumber;
  }

  submitTechRecord() {
    if (this.hasProvisional) {
      if (this.isCurrent) {
        this.store.dispatch(putUpdateTechRecords({ systemNumber: this.systemNumber, oldStatusCode: StatusCodes.PROVISIONAL}));
        this.toggleEditMode()
        return;
      }
      this.store.dispatch(putUpdateTechRecords({ systemNumber: this.systemNumber}));
      this.toggleEditMode()
      return;
    }
    this.store.dispatch(postProvisionalTechRecord({ systemNumber: this.systemNumber }))
    this.toggleEditMode()
  }
}
