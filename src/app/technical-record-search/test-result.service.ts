import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient,
    private _appConfig: AppConfig) {
    this.routes = {
      testResults: (searchIdentifier: string) => `${this._apiServer.APITestResultServerUri}/test-results/${searchIdentifier}`,
    };
  }

  getTestResults(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.testResults(searchIdentifier), { headers });
  }
}
