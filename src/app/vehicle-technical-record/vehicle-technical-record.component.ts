import { Component, Input } from '@angular/core';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  constructor() {}

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find((vrm) => vrm.isPrimary)?.vrm;
  }
}
