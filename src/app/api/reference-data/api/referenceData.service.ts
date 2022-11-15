/**
 * Reference Data Microservice
 * This is the API spec for the reference data service. The reference data will be stored in a AWS DynamoDB database.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: test@test.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { DeleteItem } from '../model/deleteItem';
import { EmptyObject } from '../model/emptyObject';
import { ReferenceDataApiResponse } from '../model/referenceDataApiResponse';
import { ReferenceDataItemApiResponse } from '../model/referenceDataItemApiResponse';
import { ResourceKey } from '../model/resourceKey';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ReferenceDataService {

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
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Get reference data for a particular resourceType and resourceKey, allows partials.
     * 
     * @param resourceType 
     * @param resourceKey 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceLookupResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataApiResponse>;
    public referenceLookupResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ReferenceDataApiResponse>>;
    public referenceLookupResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ReferenceDataApiResponse>>;
    public referenceLookupResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling referenceLookupResourceTypeResourceKeyGet.');
        }

        if (resourceKey === null || resourceKey === undefined) {
            throw new Error('Required parameter resourceKey was null or undefined when calling referenceLookupResourceTypeResourceKeyGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ReferenceDataApiResponse>('get',`${this.basePath}/reference/lookup/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get reference data for a particular resourceType and resourceKey, allows partials.
     * 
     * @param searchKey 
     * @param param 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceLookupTyresSearchKeyParamGet(searchKey: string, param: string, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataApiResponse>;
    public referenceLookupTyresSearchKeyParamGet(searchKey: string, param: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ReferenceDataApiResponse>>;
    public referenceLookupTyresSearchKeyParamGet(searchKey: string, param: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ReferenceDataApiResponse>>;
    public referenceLookupTyresSearchKeyParamGet(searchKey: string, param: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (searchKey === null || searchKey === undefined) {
            throw new Error('Required parameter searchKey was null or undefined when calling referenceLookupTyresSearchKeyParamGet.');
        }

        if (param === null || param === undefined) {
            throw new Error('Required parameter param was null or undefined when calling referenceLookupTyresSearchKeyParamGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ReferenceDataApiResponse>('get',`${this.basePath}/reference/lookup/tyres/${encodeURIComponent(String(searchKey))}/${encodeURIComponent(String(param))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get reference data for a particular resourceType.
     * 
     * @param resourceType 
     * @param paginationToken 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceResourceTypeGet(resourceType: string, paginationToken?: string, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataApiResponse>;
    public referenceResourceTypeGet(resourceType: string, paginationToken?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ReferenceDataApiResponse>>;
    public referenceResourceTypeGet(resourceType: string, paginationToken?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ReferenceDataApiResponse>>;
    public referenceResourceTypeGet(resourceType: string, paginationToken?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling referenceResourceTypeGet.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (paginationToken !== undefined && paginationToken !== null) {
            queryParameters = queryParameters.set('paginationToken', <any>paginationToken);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ReferenceDataApiResponse>('get',`${this.basePath}/reference/${encodeURIComponent(String(resourceType))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete reference data for a particular resourceType and resourceKey.
     * 
     * @param resourceType 
     * @param resourceKey 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceResourceTypeResourceKeyDelete(resourceType: string, resourceKey: ResourceKey, observe?: 'body', reportProgress?: boolean): Observable<DeleteItem>;
    public referenceResourceTypeResourceKeyDelete(resourceType: string, resourceKey: ResourceKey, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<DeleteItem>>;
    public referenceResourceTypeResourceKeyDelete(resourceType: string, resourceKey: ResourceKey, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<DeleteItem>>;
    public referenceResourceTypeResourceKeyDelete(resourceType: string, resourceKey: ResourceKey, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyDelete.');
        }

        if (resourceKey === null || resourceKey === undefined) {
            throw new Error('Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyDelete.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<DeleteItem>('delete',`${this.basePath}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get reference data for a particular resourceType and resourceKey.
     * 
     * @param resourceType 
     * @param resourceKey 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'body', reportProgress?: boolean): Observable<ReferenceDataItemApiResponse>;
    public referenceResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ReferenceDataItemApiResponse>>;
    public referenceResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ReferenceDataItemApiResponse>>;
    public referenceResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyGet.');
        }

        if (resourceKey === null || resourceKey === undefined) {
            throw new Error('Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ReferenceDataItemApiResponse>('get',`${this.basePath}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update/Create reference data for a particular resourceType and resourceKey.
     * 
     * @param resourceType 
     * @param resourceKey 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public referenceResourceTypeResourceKeyPut(resourceType: string, resourceKey: ResourceKey, body?: any, observe?: 'body', reportProgress?: boolean): Observable<EmptyObject>;
    public referenceResourceTypeResourceKeyPut(resourceType: string, resourceKey: ResourceKey, body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<EmptyObject>>;
    public referenceResourceTypeResourceKeyPut(resourceType: string, resourceKey: ResourceKey, body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<EmptyObject>>;
    public referenceResourceTypeResourceKeyPut(resourceType: string, resourceKey: ResourceKey, body?: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (resourceType === null || resourceType === undefined) {
            throw new Error('Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyPut.');
        }

        if (resourceKey === null || resourceKey === undefined) {
            throw new Error('Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyPut.');
        }


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<EmptyObject>('put',`${this.basePath}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
