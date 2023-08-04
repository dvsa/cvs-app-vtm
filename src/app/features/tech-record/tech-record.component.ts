import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Roles } from '@models/roles.enum';
import { V3TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { getTechRecordV3, selectTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html'
})
export class TechRecordComponent {
  vehicle$: Observable<V3TechRecordModel | undefined>;
  systemNumber?: string;
  createdTimestamp?: string;

  constructor(
    private techRecordService: TechnicalRecordService,
    private router: Router,
    public errorService: GlobalErrorService,
    private store: Store<TechnicalRecordServiceState>,
    private route: ActivatedRoute
  ) {
    this.vehicle$ = this.store.select(selectTechRecord);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.params.pipe(take(1)).subscribe(params => {
      this.systemNumber = params['systemNumber'];
      this.createdTimestamp = params['createdTimestamp'];
    });
  }

  get roles() {
    return Roles;
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
}
