import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { switchMap, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  protected apiServer = AppConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient) {
    this.routes = {
      techRecords: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records`,
      techRecordsAllStatuses: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
      getDocumentBlob: (vin: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`,
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    console.log(`getTechnicalRecordsAllStatuses url => ${this.routes.techRecordsAllStatuses(searchIdentifier)}`);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  getDocumentBlob(vin: string, fileName: string): Observable<{ buffer: ArrayBuffer, fileName?: string }> {
    console.log(`getDocumentBlob vin => ${this.routes.getDocumentBlob(vin)}`);
    return this.httpClient.get<{type: string , data: Array<number>}>(this.routes.getDocumentBlob(vin), {
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
