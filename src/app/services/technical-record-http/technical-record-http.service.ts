import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PostNewVehicleModel,
  PutVehicleTechRecordModel,
  SearchResult,
  StatusCodes,
  TechRecordModel,
  VehicleTechRecordModel
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { getByAll, getByPartialVin, getByTrailerId, getByVin, getByVrm } from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SEARCH_TYPES {
  VIN = 'vin',
  PARTIAL_VIN = 'partialVin',
  VRM = 'vrm',
  TRAILER_ID = 'trailerId',
  SYSTEM_NUMBER = 'systemNumber',
  ALL = 'all'
}

@Injectable({ providedIn: 'root' })
export class TechnicalRecordHttpService {
  constructor(private http: HttpClient, private store: Store) {}

  searchBy(type: SEARCH_TYPES, term: string): void {
    switch (type) {
      case SEARCH_TYPES.VIN:
        this.store.dispatch(getByVin({ [type]: term }));
        break;
      case SEARCH_TYPES.PARTIAL_VIN:
        this.store.dispatch(getByPartialVin({ [type]: term }));
        break;
      case SEARCH_TYPES.VRM:
        this.store.dispatch(getByVrm({ [type]: term }));
        break;
      case SEARCH_TYPES.TRAILER_ID:
        this.store.dispatch(getByTrailerId({ [type]: term }));
        break;
      case SEARCH_TYPES.ALL:
        this.store.dispatch(getByAll({ [type]: term }));
        break;
    }
  }

  getByVin(vin: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(vin, SEARCH_TYPES.VIN);
  }

  getByPartialVin(partialVin: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(partialVin, SEARCH_TYPES.PARTIAL_VIN);
  }

  getByVrm(vrm: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(vrm, SEARCH_TYPES.VRM);
  }

  getByTrailerId(id: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(id, SEARCH_TYPES.TRAILER_ID);
  }

  getBySystemNumber(systemNumber: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(systemNumber, SEARCH_TYPES.SYSTEM_NUMBER);
  }

  getByAll(term: string): Observable<SearchResult[]> {
    return this.getTechRecordModels(term, SEARCH_TYPES.ALL);
  }

  getTechRecordModels(id: string, type: SEARCH_TYPES): Observable<SearchResult[]> {
    const queryStr = `${id}?searchCriteria=${type}`;
    const url = `${environment.VTM_API_URI}/v3/technical-records/search/${queryStr}`;

    return this.http.get<SearchResult[]>(url, { responseType: 'json' });
  }

  createVehicleRecord(newVehicleRecord: VehicleTechRecordModel, user: { id?: string; name: string }): Observable<PostNewVehicleModel> {
    const recordCopy = cloneDeep(newVehicleRecord);

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      vin: recordCopy.vin,
      primaryVrm: recordCopy.vrms ? recordCopy.vrms[0].vrm : null,
      trailerId: recordCopy.trailerId ?? null,
      techRecord: recordCopy.techRecord
    };

    return this.http.post<PostNewVehicleModel>(`${environment.VTM_API_URI}/vehicles`, body);
  }

  createProvisionalTechRecord(
    systemNumber: string,
    techRecord: TechRecordModel,
    user: { id?: string; name: string }
  ): Observable<VehicleTechRecordModel> {
    // THIS ALLOWS US TO CREATE PROVISIONAL FROM THE CURRENT TECH RECORD
    const recordCopy = cloneDeep(techRecord);
    recordCopy.statusCode = StatusCodes.PROVISIONAL;
    delete recordCopy.updateType;

    const url = `${environment.VTM_API_URI}/vehicles/add-provisional/${systemNumber}`;

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [recordCopy]
    };

    return this.http.post<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  updateTechRecords(
    systemNumber: string,
    vehicleTechRecord: VehicleTechRecordModel,
    user: { id?: string; name: string },
    recordToArchiveStatus?: StatusCodes,
    newStatus?: StatusCodes
  ): Observable<PutVehicleTechRecordModel> {
    const newVehicleTechRecord = cloneDeep(vehicleTechRecord);

    const newTechRecord = newVehicleTechRecord.techRecord[0];

    newTechRecord.statusCode = newStatus ?? newTechRecord.statusCode;
    delete newTechRecord.updateType;

    const url = `${environment.VTM_API_URI}/vehicles/${systemNumber}` + `${recordToArchiveStatus ? '?oldStatusCode=' + recordToArchiveStatus : ''}`;

    const body: PutVehicleTechRecordModel & { msUserDetails: { msOid: string | undefined; msUser: string } } = {
      ...this.formatVrmsForUpdatePayload(vehicleTechRecord),
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [newTechRecord]
    };

    return this.http.put<PutVehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  private formatVrmsForUpdatePayload(vehicleTechRecord: VehicleTechRecordModel): PutVehicleTechRecordModel {
    const secondaryVrms: string[] = [];
    const putVehicleTechRecordModel: PutVehicleTechRecordModel = { ...vehicleTechRecord, secondaryVrms };
    vehicleTechRecord.vrms.forEach(vrm => {
      vrm.isPrimary ? (putVehicleTechRecordModel.primaryVrm = vrm.vrm) : putVehicleTechRecordModel.secondaryVrms!.push(vrm.vrm);
    });
    delete (putVehicleTechRecordModel as any).vrms;
    return putVehicleTechRecordModel;
  }

  archiveTechnicalRecord(
    systemNumber: string,
    techRecord: TechRecordModel,
    reason: string,
    user: { id?: string; name: string }
  ): Observable<VehicleTechRecordModel> {
    const url = `${environment.VTM_API_URI}/vehicles/archive/${systemNumber}`;

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [techRecord],
      reasonForArchiving: reason
    };

    return this.http.put<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  generatePlate(
    vehicleRecord: VehicleTechRecordModel,
    techRecord: TechRecordModel,
    reason: string,
    user: { id?: string; name?: string; email?: string }
  ) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/plate`;

    const updatedVehicleRecord = cloneDeep(vehicleRecord);
    const currentRecordIndex = updatedVehicleRecord.techRecord.findIndex(techRecord => techRecord.statusCode === StatusCodes.CURRENT);
    updatedVehicleRecord.techRecord[currentRecordIndex].axles?.sort((a, b) => a.axleNumber! - b.axleNumber!);

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
    techRecord: TechRecordModel,
    letterType: string,
    paragraphId: number,
    user: { id?: string; name?: string; email?: string }
  ) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/letter`;

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
