import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Configuration } from '../configuration';
import { ReferenceDataItem, ReferenceDataList } from '../model/reference-data.model';
import { BASE_PATH } from '../variables';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataApiService {
  protected basePath = 'https://url/api/v1';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  getAllFromResource(resourceType: string, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataList>;
  getAllFromResource(resourceType: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ReferenceDataList>>;
  getAllFromResource(resourceType: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ReferenceDataList>>;
  getAllFromResource(resourceType: string, observe: any = 'body', reportProgress?: boolean): Observable<any> {
    if (!resourceType) {
      console.log('*** EMPTY ***');
      return throwError(() => new Error('resourceType is required'));
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    return this.httpClient.get<ReferenceDataList>(`${this.basePath}/reference/${resourceType}`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  getOneFromResource(resourceType: string, resourceKey?: string, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataItem>;
  getOneFromResource(
    resourceType: string,
    resourceKey?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ReferenceDataItem>>;
  getOneFromResource(
    resourceType: string,
    resourceKey?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ReferenceDataItem>>;
  getOneFromResource(resourceType: string, resourceKey: string, observe: any = 'body', reportProgress?: boolean): Observable<any> {
    let headers = this.defaultHeaders;

    if (!resourceType) {
      return throwError(() => new Error('resourceType is required'));
    }

    if (!resourceKey) {
      return throwError(() => new Error('resourceKey is required'));
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    return this.httpClient.get<ReferenceDataItem>(`${this.basePath}/reference/${resourceType}/${resourceKey}`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}
