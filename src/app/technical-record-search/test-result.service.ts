import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfig} from '@app/app.config';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {
  protected apiServer = AppConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient) {
    this.routes = {
      testResults: (searchIdentifier: string) => `${this.apiServer.APITestResultServerUri}/test-results/${searchIdentifier}`,
    };
  }

  getTestResults(searchIdentifier: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.testResults(searchIdentifier), {headers});
  }
}
