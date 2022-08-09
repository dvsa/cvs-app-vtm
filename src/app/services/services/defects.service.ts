import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Defect } from '@models/defect';
import { Defects } from '@models/defects';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DefectsService {
  private url = `${environment.VTM_API_URI}/defects/`;

  constructor(private http: HttpClient) {}

  fetchDefects(): Observable<Defects> {
    return this.http.get<Defects>(this.url, { responseType: 'json' });
  }

  fetchDefect(id: string): Observable<Defect> {
    return this.http.get<Defect>(this.url + id, { responseType: 'json' });
  }
}
