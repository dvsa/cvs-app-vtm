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

  getBySystemNumber(systemNumber: string, searchCriteria: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${systemNumber}?searchCriteria=${searchCriteria}`;
    const url = `${environment.VTM_API_URI}/v3/technical-records/search/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  getRecordV3(systemNumber: string, createdTimestamp: string): Observable<VehicleTechRecordModel[]> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  createVehicleRecord(newVehicleRecord: V3TechRecordModel): Observable<PostNewVehicleModel> {
    const recordCopy: TechRecordPUT = cloneDeep(newVehicleRecord);

    const body = {
      ...recordCopy
    };

    return this.http.post<PostNewVehicleModel>(`${environment.VTM_API_URI}/v3/technical-records`, body);
  }

  createProvisionalTechRecord(techRecord: V3TechRecordModel): Observable<VehicleTechRecordModel> {
    // THIS ALLOWS US TO CREATE PROVISIONAL FROM THE CURRENT TECH RECORD
    const recordCopy = cloneDeep(techRecord);
    recordCopy.techRecord_statusCode = StatusCodes.PROVISIONAL;
    delete recordCopy.techRecord_updateType;

    const url = `${environment.VTM_API_URI}/vehicles/add-provisional/${techRecord.systemNumber}`;

    const body = {
      techRecord: [recordCopy]
    };

    return this.http.patch<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }
  // TODO: does this undefined need to be here?
  updateTechRecords(techRecord: V3TechRecordModel | undefined): Observable<PutVehicleTechRecordModel | undefined> {
    console.log(techRecord);
    const body = { ...techRecord };
    if (techRecord) {
      const url = `${environment.VTM_API_URI}/v3/technical-records/${techRecord.systemNumber}/${techRecord.createdTimestamp}`;

      return this.http.patch<PutVehicleTechRecordModel>(url, body, { responseType: 'json' });
    }
    return of(undefined);
  }

  amendVrm(
    newVrm: string,
    cherishedTransfer: boolean,
    systemNumber: string,
    createdTimestamp: string
  ): Observable<PutVehicleTechRecordModel | undefined> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/updateVrm/${systemNumber}/${createdTimestamp}`;
    const body = {
      newVrm,
      isCherishedTransfer: cherishedTransfer
    };
    return this.http.patch<PutVehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  archiveTechnicalRecord(systemNumber: string, createdTimestamp: string, reasonForArchiving: string): Observable<VehicleTechRecordModel> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/archive/${systemNumber}/${createdTimestamp}`;

    const body = { reasonForArchiving };

    return this.http.put<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  promoteTechnicalRecord(systemNumber: string, createdTimestamp: string, reasonForPromoting: string): Observable<VehicleTechRecordModel> {
    const url = `${environment.VTM_API_URI}/v3/technical-records/promote/${systemNumber}/${createdTimestamp}`;

    const body = { reasonForPromoting };

    return this.http.patch<VehicleTechRecordModel>(url, body, { responseType: 'json' });
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

  updateVin(newVin: string, systemNumber: string, user: { id?: string; name?: string }) {
    const url = `${environment.VTM_API_URI}/vehicles/update-vin/${systemNumber}`;
    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      newVin
    };
    return this.http.put(url, body, { responseType: 'json' });
  }
}
