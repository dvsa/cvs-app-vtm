import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { map, switchMap, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  protected apiServer = AppConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient) {
    console.log(`TechnicalRecordService ctor apiServer => ${JSON.stringify(this.apiServer)}`);
    this.routes = {
      techRecords: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records`,
      techRecordsAllStatuses: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
      getDocumentUrl: (vin: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  getDocumentUrl(vin: string, fileName: string): Observable<{ blobUrl: string, fileName?: string }> {
    console.log(`getDocumentUrl vin => ${JSON.stringify(this.routes.getDocumentUrl(vin))}`);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get<string>(this.routes.getDocumentUrl(vin), {
      params: {
        filename: fileName
      },
      headers: headers,
      responseType: 'text' as 'json'
    }).pipe(
      switchMap(response => of({ blobUrl: response, fileName: fileName })),
      tap(_ => console.log(`getDocumentUrl => ${_}`))
    );
  }

  downloadBlob(blobUrl: string, fileName: string): Observable<{ blob: Blob, fileName?: string }> {
    console.log(`downloadBlob route => ${blobUrl}`);
    return this.httpClient
      .get<Blob>(blobUrl, {
        observe: 'response',
        responseType: 'blob' as 'json'
      }).pipe(
        switchMap(res => of({
          blob: res.body,
          fileName: fileName
        })));
  }
}
