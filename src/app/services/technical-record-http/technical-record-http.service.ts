import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PostNewVehicleModel,
  PutVehicleTechRecordModel,
  StatusCodes,
  TechRecordModel,
  V3TechRecordModel,
  VehicleTechRecordModel
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { fetchSearchResult } from '@store/tech-record-search/actions/tech-record-search.actions';
import { SearchResult } from '@store/tech-record-search/reducer/tech-record-search.reducer';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechRecordPUT } from '@api/vehicle';

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

  createVehicleRecord(newVehicleRecord: V3TechRecordModel): Observable<V3TechRecordModel> {
    const recordCopy: TechRecordPUT = cloneDeep(newVehicleRecord);

    const body = {
      ...recordCopy
    };

    return this.http.post<V3TechRecordModel>(`${environment.VTM_API_URI}/v3/technical-records`, body);
  }

  updateTechRecords(techRecord: V3TechRecordModel): Observable<V3TechRecordModel> {
    const body = { ...techRecord };

    const url = `${environment.VTM_API_URI}/v3/technical-records/${techRecord.systemNumber}/${techRecord.createdTimestamp}`;

    return this.http.patch<V3TechRecordModel>(url, body, { responseType: 'json' });
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

  generatePlate(vehicleRecord: VehicleTechRecordModel, reason: string, user: { id?: string; name?: string; email?: string }) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/plate`;

    const updatedVehicleRecord = cloneDeep(vehicleRecord);
    const currentRecordIndex = updatedVehicleRecord.techRecord.findIndex(techRecord => techRecord.statusCode === StatusCodes.CURRENT);
    updatedVehicleRecord.techRecord[currentRecordIndex].axles?.sort((a, b) => a.axleNumber! - b.axleNumber!);
    const techRecord = updatedVehicleRecord.techRecord[currentRecordIndex];

    const body = {
      vin: vehicleRecord.vin,
      primaryVrm: techRecord.vehicleType !== 'trl' ? vehicleRecord.vrms.find(x => x.isPrimary)?.vrm : undefined,
      systemNumber: vehicleRecord.systemNumber,
      trailerId: techRecord.vehicleType === 'trl' ? vehicleRecord.trailerId : undefined,
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: updatedVehicleRecord.techRecord,
      reasonForCreation: reason,
      vtmUsername: user.name,
      recipientEmailAddress: techRecord?.applicantDetails?.emailAddress ? techRecord.applicantDetails.emailAddress : user.email
    };

    return this.http.post(url, body, { responseType: 'json' });
  }

  generateLetter(
    vehicleRecord: VehicleTechRecordModel,
    letterType: string,
    paragraphId: number,
    user: { id?: string; name?: string; email?: string }
  ) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/letter`;

    const techRecord = vehicleRecord.techRecord.find(techRecord => techRecord.statusCode === StatusCodes.CURRENT);

    const body = {
      vin: vehicleRecord.vin,
      primaryVrm: undefined,
      systemNumber: vehicleRecord.systemNumber,
      trailerId: vehicleRecord.trailerId,
      techRecord: vehicleRecord.techRecord,
      vtmUsername: user.name,
      letterType: letterType,
      paragraphId: paragraphId,
      recipientEmailAddress: techRecord?.applicantDetails?.emailAddress ? techRecord.applicantDetails?.emailAddress : user.email
    };

    return this.http.post<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }
}
