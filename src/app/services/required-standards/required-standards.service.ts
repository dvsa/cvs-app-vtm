import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefectGETIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RequiredStandardsService {
  private url = `${environment.VTM_API_URI}/defects/required-standards`;

  constructor(private http: HttpClient) {}

  getRequiredStandards(euVehicleCategory: string): Observable<DefectGETIVA> {
    return this.http.get<DefectGETIVA>(`${this.url}?euVehicleCategory=${euVehicleCategory}`, { responseType: 'json' });
  }

}
