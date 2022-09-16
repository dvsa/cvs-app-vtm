import { Component, Input, OnInit } from '@angular/core';
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
  editableState = false;
  isArchived?: boolean;
  hasProvisional?: boolean;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isArchived = this.techRecord?.statusCode === StatusCodes.ARCHIVED ? true : false;
    this.hasProvisional = this.vehicleTechRecord?.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
  }

  submitTechRecord() {
    const systemNumber = this.vehicleTechRecord!.systemNumber
    if (this.hasProvisional) {
      console.log('ammend me');
      // Call the put endpoint here with system number, the old status code (which is the current one) and the tech record data
      this.store.dispatch(putUpdateTechRecords({ systemNumber: systemNumber}));
    } else {
      this.store.dispatch(putUpdateTechRecords({ systemNumber: systemNumber}));
      //Call the post route to add a provisional record with system number and tech record data
    }
  }
}
