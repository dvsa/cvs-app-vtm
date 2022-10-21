import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { DOCUMENT_RETRIEVAL_BASE_PATH } from '../variables';

@Injectable()
export class DocumentRetrievalService {
  protected basePath = 'https://url/api/v1';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(DOCUMENT_RETRIEVAL_BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * Submitting a new test records
   *
   * @param body Post the test results
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public testCertificateGet(testNumber?: string, vin?: string, observe?: 'body', reportProgress?: boolean): Observable<Blob> {
    // public testCertificateGet(testNumber?: string, vin?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
    // public testCertificateGet(testNumber?: string, vin?: string, observe?: 'events', reportProgress?: boolean);
    // public testCertificateGet(testNumber?: string, vin?: string, observe = 'body', reportProgress = false): Observable<Blob> {
    if (!vin) {
      throw new Error('Required parameter vin was null or undefined when calling testCertificateGet.');
    }
    if (!testNumber) {
      throw new Error('Required parameter testNumber was null or undefined when calling testCertificateGet.');
    }

    // Set query parameters
    let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (testNumber) {
      params = params.set('testNumber', <any>testNumber);
    }
    if (vin) {
      params = params.set('vinNumber', <any>vin);
    }

    let headers = this.defaultHeaders;

    // authentication (OAuth2) required
    if (this.configuration.accessToken) {
      const accessToken = typeof this.configuration.accessToken === 'function' ? this.configuration.accessToken() : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // api keys
    if (this.configuration.apiKeys) {
      for (const key in this.configuration.apiKeys) {
        headers = headers.set(key, this.configuration.apiKeys[key]);
      }
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/pdf'];
    // let httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    // const consumes: string[] = ['application/pdf; charset=utf-8'];
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    // return this.httpClient.get<Observable<Blob>>(`${this.basePath}/v1/document-retrieval`, {
    //   params: queryParameters,
    //   headers: headers,
    //   observe: observe,
    //   reportProgress: reportProgress,
    //   responseType: 'blob',
    //   withCredentials: this.configuration.withCredentials,
    // });
    /*
    {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
    }
     */
    return this.httpClient.get(`${this.basePath}/v1/document-retrieval`, {
      headers,
      observe,
      params,
      reportProgress,
      responseType: 'blob',
      withCredentials: this.configuration.withCredentials
    });
  }
}
