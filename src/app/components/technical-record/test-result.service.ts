import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, tap, catchError} from 'rxjs/operators';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {environment} from '../../../environments/environment';

const routes = {
  testResults: (searchIdentifier: string) => `${environment.APITestResultServerUri}/test-results/${searchIdentifier}`,
};

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class TestResultService {
  private jwttoken: string;
  private readonly tokenSubscription: any;

  constructor(private httpClient: HttpClient, private adalSvc: MsAdalAngular6Service) {
    // console.log(this.adalSvc.userInfo);
    this.tokenSubscription = this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
      // console.log(token);
      this.jwttoken = token;
    });
  }

  getTestResults(searchIdentifier: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Authorization', `Bearer ${this.jwttoken}`);
    return this.httpClient.get<any[]>(routes.testResults(searchIdentifier), {headers});
  }
}
