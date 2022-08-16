import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DefectsService {
  private url = `${environment.VTM_API_URI}/defects/`;

  constructor(private http: HttpClient) {}

  fetchDefects(): Observable<Defect[]> {
    return this.http.get<Defect[]>(this.url, { responseType: 'json' });
  }

  fetchDefect(id: string): Observable<Defect> {
    return this.http.get<Defect>(this.url + id, { responseType: 'json' });
  }
}
