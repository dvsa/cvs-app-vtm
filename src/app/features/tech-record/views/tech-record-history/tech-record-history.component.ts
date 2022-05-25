import { Component, Input, OnInit } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() currentRecord?: TechRecordModel;

  sortedTechRecords: TechRecordModel[] = [];

  constructor() { }

  ngOnInit(): void {
    if(this.vehicleTechRecord){
      this.sortedTechRecords = [...this.vehicleTechRecord?.techRecord].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  convertToUnix(date: Date): number {
    return new Date(date).getTime()
  }

}
