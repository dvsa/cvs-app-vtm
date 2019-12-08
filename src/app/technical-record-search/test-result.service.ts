import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';
import { environment } from '@environments/environment';

const routes = {
  testResults: (searchIdentifier: string) => `${environment.APITestResultServerUri}/test-results/${searchIdentifier}`,
};


@Injectable({
  providedIn: 'root'
})

export class TestResultService {
  private jwttoken: string;

  constructor(private httpClient: HttpClient, private adalSvc: MsAdalAngular6Service) {
  }

  getTestResults(searchIdentifier: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Authorization', `Bearer ${this.jwttoken}`);
    return this.httpClient.get<any[]>(routes.testResults(searchIdentifier), {headers});
  }
}
