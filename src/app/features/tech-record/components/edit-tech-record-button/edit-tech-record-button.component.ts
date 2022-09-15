import { Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() techRecord?: TechRecordModel;
  editableState = false;
  isArchived?: boolean;
  anyArchived?: boolean;

  constructor() {}

  ngOnInit() {
    this.isArchived = this.techRecord?.statusCode === StatusCodes.ARCHIVED ? true : false;
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
  }
}
