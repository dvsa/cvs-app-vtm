import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '@app/app.config';
import { map } from 'rxjs/operators';

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
      downloadDocument: (vin: string, filename: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file/${filename}}`
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  downloadDocument(vin: string, filename: string) : Observable<any> {
    console.log(`downloadDocument route => ${JSON.stringify(this.routes.downloadDocument(vin, filename))}`);
    return this.httpClient.get(this.routes.downloadDocument(vin, filename), {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map(response => {
        return {
          fileName: filename,
          blob: response.body
        }
      })
    );
  }
}
