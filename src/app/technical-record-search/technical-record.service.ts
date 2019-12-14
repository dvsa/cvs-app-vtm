import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AppConfig} from '@app/app.config';
import {TechRecordModel} from "@app/models/tech-record.model";

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
      // tslint:disable-next-line:max-line-length
      techRecordsAllStatuses: (searchIdentifier: string) => `${this.apiServer.APITechnicalRecordServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`,
    };
  }

  getTechnicalRecordsAllStatuses(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.techRecordsAllStatuses(searchIdentifier), {headers});
  }

  getActiveTechRecord(techRecordList: any) {
    if (techRecordList) {
      let records = techRecordList.find((record: any) => record.statusCode === 'current');
      if (records !== undefined) return records;

      records = techRecordList.find((record: any) => record.statusCode === 'provisional');
      if (records !== undefined) return records;

      records = techRecordList.filter((record: any) => record.statusCode === 'archived');
      records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      if (records !== undefined) return records[0];
    }
  }

}
