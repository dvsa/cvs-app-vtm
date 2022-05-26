import { Component, OnDestroy } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from '../../layout/spinner/spinner.service';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html',
  styleUrls: ['./tech-record.component.scss']
})
export class TechRecordComponent implements OnDestroy {

  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;
  ngDestroy$ = new Subject();

  constructor(private technicalRecordService: TechnicalRecordService, private store: Store, public spinnerService: SpinnerService) {
    this.store.pipe(select(selectRouteNestedParams)).pipe(takeUntil(this.ngDestroy$)).subscribe((params) => {
      const vin = params['vin'];
      if (vin) {
        this.technicalRecordService.searchBy({ type: 'vin', searchTerm: vin });
      }
    });
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;
  }

  ngOnDestroy() {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

}
