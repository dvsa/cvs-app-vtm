import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Observable, of } from 'rxjs';
import { switchMap, tap, shareReplay, catchError, finalize } from 'rxjs/operators';
import { delayedRetry } from '@app/shared/delayed-retry/delayed-retry';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { LoadingTrue, LoadingFalse } from '@app/store/actions/Loader.actions';
import { DocumentInfo } from '@app/models/document-meta-data';
import {VehicleTechRecordModel} from '@app/models/vehicle-tech-record.model';


@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient,
    private _appConfig: AppConfig,
    private _store: Store<IAppState>) {
    this.routes = {
      techRecordsAllStatuses: (searchIdentifier: string) => `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
      getDocumentBlob: (vin: string) => `${this._apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`,
      updateTechRecords: (vin: string) => `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${vin}`,
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string, searchCriteria: string): Observable<VehicleTechRecordModel[]> {
    console.log(`getTechnicalRecordsAllStatuses url => ${this.routes.techRecordsAllStatuses(searchIdentifier, searchCriteria)}`);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient.get<VehicleTechRecordModel[]>(this.routes.techRecordsAllStatuses(searchIdentifier, searchCriteria), {headers}).pipe(
      delayedRetry(),
      shareReplay(),
      finalize(() => this._store.dispatch(new LoadingFalse()))
    );
  }

  updateTechnicalRecords(techRecordDto: any, vin: string): Observable<any> {
    console.log(`updateTechRecords url => ${this.routes.updateTechRecords(vin)}`);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient.put<any[]>(this.routes.updateTechRecords(vin), techRecordDto, {headers}).pipe(
      delayedRetry(),
      shareReplay(),
      finalize(() => this._store.dispatch(new LoadingFalse()))
    );
  }

  //#region TO BE DELETED ONCE ADR UPLOAD/DOWNLOAD SUCCESSFUL*****************

  // uploadDocuments(submitData: any): Observable<any> {
  //   console.log(`inside uploadDocuments received submiData => ${JSON.stringify(submitData)}`);
  //   return of<any>("succeeded");
  // }

  getDocumentBlob(vin: string, fileName: string): Observable<{ buffer: ArrayBuffer, contentType: string, fileName?: string }> {
    console.log(`getDocumentBlob vin => ${this.routes.getDocumentBlob(vin)}`);
    this._store.dispatch(new LoadingTrue());
    return this.httpClient.get<{
      fileBuffer: {
        type: string,
        data: Array<number>
      },
      contentType: string
    }>(this.routes.getDocumentBlob(vin), {params: {filename: fileName}, responseType: 'json'}).pipe(
      switchMap(response => {
        const ab = new ArrayBuffer(response.fileBuffer.data.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < response.fileBuffer.data.length; i++) {
          view[i] = response.fileBuffer.data[i];
        }
        return of({buffer: ab, contentType: response.contentType, fileName: fileName});
      }),
      tap(_ => console.log(`getDocumentBlob => ${JSON.stringify(_)}`)),
      delayedRetry(),
      shareReplay(),
      finalize(() => this._store.dispatch(new LoadingFalse()))
    );
  }
  //#endregion

  uploadDocument(params: DocumentInfo) {
    const { metaName, file } = params;
    const fileData = new FormData();
    fileData.append(metaName, file);
    const headers = new HttpHeaders().set('Content-Type', 'application/pdf');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient.put(
      `${this._apiServer.APIDocumentBlobUri}${metaName}`,
      fileData,
      { headers }
    ).toPromise().finally(() => this._store.dispatch(new LoadingFalse()));
  }

  downloadDocument(params: DocumentInfo) {
    const { metaName } = params;
    const headers = new HttpHeaders().set('Accept', '*/*');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient.get(
      `${this._apiServer.APIDocumentBlobUri}${metaName}`,
      { headers, responseType: 'arraybuffer' }
    ).toPromise().then((response: ArrayBuffer) => {
      return new Blob([response], { type: 'application/pdf' });
    })
      .catch((error) => error)
      .finally(() => this._store.dispatch(new LoadingFalse()));
  }

  // uploadDocument(params: DocumentInfo) {
  //   const { metaName, file } = params;
  //   const fileData = new FormData();
  //   fileData.append(metaName, file);
  //   const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
  //
  //   this._store.dispatch(new LoadingTrue());
  //
  //   return this.httpClient.put(
  //     `${this._apiServer.APIDocumentBlobUri}${metaName}`,
  //     fileData,
  //     { headers }
  //   ).toPromise().finally(() => this._store.dispatch(new LoadingFalse()));
  // }
  //
  // downloadDocument(params: DocumentInfo) {
  //   const { metaName } = params;
  //   const headers = new HttpHeaders().set('Content-Type', 'application/pdf');
  //
  //   this._store.dispatch(new LoadingTrue());
  //
  //   return this.httpClient.get(
  //     `${this._apiServer.APIDocumentBlobUri}${metaName}`
  //   ).toPromise().then((response: Blob) => {
  //     return new Blob([response], { type: 'application/pdf' });
  //   })
  //   .catch((error) => error)
  //   .finally(() => this._store.dispatch(new LoadingFalse()))
  // }


}
