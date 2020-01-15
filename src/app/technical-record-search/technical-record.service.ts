import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient,
    private _appConfig: AppConfig) {
    this.routes = {
      techRecords: (searchIdentifier: string) => `${this._apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records`,
      techRecordsAllStatuses:
        (searchIdentifier: string) => `${this._apiServer.APITechnicalRecordServerUri}
        /vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
      getDocumentBlob: (vin: string) => `${this._apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`,
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    console.log(`getTechnicalRecordsAllStatuses url => ${this.routes.techRecordsAllStatuses(searchIdentifier)}`);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments(): Observable<any>   {
    console.log(`inside uploadDocuments`);
    return of<any>("succeeded");
  }

  getDocumentBlob(vin: string, fileName: string): Observable<{ buffer: ArrayBuffer, fileName?: string }> {
    console.log(`getDocumentBlob vin => ${this.routes.getDocumentBlob(vin)}`);
    return this.httpClient.get<{ type: string, data: Array<number> }>(this.routes.getDocumentBlob(vin), {
      params: { filename: fileName }, responseType: 'json'
    }).pipe(
      switchMap(response => {
        const ab = new ArrayBuffer(response.data.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < response.data.length; i++) {
          view[i] = response.data[i];
        }
        return of({ buffer: ab, fileName: fileName });
      }),
      tap(_ => console.log(`getDocumentBlob => ${JSON.stringify(_)}`))
    );
  }
}
