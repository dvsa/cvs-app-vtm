import { Component, OnChanges } from '@angular/core';
import { SpinnerService } from '@core/components/spinner/spinner.service';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Roles } from '@models/roles.enum'

import { Observable } from 'rxjs';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html',
  styleUrls: ['./tech-record.component.scss']
})
export class TechRecordComponent implements OnChanges {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  constructor(public spinnerService: SpinnerService, private techrecordService: TechnicalRecordService,  private router: Router, public errorService: GlobalErrorService) {
    this.vehicleTechRecord$ = this.techrecordService.selectedVehicleTechRecord$;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public get Roles() {
    return Roles;
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
}
