import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/app.config';
import { Observable } from 'rxjs';
import { delayedRetry } from '@app/shared/delayed-retry/delayed-retry';
import { shareReplay, finalize } from 'rxjs/operators';
import { IAppState } from '@app/store/state/app.state';
import { Store } from '@ngrx/store';
import { LoadingTrue, LoadingFalse } from '@app/store/actions/Loader.actions';
import { TestResultModel } from '@app/models/test-result.model';
import { Preparer } from '@app/models/preparer.ts';
import { TestStation } from '@app/models/test-station';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';
import { TestTypeCategory } from '@app/models/test-type-category';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {
  private _apiServer = this._appConfig.settings.apiServer;
  private readonly routes;

  constructor(
    private httpClient: HttpClient,
    private _store: Store<IAppState>,
    private _appConfig: AppConfig
  ) {
    this.routes = {
      testResults: (searchIdentifier: string) =>
        `${this._apiServer.APITestResultServerUri}/test-results/${searchIdentifier}`,
      preparers: () => `${this._apiServer.APIPreparersServerUri}/preparers`,
      testStation: () => `${this._apiServer.APITestStationsServerUri}/test-stations`,
      updateTestResults: (systemNumber: string) =>
        `${this._apiServer.APITestResultServerUri}/test-results/${systemNumber}`,
      testResultById: (systemNumber: string, testResultId: string) =>
        `${this._apiServer.APITestResultServerUri}/test-results/${systemNumber}?testResultId=${testResultId}&version=all`,
      testTypeCategories: () => `${this._apiServer.APITestTypesServerUri}/test-types`
    };
  }

  getTestResults(searchIdentifier: string): Observable<TestResultModel> {
    this._store.dispatch(new LoadingTrue());
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient
      .get<TestResultModel[]>(this.routes.testResults(searchIdentifier), { headers })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  getPreparers(): Observable<Preparer[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get<Preparer[]>(this.routes.preparers(), { headers })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  getTestStations(): Observable<TestStation[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get<TestStation[]>(this.routes.testStation(), { headers })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  updateTestResults(
    systemNumber: string,
    testResult: VehicleTestResultUpdate
  ): Observable<TestResultModel> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .put<TestResultModel>(this.routes.updateTestResults(systemNumber), testResult, {
        headers
      })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  getTestResultById(systemNumber: string, testResultId: string): Observable<TestResultModel> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get<TestResultModel>(this.routes.testResultById(systemNumber, testResultId), {
        headers
      })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }

  downloadCertificate(fileName: string) {
    const headers = new HttpHeaders().set('Accept', '*/*');
    return this.httpClient.get(`${this._apiServer.APICertificatesBlobUri}${fileName}`, {
      headers,
      responseType: 'arraybuffer'
    });
  }

  getTestTypeCategories(): Observable<TestTypeCategory[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this._store.dispatch(new LoadingTrue());
    return this.httpClient
      .get<TestTypeCategory[]>(this.routes.testTypeCategories(), { headers })
      .pipe(
        delayedRetry(),
        shareReplay(),
        finalize(() => this._store.dispatch(new LoadingFalse()))
      );
  }
}
