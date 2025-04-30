import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { environment } from '@environments/environment';
import { Defect } from '@models/defects/defect.model';
import { Log } from '@models/logs/logs.model';
import {
	DeleteItem,
	ReferenceDataApiResponse,
	ReferenceDataItem,
	ReferenceDataItemApiResponse,
	ResourceKey,
} from '@models/reference-data/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { CompleteTestResults } from '@models/test-results/completeTestResults';
import { TestResults } from '@models/test-results/testResults';
import { TestStation } from '@models/test-stations/test-station.model';
import { TestTypeInfo } from '@models/test-types/testTypeInfo';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { CompleteTechRecordPUT } from '@models/vehicle/completeTechRecordPUT';
import { CompleteTechRecords } from '@models/vehicle/completeTechRecords';
import { TechRecordArchiveAndProvisionalPayload } from '@models/vehicle/techRecordArchiveAndProvisionalPayload';
import { TechRecordPOST } from '@models/vehicle/techRecordPOST';
import { TechRecordPUT } from '@models/vehicle/techRecordPUT';
import { cloneDeep } from 'lodash';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
	private readonly http = inject(HttpClient);
	private static readonly TIMEOUT = 30000;
	private static readonly gzippedHeader = new HttpHeaders({
		'x-accept-encoding': 'base64+gzip',
	});

	addProvisionalTechRecord(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling addProvisionalTechRecord.');
		}

		if (systemNumber === null || systemNumber === undefined) {
			throw new Error('Required parameter systemNumber was null or undefined when calling addProvisionalTechRecord.');
		}

		return this.http.post<CompleteTechRecordPUT>(
			`${environment.VTM_API_URI}/vehicles/add-provisional/${encodeURIComponent(String(systemNumber))}`,
			body
		);
	}

	amendTechRecordVin(newVin: string, systemNumber: string, createdTimestamp: string) {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/updateVin/${systemNumber}/${createdTimestamp}`,
			{
				newVin,
			}
		);
	}

	amendTechRecordVrm(
		newVrm: string,
		isCherishedTransfer: boolean,
		systemNumber: string,
		createdTimestamp: string,
		thirdMark?: string
	) {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/updateVrm/${systemNumber}/${createdTimestamp}`,
			{
				newVrm,
				isCherishedTransfer,
				thirdMark: thirdMark ?? undefined,
			}
		);
	}

	archiveTechRecord(systemNumber: string, createdTimestamp: string, reasonForArchiving: string) {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/archive/${systemNumber}/${createdTimestamp}`,
			{
				reasonForArchiving,
			}
		);
	}

	archiveTechRecordStatus(body: TechRecordArchiveAndProvisionalPayload, systemNumber: string) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling archiveTechRecordStatus.');
		}

		if (systemNumber === null || systemNumber === undefined) {
			throw new Error('Required parameter systemNumber was null or undefined when calling archiveTechRecordStatus.');
		}

		return this.http.post<CompleteTechRecordPUT>(
			`${environment.VTM_API_URI}/vehicles/archive/${encodeURIComponent(String(systemNumber))}`,
			body
		);
	}

	createTechRecord(newVehicleRecord: V3TechRecordModel) {
		const body = cloneDeep<TechRecordType<'put'>>(newVehicleRecord as TechRecordType<'put'>);
		return this.http.post<TechRecordType<'get'>>(`${environment.VTM_API_URI}/v3/technical-records`, body);
	}

	fetchDefects() {
		return this.http.get<Defect[]>(`${environment.VTM_API_URI}/defects`, { headers: HttpService.gzippedHeader });
	}

	fetchDefect(id: number) {
		return this.http.get<Defect>(`${environment.VTM_API_URI}/defects/${id}`);
	}

	fetchRequiredStandards(euVehicleCategory: string) {
		return this.http.get<DefectGETRequiredStandards>(
			`${environment.VTM_API_URI}/defects/required-standards?euVehicleCategory=${euVehicleCategory}`
		);
	}

	fetchTestStations() {
		return this.http.get<Array<TestStation>>(`${environment.VTM_API_URI}/test-stations`);
	}

	fetchTestStation(id: string) {
		return this.http.get<TestStation>(`${environment.VTM_API_URI}/test-stations/${id}`);
	}

	generateADRCertificate(systemNumber: string, createdTimestamp: string, certificateType: string) {
		return this.http.post<{ message: string; id: string }>(
			`${environment.VTM_API_URI}/v3/technical-records/adrCertificate/${systemNumber}/${createdTimestamp}`,
			{ certificateType }
		);
	}

	getDocument(paramMap: Map<string, string>) {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/pdf; charset=utf-8');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);

		let params = new HttpParams();
		paramMap.forEach((value, key) => (params = params.set(key, value)));

		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval`, {
			headers,
			observe: 'events',
			params,
			reportProgress: true,
			responseType: 'text',
		});
	}

	generateLetter(
		vehicleRecord: TechRecordType<'get'>,
		letterType: string,
		paragraphId: number,
		user: { name?: string; email?: string }
	) {
		return this.http.post(
			`${environment.VTM_API_URI}/v3/technical-records/letter/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`,
			{
				vtmUsername: user.name,
				letterType,
				paragraphId,
				recipientEmailAddress: vehicleRecord.techRecord_applicantDetails_emailAddress
					? vehicleRecord.techRecord_applicantDetails_emailAddress
					: user.email,
			},
			{ responseType: 'text' }
		);
	}

	generatePlate(vehicleRecord: TechRecordType<'get'>, reason: string, user: { name?: string; email?: string }) {
		return this.http.post<Object>(
			`${environment.VTM_API_URI}/v3/technical-records/plate/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`,
			{
				reasonForCreation: reason,
				vtmUsername: user.name,
				recipientEmailAddress: vehicleRecord?.techRecord_applicantDetails_emailAddress ?? user.email,
			}
		);
	}

	getRecalls(vin: string) {
		return this.http.get<RecallsSchema>(`${environment.VTM_API_URI}/v3/technical-records/recalls/${vin}`);
	}

	getTechRecords(searchIdentifier: string, metadata?: boolean, status?: string, searchCriteria?: string) {
		if (searchIdentifier === null || searchIdentifier === undefined) {
			throw new Error('Required parameter searchIdentifier was null or undefined when calling getTechRecords.');
		}

		let params = new HttpParams();

		if (metadata !== undefined && metadata !== null) {
			params = params.set('metadata', metadata);
		}

		if (status !== undefined && status !== null) {
			params = params.set('status', status);
		}

		if (searchCriteria !== undefined && searchCriteria !== null) {
			params = params.set('searchCriteria', searchCriteria);
		}

		return this.http.get<CompleteTechRecords>(
			`${environment.VTM_API_URI}/vehicles/${encodeURIComponent(String(searchIdentifier))}/tech-records`,
			{
				params,
			}
		);
	}

	getTechRecordV3(systemNumber: string, createdTimestamp: string) {
		return this.http.get<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`
		);
	}

	getTestTypes(typeOfTest?: string) {
		let params = new HttpParams();
		if (typeOfTest !== undefined && typeOfTest !== null) {
			params = params.set('typeOfTest', typeOfTest);
		}

		return this.http.request<TestTypesTaxonomy>('get', `${environment.VTM_API_URI}/test-types`, {
			params,
		});
	}

	getTestTypesid(
		id: string,
		fields: Array<string>,
		vehicleType: string,
		vehicleSize?: string,
		vehicleConfiguration?: string,
		vehicleAxles?: number,
		euVehicleCategory?: string,
		vehicleClass?: string,
		vehicleSubclass?: string,
		vehicleWheels?: number
	) {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling getTestTypesid.');
		}

		if (fields === null || fields === undefined) {
			throw new Error('Required parameter fields was null or undefined when calling getTestTypesid.');
		}

		if (vehicleType === null || vehicleType === undefined) {
			throw new Error('Required parameter vehicleType was null or undefined when calling getTestTypesid.');
		}

		let params = new HttpParams();

		if (fields) {
			params = params.set('fields', fields.join(','));
		}

		if (vehicleType !== undefined && vehicleType !== null) {
			params = params.set('vehicleType', vehicleType);
		}

		if (vehicleSize !== undefined && vehicleSize !== null) {
			params = params.set('vehicleSize', vehicleSize);
		}

		if (vehicleConfiguration !== undefined && vehicleConfiguration !== null) {
			params = params.set('vehicleConfiguration', vehicleConfiguration);
		}

		if (vehicleAxles !== undefined && vehicleAxles !== null) {
			params = params.set('vehicleAxles', vehicleAxles);
		}

		if (euVehicleCategory !== undefined && euVehicleCategory !== null) {
			params = params.set('euVehicleCategory', euVehicleCategory);
		}

		if (vehicleClass !== undefined && vehicleClass !== null) {
			params = params.set('vehicleClass', vehicleClass);
		}

		if (vehicleSubclass !== undefined && vehicleSubclass !== null) {
			params = params.set('vehicleSubclass', vehicleSubclass);
		}

		if (vehicleWheels !== undefined && vehicleWheels !== null) {
			params = params.set('vehicleWheels', vehicleWheels);
		}

		return this.http.get<TestTypeInfo>(`${environment.VTM_API_URI}/test-types/${encodeURIComponent(String(id))}`, {
			params,
		});
	}

	postTechRecords(body: TechRecordPOST) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling postTechRecords.');
		}

		return this.http.post<any>(`${environment.VTM_API_URI}/vehicles`, body);
	}

	promoteTechRecord(systemNumber: string, createdTimestamp: string, reasonForPromoting: string) {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/promote/${systemNumber}/${createdTimestamp}`,
			{
				reasonForPromoting,
			}
		);
	}

	referenceResourceTypeGet(resourceType: string, paginationToken?: string) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error('Required parameter resourceType was null or undefined when calling referenceResourceTypeGet.');
		}

		let params = new HttpParams();

		if (paginationToken !== undefined && paginationToken !== null) {
			params = params.set('paginationToken', paginationToken);
		}

		return this.http.get<ReferenceDataApiResponse>(
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(String(resourceType))}`,
			{
				params,
			}
		);
	}

	referenceResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyGet.'
			);
		}

		if (resourceKey === null || resourceKey === undefined) {
			throw new Error(
				'Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyGet.'
			);
		}

		return this.http.get<ReferenceDataItemApiResponse>(
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(
				String(resourceType)
			)}/${encodeURIComponent(String(resourceKey))}`
		);
	}

	referenceResourceTypeResourceKeyDelete(
		resourceType: string,
		resourceKey: ResourceKey,
		body?: Record<string, unknown>
	) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyDelete.'
			);
		}

		if (resourceKey === null || resourceKey === undefined) {
			throw new Error(
				'Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyDelete.'
			);
		}

		return this.http.delete<DeleteItem>(
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(
				String(resourceType)
			)}/${encodeURIComponent(String(resourceKey))}`,
			body
		);
	}

	referenceLookupResourceTypeResourceKeyGet(resourceType: string, resourceKey: ResourceKey) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error(
				'Required parameter resourceType was null or undefined when calling referenceLookupResourceTypeResourceKeyGet.'
			);
		}

		if (resourceKey === null || resourceKey === undefined) {
			throw new Error(
				'Required parameter resourceKey was null or undefined when calling referenceLookupResourceTypeResourceKeyGet.'
			);
		}

		return this.http.get<ReferenceDataApiResponse>(
			`${environment.VTM_API_URI}/reference/lookup/${encodeURIComponent(
				String(resourceType)
			)}/${encodeURIComponent(String(resourceKey))}`
		);
	}

	referenceLookupTyresSearchKeyParamGet(searchKey: string, param: string) {
		if (searchKey === null || searchKey === undefined) {
			throw new Error(
				'Required parameter searchKey was null or undefined when calling referenceLookupTyresSearchKeyParamGet.'
			);
		}

		if (param === null || param === undefined) {
			throw new Error(
				'Required parameter param was null or undefined when calling referenceLookupTyresSearchKeyParamGet.'
			);
		}

		return this.http.get<ReferenceDataApiResponse>(
			`${environment.VTM_API_URI}/reference/lookup/tyres/${encodeURIComponent(
				String(searchKey)
			)}/${encodeURIComponent(String(param))}`
		);
	}

	referenceResourceTypeResourceKeyPost(resourceType: string, resourceKey: ResourceKey, body?: unknown) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyPost.'
			);
		}

		if (resourceKey === null || resourceKey === undefined) {
			throw new Error(
				'Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyPost.'
			);
		}

		return this.http.post<ReferenceDataItem>(
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(
				String(resourceType)
			)}/${encodeURIComponent(String(resourceKey))}`,
			body
		);
	}

	referenceResourceTypeResourceKeyPut(resourceType: string, resourceKey: ResourceKey, body?: unknown) {
		if (resourceType === null || resourceType === undefined) {
			throw new Error(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyPut.'
			);
		}

		if (resourceKey === null || resourceKey === undefined) {
			throw new Error(
				'Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyPut.'
			);
		}

		return this.http.put<ReferenceDataItem>(
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(
				String(resourceType)
			)}/${encodeURIComponent(String(resourceKey))}`,
			body
		);
	}

	searchTechRecords(type: SEARCH_TYPES, term: string) {
		return this.http.get<TechRecordSearchSchema[]>(
			`${environment.VTM_API_URI}/v3/technical-records/search/${term}?searchCriteria=${type}`
		);
	}

	searchTechRecordBySystemNumber(systemNumber: string) {
		return this.searchTechRecords(SEARCH_TYPES.SYSTEM_NUMBER, systemNumber);
	}

	testCertificateGet(testNumber?: string, vin?: string) {
		if (!vin) {
			throw new Error('Required parameter vin was null or undefined when calling testCertificateGet.');
		}

		if (!testNumber) {
			throw new Error('Required parameter testNumber was null or undefined when calling testCertificateGet.');
		}

		let params = new HttpParams();

		if (testNumber) {
			params = params.set('testNumber', testNumber);
		}

		if (vin) {
			params = params.set('vinNumber', vin);
		}

		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/pdf; charset=utf-8');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);

		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval`, {
			headers,
			params,
			reportProgress: false,
			observe: 'body',
			responseType: 'text',
		});
	}

	testPlateGet(serialNumber?: string) {
		if (!serialNumber) {
			throw new Error('Required parameter serialNumber was null or undefined when calling testCertificateGet.');
		}

		let params = new HttpParams();

		if (serialNumber) {
			params = params.set('plateSerialNumber', <any>serialNumber);
		}

		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/pdf; charset=utf-8');
		headers = headers.set('X-Api-Key', environment.DOCUMENT_RETRIEVAL_API_KEY);

		return this.http.get(`${environment.VTM_API_URI}/v1/document-retrieval`, {
			headers,
			params,
			reportProgress: false,
			observe: 'body',
			responseType: 'text',
		});
	}

	testResultsArchiveTestResultIdPut(body: CompleteTestResults, testResultId: string) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling testResultsArchiveTestResultIdPut.');
		}

		if (testResultId === null || testResultId === undefined) {
			throw new Error(
				'Required parameter testResultId was null or undefined when calling testResultsArchiveTestResultIdPut.'
			);
		}

		return this.http.put<TestResults>(
			`${environment.VTM_API_URI}/test-results/archive/${encodeURIComponent(String(testResultId))}`,
			body
		);
	}

	testResultsSystemNumberGet(
		systemNumber: string,
		status?: string,
		fromDateTime?: Date,
		toDateTime?: Date,
		testResultId?: string,
		version?: string
	) {
		if (systemNumber === null || systemNumber === undefined) {
			throw new Error('Required parameter systemNumber was null or undefined when calling testResultsSystemNumberGet.');
		}

		let params = new HttpParams();

		if (status !== undefined && status !== null) {
			params = params.set('status', status);
		}

		if (fromDateTime !== undefined && fromDateTime !== null) {
			params = params.set('fromDateTime', fromDateTime.toISOString());
		}

		if (toDateTime !== undefined && toDateTime !== null) {
			params = params.set('toDateTime', toDateTime.toISOString());
		}

		if (testResultId !== undefined && testResultId !== null) {
			params = params.set('testResultId', testResultId);
		}

		if (version !== undefined && version !== null) {
			params = params.set('version', version);
		}

		return this.http.get<TestResults>(
			`${environment.VTM_API_URI}/test-results/${encodeURIComponent(String(systemNumber))}`,
			{
				params,
			}
		);
	}

	testResultsPost(body: CompleteTestResults) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling testResultsPost.');
		}

		return this.http.post<any>(`${environment.VTM_API_URI}/test-results`, body);
	}

	testResultsSystemNumberPut(body: CompleteTestResults, systemNumber: string) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling testResultsSystemNumberPut.');
		}

		if (systemNumber === null || systemNumber === undefined) {
			throw new Error('Required parameter systemNumber was null or undefined when calling testResultsSystemNumberPut.');
		}

		return this.http.put<CompleteTestResults>(
			`${environment.VTM_API_URI}/test-results/${encodeURIComponent(String(systemNumber))}`,
			body
		);
	}

	unarchiveTechRecord(systemNumber: string, createdTimestamp: string, reasonForUnarchiving: string, status: string) {
		return this.http.post<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/unarchive/${systemNumber}/${createdTimestamp}`,
			{
				reasonForUnarchiving,
				status,
			}
		);
	}

	updateTechRecord(systemNumber: string, createdTimestamp: string, techRecord: TechRecordType<'put'>) {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`,
			techRecord
		);
	}

	updateTechRecords(body: TechRecordPUT, systemNumber: string, oldStatusCode?: string) {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling updateTechRecords.');
		}

		if (systemNumber === null || systemNumber === undefined) {
			throw new Error('Required parameter systemNumber was null or undefined when calling updateTechRecords.');
		}

		let params = new HttpParams();
		if (oldStatusCode !== undefined && oldStatusCode !== null) {
			params = params.set('oldStatusCode', oldStatusCode);
		}

		return this.http.put<CompleteTechRecordPUT>(
			`${environment.VTM_API_URI}/vehicles/${encodeURIComponent(String(systemNumber))}`,
			body,
			{
				params,
			}
		);
	}

	sendLogs = async (logs: Log[]) => {
		const headers = new HttpHeaders().set('x-api-key', environment.LOGS_API_KEY);

		return lastValueFrom(
			this.http
				.post(`${environment.VTM_API_URI}/log`, logs, {
					headers,
					observe: 'response',
				})
				.pipe(timeout(HttpService.TIMEOUT))
		);
	};
}
