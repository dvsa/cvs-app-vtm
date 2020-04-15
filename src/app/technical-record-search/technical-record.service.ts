import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';

import { AppConfig } from '@app/app.config';
import { delayedRetry } from '@app/shared/delayed-retry/delayed-retry';
import { IAppState } from '@app/store/state/app.state';
import { LoadingTrue, LoadingFalse } from '@app/store/actions/Loader.actions';
import { SetErrorMessage, ClearErrorMessage } from './../store/actions/Error.actions';
import { DocumentInfo, DocumentMetaData } from '@app/models/document-meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(
    private httpClient: HttpClient,
    private _appConfig: AppConfig,
    private _store: Store<IAppState>
  ) {
    this.routes = {
      techRecordsAllStatuses: (searchIdentifier: string, searchCriteria: string) => {
        const queryStr = `${searchIdentifier}/tech-records?status=all&metadata=true&searchCriteria=${searchCriteria}`;
        return `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${queryStr}`;
      },
      createTechRecord: () => `${this._apiServer.APITechnicalRecordServerUri}/vehicles`,
      updateTechRecords: (vin: string) =>
        `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${vin}`
    };
  }

  getTechnicalRecordsAllStatuses(
    searchIdentifier: string,
    searchCriteria: string
  ): Observable<VehicleTechRecordModel[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this._store.dispatch(new LoadingTrue());

    return this.httpClient
      .get<VehicleTechRecordModel[]>(
        this.routes.techRecordsAllStatuses(searchIdentifier, searchCriteria),
        { headers }
      )
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  createTechnicalRecord(techRecord: VehicleTechRecordEdit): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this._store.dispatch(new LoadingTrue());

    return this.httpClient
      .post<VehicleTechRecordEdit>(this.routes.createTechRecord(), techRecord, {
        headers
      })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  updateTechnicalRecords(
    techRecordDto: VehicleTechRecordEdit,
    systemNumber: string
  ): Observable<VehicleTechRecordModel> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this._store.dispatch(new LoadingTrue());

    return this.httpClient
      .put<VehicleTechRecordModel>(this.routes.updateTechRecords(systemNumber), techRecordDto, {
        headers
      })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  uploadDocument(params: DocumentInfo) {
    const { metaName, file } = params;
    const headers = new HttpHeaders().set('Content-Type', 'application/octet-stream');

    this._store.dispatch(new ClearErrorMessage());
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .put(`${this._apiServer.APIDocumentBlobUri}${metaName}`, file, { headers })
      .toPromise()
      .catch((error) => {
        this._store.dispatch(
          new SetErrorMessage([
            `The selected file ${file.name} could not be uploaded - try again`
          ])
        );
        return null;
      })
      .finally(() => this._store.dispatch(new LoadingFalse()));
  }

  downloadDocument(params: DocumentMetaData) {
    const { metaName, fileName } = params;
    const headers = new HttpHeaders().set('Accept', '*/*');

    this._store.dispatch(new ClearErrorMessage());
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get(`${this._apiServer.APIDocumentBlobUri}${metaName}`, {
        headers,
        responseType: 'arraybuffer'
      })
      .toPromise()
      .then((response: ArrayBuffer) => {
        return new Blob([response], { type: 'application/octet-stream' });
      })
      .catch((error) => {
        this._store.dispatch(
          new SetErrorMessage([
            `The selected file ${fileName} could not be downloaded - try again`
          ])
        );
        return null;
      })
      .finally(() => this._store.dispatch(new LoadingFalse()));
  }
}
