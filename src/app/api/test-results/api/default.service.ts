/**
 * Test Results Microservice
 * This is the API spec for capturing test results. These test result will be stored in the AWS DynamoDB database. Authorization details will be updated once we have confirmed the security scheme we are using.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams,
  HttpResponse, HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { CompleteTestResults } from '../model/completeTestResults';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class DefaultService {
  protected basePath = 'https://url/api/v1';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    // eslint-disable-next-line no-restricted-syntax
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
     * Submitting a new test records
     *
     * @param body Post the test results
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
  public testResultsPost(body: CompleteTestResults, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public testResultsPost(body: CompleteTestResults, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public testResultsPost(body: CompleteTestResults, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public testResultsPost(body: CompleteTestResults, observe: any = 'body', reportProgress = false): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling testResultsPost.');
    }

    let headers = this.defaultHeaders;

    // authentication (OAuth2) required
    if (this.configuration.accessToken) {
      const accessToken = typeof this.configuration.accessToken === 'function'
        ? this.configuration.accessToken()
        : this.configuration.accessToken;
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json',
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'post',
      `${this.basePath}/test-results`,
      {
        body,
        withCredentials: this.configuration.withCredentials,
        headers,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        observe,
        reportProgress,
      },
    );
  }
}
