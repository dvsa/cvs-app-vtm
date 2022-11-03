import { Injectable } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { fetchReasonsForAbandoning } from '@store/reference-data';
import { testResultInEdit } from '@store/test-records';
import { fetchTestStations, TestStationsState } from '@store/test-stations';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MultiOptionsService {
  constructor(
    private referenceDataService: ReferenceDataService,
    private store: Store<TestStationsState>,
    private testStationsService: TestStationsService
  ) {}

  getOptions(referenceData: ReferenceDataResourceType | SpecialRefData): Observable<MultiOptions> {
    switch (referenceData) {
      case SpecialRefData.TEST_STATION_P_NUMBER:
        return this.testStationsService.getTestStationsOptions();
      case SpecialRefData.ReasonsForAbandoning:
        return this.store.pipe(
          select(testResultInEdit),
          switchMap(testResult => this.referenceDataService.getReasonsForAbandoning(testResult?.vehicleType))
        );
      default:
        return this.referenceDataService.getReferenceDataOptions(referenceData);
    }
  }

  loadOptions(referenceData: ReferenceDataResourceType | SpecialRefData): void {
    switch (referenceData) {
      case SpecialRefData.TEST_STATION_P_NUMBER:
        this.store.dispatch(fetchTestStations());
        break;
      case SpecialRefData.ReasonsForAbandoning:
        this.store.dispatch(fetchReasonsForAbandoning());
        break;
      default:
        this.referenceDataService.loadReferenceData(referenceData);
        break;
    }
  }
}

export enum SpecialRefData {
  TEST_STATION_P_NUMBER = 'testStationPNumber',
  ReasonsForAbandoning = 'REASONS_FOR_ABANDONING'
}
