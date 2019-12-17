import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
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
      downloadDocument: (vin: string) => `${this.apiServer.APIDocumentsServerUri}/vehicles/${vin}/download-file`
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }

  downloadDocument(vin: string, fileName: string): Observable<any> {
    console.log(`downloadDocument route => ${JSON.stringify(this.routes.downloadDocument(vin))}`);
    return this.httpClient.get(this.routes.downloadDocument(vin), {
      params: {
        filename: fileName
      },
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map(response => {
        return {
          fileName: fileName,
          blob: response.body
        }
      })
    );
  }
}
