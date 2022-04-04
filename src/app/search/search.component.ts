import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TechRecord } from '../models/tech-record.model';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import { getByVIN } from '../services/technical-record-service.actions';
import { vehicleTechRecord } from '../services/technical-record-service.reducer';
import { TechnicalRecordService } from '../services/technical-record.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchError: string | undefined;
  vehicleTechRecord: Observable<VehicleTechRecordModel | unknown>;
  techRecord?: TechRecord;

  constructor(private store: Store, private technicalRecordService: TechnicalRecordService) {
    this.vehicleTechRecord = this.store.pipe(select(vehicleTechRecord));

    this.vehicleTechRecord
      .subscribe((vehicleTechRecord: VehicleTechRecordModel | unknown) => {
        console.log('VehicleTechRecord subs: ', vehicleTechRecord);
        // if (vehicleTechRecord) {
        //   this.vehicleTechRecord
        // }
      });
  }

  public searchTechRecords(searchTerm: string) {
    this.searchError = undefined;
    if (searchTerm) {
      this.store.dispatch(getByVIN({ vin: searchTerm }));


    //   this.technicalRecordService.getByVIN(searchTerm)
    //   .subscribe((data: VehicleTechRecordModel[]) => {
    //     if (data.length === 1) {
    //       this.vehicleTechRecord = data[0];
    //       if (this.vehicleTechRecord.techRecord.length > 0) {
    //         this.techRecord = this.vehicleTechRecord.techRecord[0];
    //       }
    //     };
    //   });
    // } else {
    //   this.searchError = "Enter a vehicle registration mark, trailer ID or vehicle identification number"
    // }
    }
  }




  // public searchTechRecords(searchIdentifier: string, searchCriteria: string) {
    // this.isLoading = true;
    // this.searchParams.searchIdentifier = encodeURIComponent(searchIdentifier);

    // switch (searchCriteria) {
    //   case SEARCH_CRITERIA.VRM_CRITERIA:
    //     this.searchParams.searchCriteria = 'vrm';
    //     break;
    //   case SEARCH_CRITERIA.FULL_VIN_CRITERIA:
    //     this.searchParams.searchCriteria = 'vin';
    //     break;
    //   case SEARCH_CRITERIA.PARTIAL_VIN_CRITERIA:
    //     this.searchParams.searchCriteria = 'partialVin';
    //     break;
    //   case SEARCH_CRITERIA.TRL_CRITERIA:
    //     this.searchParams.searchCriteria = 'trailerId';
    //     break;
    //   case SEARCH_CRITERIA.ALL_CRITERIA:
    //   default:
    //     this.searchParams.searchCriteria = 'all';
    // }

    // this.store.dispatch(new GetVehicleTechRecordHavingStatusAll(this.searchTerm));
  // }
}
