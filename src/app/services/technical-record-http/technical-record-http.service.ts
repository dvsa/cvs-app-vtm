import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { fetchSearchResult } from '@store/tech-record-search/actions/tech-record-search.actions';
import { SearchResult } from '@store/tech-record-search/reducer/tech-record-search.reducer';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SEARCH_TYPES {
  VIN = 'vin',
  PARTIAL_VIN = 'partialVin',
  VRM = 'primaryVrm',
  TRAILER_ID = 'trailerId',
  SYSTEM_NUMBER = 'systemNumber',
  ALL = 'all'
}

@Injectable({ providedIn: 'root' })
export class TechnicalRecordHttpService {
  constructor(private http: HttpClient, private store: Store) {}

  search$(type: SEARCH_TYPES, term: string): Observable<SearchResult[]> {
    const queryStr = `${term}?searchCriteria=${type}`;
    const url = `${environment.VTM_API_URI}/v3/technical-records/search/${queryStr}`;

    return this.http.get<SearchResult[]>(url, { responseType: 'json' });
  }

  searchBy(type: SEARCH_TYPES | undefined, term: string): void {
    this.store.dispatch(fetchSearchResult({ searchBy: type, term }));
  }

  getBySystemNumber(systemNumber: string, searchCriteria: string): Observable<V3TechRecordModel[]> {
    const queryStr = `${systemNumber}?searchCriteria=${searchCriteria}`;
    const url = `${environment.VTM_API_URI}/v3/technical-records/search/${queryStr}`;

    return this.http.get<V3TechRecordModel[]>(url, { responseType: 'json' });
  }

  getRecordV3(systemNumber: string, createdTimestamp: string): Observable<V3TechRecordModel[]> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`;

    return this.http.get<V3TechRecordModel[]>(url, { responseType: 'json' });
  }

  createVehicleRecord(newVehicleRecord: V3TechRecordModel): Observable<TechRecordType<'get'>> {
    const recordCopy: TechRecordType<'put'> = cloneDeep(newVehicleRecord) as TechRecordType<'put'>;

    const body = {
      ...recordCopy
    };

    return this.http.post<TechRecordType<'get'>>(`${environment.VTM_API_URI}/v3/technical-records`, body);
  }

  updateTechRecords(techRecord: TechRecordType<'put'>): Observable<TechRecordType<'get'>> {
    const body = { ...techRecord } as TechRecordType<'get'>;

    const url = `${environment.VTM_API_URI}/v3/technical-records/${body.systemNumber}/${body.createdTimestamp}`;

    return this.http.patch<TechRecordType<'get'>>(url, body, { responseType: 'json' });
  }

  amendVrm(newVrm: string, cherishedTransfer: boolean, systemNumber: string, createdTimestamp: string): Observable<V3TechRecordModel | undefined> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/updateVrm/${systemNumber}/${createdTimestamp}`;
    const body = {
      newVrm,
      isCherishedTransfer: cherishedTransfer
    };
    return this.http.patch<V3TechRecordModel>(url, body, { responseType: 'json' });
  }

  archiveTechnicalRecord(systemNumber: string, createdTimestamp: string, reasonForArchiving: string): Observable<V3TechRecordModel> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/archive/${systemNumber}/${createdTimestamp}`;

    const body = { reasonForArchiving };

    return this.http.patch<V3TechRecordModel>(url, body, { responseType: 'json' });
  }

  promoteTechnicalRecord(systemNumber: string, createdTimestamp: string, reasonForPromoting: string): Observable<V3TechRecordModel> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/promote/${systemNumber}/${createdTimestamp}`;

    const body = { reasonForPromoting };

    return this.http.patch<V3TechRecordModel>(url, body, { responseType: 'json' });
  }

  //TODO: remove the anys
  generatePlate(vehicleRecord: TechRecordType<'get'>, reason: string, user: { name?: string; email?: string }) {
    const url = `${environment.VTM_API_URI}/v3/technical-records/plate/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`;

    const body = {
      reasonForCreation: reason,
      vtmUsername: user.name,
      recipientEmailAddress: (vehicleRecord as any)?.techRecord_applicantDetails_emailAddress ?? user.email
    };

    return this.http.post(url, body, { responseType: 'json' });
  }

  generateLetter(vehicleRecord: TechRecordType<'get'>, letterType: string, paragraphId: number, user: { name?: string; email?: string }) {
    const url = `${environment.VTM_API_URI}/v3/technical-records/letter/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`;

    const body = {
      vtmUsername: user.name,
      letterType: letterType,
      paragraphId: paragraphId,
      recipientEmailAddress: vehicleRecord.techRecord_applicantDetails_emailAddress
        ? (vehicleRecord as any).techRecord_applicantDetails_emailAddress
        : user.email
    };

    return this.http.post(url, body, { responseType: 'text' });
  }
}
