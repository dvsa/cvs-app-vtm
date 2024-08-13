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
	public testCertificateGet(
		testNumber?: string,
		vin?: string,
		observe?: 'body',
		reportProgress?: boolean
	): Observable<any>;
	public testCertificateGet(
		testNumber?: string,
		vin?: string,
		observe?: 'response',
		reportProgress?: boolean
	): Observable<HttpResponse<any>>;
	public testCertificateGet(
		testNumber?: string,
		vin?: string,
		observe?: 'events',
		reportProgress?: boolean
	): Observable<HttpEvent<any>>;
	public testCertificateGet(
		testNumber?: string,
		vin?: string,
		observe: any = 'body',
		reportProgress = false
	): Observable<any> {
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
			const accessToken =
				typeof this.configuration.accessToken === 'function'
					? this.configuration.accessToken()
					: this.configuration.accessToken;
			headers = headers.set('Authorization', `Bearer ${accessToken}`);
		}

		// api keys
		if (this.configuration.apiKeys) {
			for (const key in this.configuration.apiKeys) {
				headers = headers.set(key, this.configuration.apiKeys[key]);
			}
		}

		// to determine the Accept header
		const httpHeaderAccepts: string[] = [];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		if (httpHeaderAcceptSelected) {
			headers = headers.set('Accept', httpHeaderAcceptSelected);
		}

		// to determine the Content-Type header
		const consumes: string[] = ['application/pdf; charset=utf-8'];
		const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
		if (httpContentTypeSelected) {
			headers = headers.set('Content-Type', httpContentTypeSelected);
		}

		return this.httpClient.get(`${this.basePath}/v1/document-retrieval`, {
			headers,
			params,
			reportProgress,
			observe,
			responseType: 'text',
			withCredentials: this.configuration.withCredentials,
		});
	}

	public testPlateGet(serialNumber?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
	public testPlateGet(
		serialNumber?: string,
		observe?: 'response',
		reportProgress?: boolean
	): Observable<HttpResponse<any>>;
	public testPlateGet(serialNumber?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
	public testPlateGet(serialNumber?: string, observe: any = 'body', reportProgress = false): Observable<any> {
		if (!serialNumber) {
			throw new Error('Required parameter serialNumber was null or undefined when calling testCertificateGet.');
		}

		// Set query parameters
		let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
		if (serialNumber) {
			params = params.set('plateSerialNumber', <any>serialNumber);
		}

		let headers = this.defaultHeaders;

		// authentication (OAuth2) required
		if (this.configuration.accessToken) {
			const accessToken =
				typeof this.configuration.accessToken === 'function'
					? this.configuration.accessToken()
					: this.configuration.accessToken;
			headers = headers.set('Authorization', `Bearer ${accessToken}`);
		}

		// api keys
		if (this.configuration.apiKeys) {
			for (const key in this.configuration.apiKeys) {
				headers = headers.set(key, this.configuration.apiKeys[key]);
			}
		}

		// to determine the Accept header
		const httpHeaderAccepts: string[] = [];
		const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		if (httpHeaderAcceptSelected) {
			headers = headers.set('Accept', httpHeaderAcceptSelected);
		}

		// to determine the Content-Type header
		const consumes: string[] = ['application/pdf; charset=utf-8'];
		const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
		if (httpContentTypeSelected) {
			headers = headers.set('Content-Type', httpContentTypeSelected);
		}

		return this.httpClient.get(`${this.basePath}/v1/document-retrieval`, {
			headers,
			params,
			reportProgress,
			observe,
			responseType: 'text',
			withCredentials: this.configuration.withCredentials,
		});
	}

	getDocument(paramMap: Map<string, string>): Observable<HttpEvent<string>> {
		let headers = this.defaultHeaders;

		if (this.configuration.accessToken) {
			const accessToken =
				typeof this.configuration.accessToken === 'function'
					? this.configuration.accessToken()
					: this.configuration.accessToken;
			headers = headers.set('Authorization', `Bearer ${accessToken}`);
		}

		if (this.configuration.apiKeys) {
			for (const key in this.configuration.apiKeys) {
				headers = headers.set(key, this.configuration.apiKeys[key]);
			}
		}

		const httpContentTypeSelected = this.configuration.selectHeaderContentType(['application/pdf; charset=utf-8']);
		if (httpContentTypeSelected) {
			headers = headers.set('Content-Type', httpContentTypeSelected);
		}

		let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });

		paramMap.forEach((value, key) => (params = params.set(key, value)));

		return this.httpClient.get(`${this.basePath}/v1/document-retrieval`, {
			headers,
			observe: 'events',
			params,
			reportProgress: true,
			responseType: 'text',
			withCredentials: this.configuration.withCredentials,
		});
	}
}
