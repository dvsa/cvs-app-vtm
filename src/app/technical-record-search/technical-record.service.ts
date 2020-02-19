import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';

import { AppConfig } from '@app/app.config';
import { delayedRetry } from '@app/shared/delayed-retry/delayed-retry';
import { IAppState } from '@app/store/state/app.state';
import { LoadingTrue, LoadingFalse } from '@app/store/actions/Loader.actions';
import { DocumentInfo } from '@app/models/document-meta-data';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { VehicleTechRecordUpdate } from '@app/models/vehicle-tech-record-update';

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
      techRecordsAllStatuses: (searchIdentifier: string, searchCriteria: string) =>
        `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,

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

  updateTechnicalRecords(
    techRecordDto: VehicleTechRecordUpdate,
    vin: string
  ): Observable<VehicleTechRecordModel> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    this._store.dispatch(new LoadingTrue());

    return this.httpClient
      .put<any[]>(this.routes.updateTechRecords(vin), techRecordDto, { headers })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  uploadDocument(params: DocumentInfo) {
    const { metaName, file } = params;
    const fileData = new FormData();
    fileData.append(metaName, file);
    const headers = new HttpHeaders().set('Content-Type', 'application/pdf');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .put(`${this._apiServer.APIDocumentBlobUri}${metaName}`, fileData, { headers })
      .toPromise()
      .catch((error) => error)
      .finally(() => this._store.dispatch(new LoadingFalse()));
  }

  downloadDocument(params: DocumentInfo) {
    const { metaName } = params;
    const headers = new HttpHeaders().set('Accept', '*/*');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get(`${this._apiServer.APIDocumentBlobUri}${metaName}`, {
        headers,
        responseType: 'arraybuffer'
      })
      .toPromise()
      .then((response: ArrayBuffer) => {
        return new Blob([response], { type: 'application/pdf' });
      })
      .catch((error) => error)
      .finally(() => this._store.dispatch(new LoadingFalse()));
  }
}
