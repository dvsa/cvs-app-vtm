import { Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

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

  constructor(private techrecordService: TechnicalRecordService) {}

  ngOnInit() {
    this.isArchived = this.techRecord?.statusCode === StatusCodes.ARCHIVED ? true : false;
    this.hasProvisional = this.vehicleTechRecord?.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
  }

  submitTechRecord() {
    if (this.hasProvisional) {
      console.log('ammend me');
      // Call the put endpoint here with system number, the old status code (which is the current one) and the tech record data
      this.techrecordService.putUpdateTechRecords(this.vehicleTechRecord!.systemNumber, this.techRecord!);
    } else {
      console.log('create me');
      this.techrecordService.putUpdateTechRecords(this.vehicleTechRecord!.systemNumber, this.techRecord!);
      //Call the post route to add a provisional record with system number and tech record data
    }
  }
}
