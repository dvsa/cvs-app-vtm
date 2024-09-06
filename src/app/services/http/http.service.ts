import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { environment } from '@environments/environment';
import { Defect } from '@models/defects/defect.model';
import {
	DeleteItem,
	ReferenceDataApiResponse,
	ReferenceDataItem,
	ReferenceDataItemApiResponse,
	ResourceKey,
} from '@models/reference-data/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { TestStation } from '@models/test-stations/test-station.model';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { CompleteTechRecordPUT } from '@models/vehicle/completeTechRecordPUT';
import { TechRecordArchiveAndProvisionalPayload } from '@models/vehicle/techRecordArchiveAndProvisionalPayload';
import { cloneDeep } from 'lodash';

@Injectable({ providedIn: 'root' })
export class HttpService {
	http = inject(HttpClient);

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
		return this.http.get<Defect[]>(`${environment.VTM_API_URI}/defects`);
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

	generateLetter(
		vehicleRecord: TechRecordType<'get'>,
		letterType: string,
		paragraphId: number,
		user: { name?: string; email?: string }
	) {
		return this.http.post<string>(
			`${environment.VTM_API_URI}/v3/technical-records/letter/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`,
			{
				vtmUsername: user.name,
				letterType,
				paragraphId,
				recipientEmailAddress: vehicleRecord.techRecord_applicantDetails_emailAddress
					? vehicleRecord.techRecord_applicantDetails_emailAddress
					: user.email,
			}
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

	getTechRecordV3(systemNumber: string, createdTimestamp: string) {
		return this.http.get<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`
		);
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
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`
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
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
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
			`${environment.VTM_API_URI}/reference/lookup/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`
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
			`${environment.VTM_API_URI}/reference/lookup/tyres/${encodeURIComponent(String(searchKey))}/${encodeURIComponent(String(param))}`
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
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
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
			`${environment.VTM_API_URI}/reference/${encodeURIComponent(String(resourceType))}/${encodeURIComponent(String(resourceKey))}`,
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
}
