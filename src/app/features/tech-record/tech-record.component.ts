import { Component } from '@angular/core';
import { SpinnerService } from '@core/components/spinner/spinner.service';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Roles } from '@models/roles.enum'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html',
  styleUrls: ['./tech-record.component.scss']
})
export class TechRecordComponent {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  constructor(public spinnerService: SpinnerService, private techrecordService: TechnicalRecordService) {
    this.vehicleTechRecord$ = this.techrecordService.selectedVehicleTechRecord$;
  }

  public get Roles() {
    return Roles;
  }
}
