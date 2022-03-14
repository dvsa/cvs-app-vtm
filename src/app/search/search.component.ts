import { Component, OnInit } from '@angular/core';
import { TechRecord } from '../models/tech-record.model';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import { TechnicalRecordService } from '../services/technical-record.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchError: string = '';
  vehicleTechRecord?: VehicleTechRecordModel;
  techRecord?: TechRecord;

  // isLoading: boolean = false;
  // searchTerm: SearchParams = { searchIdentifier: '{none searched}', searchCriteria: 'all' };
  // searchError: Observable<string[]>;

  constructor(private technicalRecordService: TechnicalRecordService) { }
  // constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    // this.searchError = this.store.select(getErrors);
  }

  public searchTechRecords(searchTerm: string) {
    this.technicalRecordService.getByVIN(searchTerm)
      .subscribe((data: VehicleTechRecordModel[]) => {
        if (data.length === 1) {
          this.vehicleTechRecord = data[0];
          if (this.vehicleTechRecord.techRecord.length > 0) {
            this.techRecord = this.vehicleTechRecord.techRecord[0];
          }
        };

        // TODO: handle zero or many.. when we have ngRx
      });
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
