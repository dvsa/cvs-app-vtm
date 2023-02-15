/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { CompleteTechRecordPUT } from '../model/completeTechRecordPUT';
import { TechRecordArchiveAndProvisionalPayload } from '../model/techRecordArchiveAndProvisionalPayload';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ArchiveTechRecordStatusService {

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
     * Archive an existing current or provisional tech record
     * 
     * @param body The tech record to be archived
     * @param systemNumber This represents the systemNumber of the vehicle
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public archiveTechRecordStatus(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string, observe?: 'body', reportProgress?: boolean): Observable<CompleteTechRecordPUT>;
    public archiveTechRecordStatus(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CompleteTechRecordPUT>>;
    public archiveTechRecordStatus(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CompleteTechRecordPUT>>;
    public archiveTechRecordStatus(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling archiveTechRecordStatus.');
        }

        if (systemNumber === null || systemNumber === undefined) {
            throw new Error('Required parameter systemNumber was null or undefined when calling archiveTechRecordStatus.');
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
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<CompleteTechRecordPUT>('post',`${this.basePath}/vehicles/archive/${encodeURIComponent(String(systemNumber))}`,
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
