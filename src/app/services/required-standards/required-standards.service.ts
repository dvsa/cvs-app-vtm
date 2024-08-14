import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RequiredStandardsService {
	private url = `${environment.VTM_API_URI}/defects/required-standards`;

	constructor(private http: HttpClient) {}

	getRequiredStandards(euVehicleCategory: string): Observable<DefectGETRequiredStandards> {
		return this.http.get<DefectGETRequiredStandards>(`${this.url}?euVehicleCategory=${euVehicleCategory}`, {
			responseType: 'json',
		});
	}
}
