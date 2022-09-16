import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() techRecord?: TechRecordModel;
  @Input() editableState = false;
  isArchived?: boolean;
  anyArchived?: boolean;

  @Output() editableStateChange = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit() {
    this.isArchived = this.techRecord?.statusCode === StatusCodes.ARCHIVED;
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
    this.editableStateChange.emit(this.editableState)
  }
}
