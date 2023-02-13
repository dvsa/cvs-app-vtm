import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Roles } from '@models/roles.enum';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html'
})
export class TechRecordComponent {
  vehicle$: Observable<VehicleTechRecordModel | undefined>;

  constructor(private techRecordService: TechnicalRecordService, private router: Router, public errorService: GlobalErrorService) {
    this.vehicle$ = this.techRecordService.selectedVehicleTechRecord$;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  get roles() {
    return Roles;
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
}
