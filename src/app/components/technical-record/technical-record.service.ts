import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { environment } from '../../../environments/environment';

const routes = {
  techRecords: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records`,
  techRecordsAllStatuses: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class TechnicalRecordService {
  private jwttoken: string;
  private readonly tokenSubscription: any;

  constructor(private httpClient: HttpClient, private adalSvc: MsAdalAngular6Service) {
    this.tokenSubscription = this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
      this.jwttoken = token;
    });
  }

  getTechnicalRecords(searchIdentifier: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Authorization', `Bearer ${this.jwttoken}`);
    return this.httpClient.get<any[]>(routes.techRecords(searchIdentifier), { headers });
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Authorization', `Bearer ${this.jwttoken}`);
    return this.httpClient.get<any[]>(routes.techRecordsAllStatuses(searchIdentifier), { headers });
  }

  uploadDocuments() {

  }
}
