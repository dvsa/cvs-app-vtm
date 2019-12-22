import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  protected apiServer = AppConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient) {
    console.log(`TechnicalRecordService ctor apiServer => ${JSON.stringify(this.apiServer)}`);
    AppConfig.settings.apiServer.APIDocumentBlobUri = `https://cvs-nonprod-adr-pdfs.s3.eu-west-1.amazonaws.com/cvsb-9213`;
    this.routes = {
      techRecords: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records`,
      techRecordsAllStatuses: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
      getDocumentUrl: (vin: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`,
      downloadBlobUrl: (url: string) => `${this.apiServer.APIDocumentBlobUri}/${url}`
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    console.log(`getTechnicalRecordsAllStatuses url => ${this.routes.techRecordsAllStatuses(searchIdentifier)}`);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  getDocumentUrl(vin: string, fileName: string): Observable<{ blobUrl: string, fileName?: string }> {
    console.log(`getDocumentUrl vin => ${this.routes.getDocumentUrl(vin)}`);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.get<string>(this.routes.getDocumentUrl(vin), {
      params: { filename: fileName }, headers: headers, responseType: 'text' as 'json' }).pipe(
      switchMap(response => of({ blobUrl: response, fileName: fileName })),
      tap(_ => console.log(`getDocumentUrl => ${JSON.stringify(_)}`))
    );
  }

  downloadBlob(blobUrl: string, fileName: string): Observable<{ blob: Blob, fileName?: string }> {
    const url = blobUrl.split("cvsb-9213/").pop();
    console.log(`downloadBlobUrl splitted url => ${url}`);
    console.log(`downloadBlobUrl route => ${this.routes.downloadBlobUrl(url)}`);
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    headers.append('Access-Control-Allow-Origin', 'https://vtm.nonprod.cvs.dvsacloud.uk');
    headers.append('Access-Control-Allow-Credentials', 'true');
    return this.httpClient.get<Blob>(this.routes.downloadBlobUrl(url), { 
      headers: headers, observe: 'response', responseType: 'blob' as 'json' }).pipe(
      switchMap(response => of({ blob: response.body, fileName: fileName })));
  }
}
