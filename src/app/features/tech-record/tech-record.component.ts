import { Component } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../layout/spinner/spinner.service';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html',
  styleUrls: ['./tech-record.component.scss']
})
export class TechRecordComponent  {

  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  constructor(private technicalRecordService: TechnicalRecordService, private store: Store, public spinnerService: SpinnerService) {
    this.store.pipe(select(selectQueryParams)).subscribe((params) => {
      const vin = params['vin'] ?? '';
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm: vin });
    });
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;
  }


}
