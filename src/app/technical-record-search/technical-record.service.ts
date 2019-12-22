import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { map, switchMap, tap } from 'rxjs/operators';

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
      downloadDocument: (vin: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  downloadDocument(vin: string, fileName: string): Observable<{ blob: Blob, fileName?: string }> {
    console.log(`downloadDocument route => ${JSON.stringify(this.routes.downloadDocument(vin))}`);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get<string>(this.routes.downloadDocument(vin), {
      params: {
        filename: fileName
      },
      headers: headers,
      responseType: 'text' as 'json'
    }).pipe(
      // switchMap(response => of({ blob: response, fileName: fileName})),
      tap(_ => console.log(`downloadDocument => ${_}`)),
      switchMap(downloadURL =>
        this.httpClient
          .get<Blob>(downloadURL, {
            observe: 'response',
            responseType: 'blob' as 'json'
          }).pipe(
            switchMap(res => of({
              blob: res.body,
              fileName: fileName
            })))
      ));
  }
}
