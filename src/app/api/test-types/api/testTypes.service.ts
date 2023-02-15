import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { TestTypeInfo } from '../model/testTypeInfo';
import { TestTypesTaxonomy } from '../model/testTypesTaxonomy';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class TestTypesService {

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
     * Return test types
     * This endpoint will return all the data for test types based on filters provided. By default it will return all testTypes which don&#x27;t have a typeOfTest field.
     * @param typeOfTest It is used to filter test types based on the given typeOfTest. Note that sending the query parameter will also return the test types without a tag.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTestTypes(typeOfTest?: string, observe?: 'body', reportProgress?: boolean): Observable<TestTypesTaxonomy>;
    public getTestTypes(typeOfTest?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<TestTypesTaxonomy>>;
    public getTestTypes(typeOfTest?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<TestTypesTaxonomy>>;
    public getTestTypes(typeOfTest?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (typeOfTest !== undefined && typeOfTest !== null) {
            queryParameters = queryParameters.set('typeOfTest', <any>typeOfTest);
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

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

        return this.httpClient.request<TestTypesTaxonomy>('get',`${this.basePath}/test-types`,
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
     * Return test type information by ID
     * This endpoint will return data of the test types needed to be saved agains the test results.
     * @param id 
     * @param fields 
     * @param vehicleType 
     * @param vehicleSize 
     * @param vehicleConfiguration 
     * @param vehicleAxles 
     * @param euVehicleCategory 
     * @param vehicleClass 
     * @param vehicleSubclass 
     * @param vehicleWheels 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTestTypesid(id: string, fields: Array<string>, vehicleType: string, vehicleSize?: string, vehicleConfiguration?: string, vehicleAxles?: number, euVehicleCategory?: string, vehicleClass?: string, vehicleSubclass?: string, vehicleWheels?: number, observe?: 'body', reportProgress?: boolean): Observable<TestTypeInfo>;
    public getTestTypesid(id: string, fields: Array<string>, vehicleType: string, vehicleSize?: string, vehicleConfiguration?: string, vehicleAxles?: number, euVehicleCategory?: string, vehicleClass?: string, vehicleSubclass?: string, vehicleWheels?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<TestTypeInfo>>;
    public getTestTypesid(id: string, fields: Array<string>, vehicleType: string, vehicleSize?: string, vehicleConfiguration?: string, vehicleAxles?: number, euVehicleCategory?: string, vehicleClass?: string, vehicleSubclass?: string, vehicleWheels?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<TestTypeInfo>>;
    public getTestTypesid(id: string, fields: Array<string>, vehicleType: string, vehicleSize?: string, vehicleConfiguration?: string, vehicleAxles?: number, euVehicleCategory?: string, vehicleClass?: string, vehicleSubclass?: string, vehicleWheels?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getTestTypesid.');
        }

        if (fields === null || fields === undefined) {
            throw new Error('Required parameter fields was null or undefined when calling getTestTypesid.');
        }

        if (vehicleType === null || vehicleType === undefined) {
            throw new Error('Required parameter vehicleType was null or undefined when calling getTestTypesid.');
        }








        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (fields) {
            queryParameters = queryParameters.set('fields', fields.join(COLLECTION_FORMATS['csv']));
        }
        if (vehicleType !== undefined && vehicleType !== null) {
            queryParameters = queryParameters.set('vehicleType', <any>vehicleType);
        }
        if (vehicleSize !== undefined && vehicleSize !== null) {
            queryParameters = queryParameters.set('vehicleSize', <any>vehicleSize);
        }
        if (vehicleConfiguration !== undefined && vehicleConfiguration !== null) {
            queryParameters = queryParameters.set('vehicleConfiguration', <any>vehicleConfiguration);
        }
        if (vehicleAxles !== undefined && vehicleAxles !== null) {
            queryParameters = queryParameters.set('vehicleAxles', <any>vehicleAxles);
        }
        if (euVehicleCategory !== undefined && euVehicleCategory !== null) {
            queryParameters = queryParameters.set('euVehicleCategory', <any>euVehicleCategory);
        }
        if (vehicleClass !== undefined && vehicleClass !== null) {
            queryParameters = queryParameters.set('vehicleClass', <any>vehicleClass);
        }
        if (vehicleSubclass !== undefined && vehicleSubclass !== null) {
            queryParameters = queryParameters.set('vehicleSubclass', <any>vehicleSubclass);
        }
        if (vehicleWheels !== undefined && vehicleWheels !== null) {
            queryParameters = queryParameters.set('vehicleWheels', <any>vehicleWheels);
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

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

        return this.httpClient.request<TestTypeInfo>('get',`${this.basePath}/test-types/${encodeURIComponent(String(id))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
