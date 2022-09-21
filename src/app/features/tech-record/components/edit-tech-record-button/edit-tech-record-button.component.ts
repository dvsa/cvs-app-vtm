import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { putUpdateTechRecords } from '@store/technical-records';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() techRecord?: TechRecordModel;
  @Input() editableState = false;
  @Input() isDirty: boolean = false;
  @Input() isInvalid: boolean = false;
  isArchived?: boolean;
  hasProvisional?: boolean;

  @Output() editableStateChange = new EventEmitter<boolean>()

  constructor(private store: Store) {}

  ngOnInit() {
    this.isArchived = this.techRecord?.statusCode === StatusCodes.ARCHIVED;
    this.hasProvisional = this.vehicleTechRecord?.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
    this.editableStateChange.emit(this.editableState)
  }

  submitTechRecord() {
      const systemNumber = this.vehicleTechRecord!.systemNumber
      this.hasProvisional ?
        //Amend Endpoint -> `archives old and sets new provisional
        this.store.dispatch(putUpdateTechRecords({ systemNumber: systemNumber })) :
        //Create Endpoint -> creates new provisional
        this.store.dispatch(putUpdateTechRecords({ systemNumber: systemNumber }));
  }
}
