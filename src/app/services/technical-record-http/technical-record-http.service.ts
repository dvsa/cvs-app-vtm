import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { fetchSearchResult } from '@store/tech-record-search/tech-record-search.actions';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordHttpService {
	constructor(
		private http: HttpClient,
		private store: Store
	) {}

	search$(type: SEARCH_TYPES, term: string): Observable<TechRecordSearchSchema[]> {
		const queryStr = `${term}?searchCriteria=${type}`;
		const url = `${environment.VTM_API_URI}/v3/technical-records/search/${queryStr}`;

		return this.http.get<TechRecordSearchSchema[]>(url, { responseType: 'json' });
	}

	searchBy(type: SEARCH_TYPES | undefined, term: string): void {
		this.store.dispatch(fetchSearchResult({ searchBy: type, term }));
	}

	getBySystemNumber$(systemNumber: string): Observable<TechRecordSearchSchema[]> {
		return this.search$(SEARCH_TYPES.SYSTEM_NUMBER, systemNumber);
	}

	getRecordV3$(systemNumber: string, createdTimestamp: string): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`;

		return this.http.get<TechRecordType<'get'>>(url, { responseType: 'json' });
	}

	createVehicleRecord$(newVehicleRecord: V3TechRecordModel): Observable<TechRecordType<'get'>> {
		const recordCopy: TechRecordType<'put'> = cloneDeep(newVehicleRecord) as TechRecordType<'put'>;

		const body = {
			...recordCopy,
		};

		return this.http.post<TechRecordType<'get'>>(`${environment.VTM_API_URI}/v3/technical-records`, body);
	}

	updateTechRecords$(
		systemNumber: string,
		createdTimestamp: string,
		techRecord: TechRecordType<'put'>
	): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`;

		return this.http.patch<TechRecordType<'get'>>(url, techRecord, { responseType: 'json' });
	}

	amendVrm$(
		newVrm: string,
		cherishedTransfer: boolean,
		systemNumber: string,
		createdTimestamp: string,
		thirdMark?: string
	): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/updateVrm/${systemNumber}/${createdTimestamp}`;
		const body = {
			newVrm,
			isCherishedTransfer: cherishedTransfer,
			thirdMark: thirdMark ?? undefined,
		};
		return this.http.patch<TechRecordType<'get'>>(url, body, { responseType: 'json' });
	}

	amendVin$(newVin: string, systemNumber: string, createdTimestamp: string): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/updateVin/${systemNumber}/${createdTimestamp}`;
		const body = {
			newVin,
		};
		return this.http.patch<TechRecordType<'get'>>(url, body, { responseType: 'json' });
	}

	archiveTechnicalRecord$(
		systemNumber: string,
		createdTimestamp: string,
		reasonForArchiving: string
	): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/archive/${systemNumber}/${createdTimestamp}`;

		const body = { reasonForArchiving };

		return this.http.patch<TechRecordType<'get'>>(url, body, { responseType: 'json' });
	}

	promoteTechnicalRecord$(
		systemNumber: string,
		createdTimestamp: string,
		reasonForPromoting: string
	): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/promote/${systemNumber}/${createdTimestamp}`;

		const body = { reasonForPromoting };

		return this.http.patch<TechRecordType<'get'>>(url, body, { responseType: 'json' });
	}

	generatePlate$(
		vehicleRecord: TechRecordType<'get'>,
		reason: string,
		user: { name?: string; email?: string }
	): Observable<Object> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/plate/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`;

		const body = {
			reasonForCreation: reason,
			vtmUsername: user.name,
			recipientEmailAddress: vehicleRecord?.techRecord_applicantDetails_emailAddress ?? user.email,
		};

		return this.http.post(url, body, { responseType: 'json' });
	}

	generateLetter$(
		vehicleRecord: TechRecordType<'get'>,
		letterType: string,
		paragraphId: number,
		user: { name?: string; email?: string }
	): Observable<string> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/letter/${vehicleRecord.systemNumber}/${vehicleRecord.createdTimestamp}`;

		const body = {
			vtmUsername: user.name,
			letterType,
			paragraphId,
			recipientEmailAddress: vehicleRecord.techRecord_applicantDetails_emailAddress
				? vehicleRecord.techRecord_applicantDetails_emailAddress
				: user.email,
		};

		return this.http.post(url, body, { responseType: 'text' });
	}

	unarchiveTechnicalRecord$(
		systemNumber: string,
		createdTimestamp: string,
		reasonForUnarchiving: string,
		status: string
	): Observable<TechRecordType<'get'>> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/unarchive/${systemNumber}/${createdTimestamp}`;

		const body = { reasonForUnarchiving, status };

		return this.http.post<TechRecordType<'get'>>(url, body, { responseType: 'json' });
	}

	generateADRCertificate$(
		systemNumber: string,
		createdTimestamp: string,
		certificateType: string
	): Observable<{ message: string; id: string }> {
		const url = `${environment.VTM_API_URI}/v3/technical-records/adrCertificate/${systemNumber}/${createdTimestamp}`;

		const body = { certificateType };

		return this.http.post<{ message: string; id: string }>(url, body, { responseType: 'json' });
	}
}
