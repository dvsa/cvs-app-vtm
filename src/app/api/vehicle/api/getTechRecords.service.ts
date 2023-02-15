
import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { CompleteTechRecords } from '../model/completeTechRecords';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class GetTechRecordsService {

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
     * Get a tech record, for a particular Vin with status specified.
     * 
     * @param searchIdentifier If the searchCriteria query parameter is not used or it has the \&quot;all\&quot; value then the searchIdentifier can be VRM, VIN, last six digits of the VIN or trailerId. VRM &#x3D; between 3 and 8 characters, VIN &#x3D; &gt;8 characters, partial VIN &#x3D; exactly 6 digits and trailerId &#x3D; exactly 8 digits / 1 letter followed by exactly 6 digits.
     * @param metadata 
     * @param status The tech record&#x27;s status, the default value is provisional_over_current. If \&quot;status\&quot; &#x3D; \&quot;provisional_over_current\&quot; or not provided when the GET call is done, then the current tech record will be retrieved only if, for the \&quot;searchIdentifier\&quot; that was provided, there is no \&quot;provisional\&quot; tech record, in which case the provisional tech record will be retrieved instead. If \&quot;status\&quot; &#x3D; \&quot;all\&quot;, then the backend will translate this into returning ALL technical records for that particular VIN/VRM, not just specific statuses
     * @param searchCriteria The parameter is used to specify which search criteria should be used. \&quot;ALL\&quot; &#x3D; search identifier can be VRM, VIN, last six digits of the VIN or trailerId. VRM &#x3D; between 3 and 8 characters, VIN &#x3D; &gt;8 characters, partial VIN &#x3D; exactly 6 digits and trailerId &#x3D; exactly 8 digits / 1 letter followed by exactly 6 digits. If any other value than \&quot;ALL\&quot; is used then the search will be done using the specified search criteria, without taking into account the format of the saerch identifier.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTechRecords(searchIdentifier: string, metadata?: boolean, status?: string, searchCriteria?: string, observe?: 'body', reportProgress?: boolean): Observable<CompleteTechRecords>;
    public getTechRecords(searchIdentifier: string, metadata?: boolean, status?: string, searchCriteria?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CompleteTechRecords>>;
    public getTechRecords(searchIdentifier: string, metadata?: boolean, status?: string, searchCriteria?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CompleteTechRecords>>;
    public getTechRecords(searchIdentifier: string, metadata?: boolean, status?: string, searchCriteria?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (searchIdentifier === null || searchIdentifier === undefined) {
            throw new Error('Required parameter searchIdentifier was null or undefined when calling getTechRecords.');
        }




        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (metadata !== undefined && metadata !== null) {
            queryParameters = queryParameters.set('metadata', <any>metadata);
        }
        if (status !== undefined && status !== null) {
            queryParameters = queryParameters.set('status', <any>status);
        }
        if (searchCriteria !== undefined && searchCriteria !== null) {
            queryParameters = queryParameters.set('searchCriteria', <any>searchCriteria);
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

        return this.httpClient.request<CompleteTechRecords>('get',`${this.basePath}/vehicles/${encodeURIComponent(String(searchIdentifier))}/tech-records`,
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
