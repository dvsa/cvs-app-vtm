import { Component, Input, OnInit } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html',
  styleUrls: ['./hydrate-new-vehicle-record.component.scss']
})
export class HydrateNewVehicleRecordComponent implements OnInit {
  @Input() vehicle?: Partial<VehicleTechRecordModel>;

  constructor() {}

  ngOnInit(): void {
    console.log('bleh');
  }
}
