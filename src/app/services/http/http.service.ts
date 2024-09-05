import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { environment } from '@environments/environment';
import { Defect } from '@models/defects/defect.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { TestStation } from '@models/test-stations/test-station.model';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
	http = inject(HttpClient);

	amendTechRecordVin(
		newVin: string,
		systemNumber: string,
		createdTimestamp: string
	): Observable<TechRecordType<'get'>> {
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

	createTechRecord(newVehicleRecord: V3TechRecordModel): Observable<TechRecordType<'get'>> {
		const body = cloneDeep<TechRecordType<'put'>>(newVehicleRecord as TechRecordType<'put'>);
		return this.http.post<TechRecordType<'get'>>(`${environment.VTM_API_URI}/v3/technical-records`, body);
	}

	fetchDefects(): Observable<Defect[]> {
		return this.http.get<Defect[]>(`${environment.VTM_API_URI}/defects`);
	}

	fetchDefect(id: number): Observable<Defect> {
		return this.http.get<Defect>(`${environment.VTM_API_URI}/defects/${id}`);
	}

	fetchTestStations(): Observable<Array<TestStation>> {
		return this.http.get<Array<TestStation>>(`${environment.VTM_API_URI}/test-stations`);
	}

	fetchTestStation(id: string): Observable<TestStation> {
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

	getTechRecordV3(systemNumber: string, createdTimestamp: string): Observable<TechRecordType<'get'>> {
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

	searchTechRecords(type: SEARCH_TYPES, term: string): Observable<TechRecordSearchSchema[]> {
		return this.http.get<TechRecordSearchSchema[]>(
			`${environment.VTM_API_URI}/v3/technical-records/search/${term}?searchCriteria=${type}`
		);
	}

	searchTechRecordBySystemNumber(systemNumber: string): Observable<TechRecordSearchSchema[]> {
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

	updateTechRecord(
		systemNumber: string,
		createdTimestamp: string,
		techRecord: TechRecordType<'put'>
	): Observable<TechRecordType<'get'>> {
		return this.http.patch<TechRecordType<'get'>>(
			`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`,
			techRecord
		);
	}
}
