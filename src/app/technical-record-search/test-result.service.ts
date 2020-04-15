import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Observable } from 'rxjs';
import { delayedRetry } from '@app/shared/delayed-retry/delayed-retry';
import { shareReplay, finalize } from 'rxjs/operators';
import { IAppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { LoadingTrue, LoadingFalse } from '@app/store/actions/Loader.actions';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(private httpClient: HttpClient,
    private _store: Store<IAppState>,
    private _appConfig: AppConfig) {
    this.routes = {
      testResults: (searchIdentifier: string) => `${this._apiServer.APITestResultServerUri}/test-results/${searchIdentifier}`,
    };
  }

  getTestResults(searchIdentifier: string): Observable<any> {
    this._store.dispatch(new LoadingTrue());
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get<any[]>(this.routes.testResults(searchIdentifier), { headers }).pipe(
      delayedRetry(),
      shareReplay(),
      finalize(() => this._store.dispatch(new LoadingFalse()))
    );
  }
}
