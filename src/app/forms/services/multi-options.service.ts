import { Injectable } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { fetchTestStations, TestStationsState } from '@store/test-stations';
import { Observable } from 'rxjs';

@Injectable()
export class MultiOptionsService {
  constructor(
    private referenceDataService: ReferenceDataService,
    private store: Store<TestStationsState>,
    private testStationsService: TestStationsService
  ) {}

  getOptions(referenceData: ReferenceDataResourceType | SpecialRefData): Observable<MultiOptions> {
    if (referenceData === SpecialRefData.TEST_STATION_P_NUMBER) {
      return this.testStationsService.getTestStationsOptions();
    }
    return this.referenceDataService.getReferenceDataOptions(referenceData);
  }

  loadOptions(referenceData: ReferenceDataResourceType | SpecialRefData): void {
    switch (referenceData) {
      case SpecialRefData.TEST_STATION_P_NUMBER:
        this.store.dispatch(fetchTestStations());
        break;
      default:
        this.referenceDataService.loadReferenceData(referenceData);
        break;
    }
  }
}

export enum SpecialRefData {
  TEST_STATION_P_NUMBER = 'testStationPNumber'
}
