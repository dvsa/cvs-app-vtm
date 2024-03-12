import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { CacheBucket, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DefectsService {
  private url = `${environment.VTM_API_URI}/defects`;
  public cacheBucket = new CacheBucket();

  constructor(private http: HttpClient) {}

  getFetchDefectsCacheKey() {
    return this.url;
  }

  fetchDefects(): Observable<Defect[]> {
    return this.http.get<Defect[]>(this.url, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.getFetchDefectsCacheKey(),
      }),
    });
  }

  getFetchDefectCacheKey(id: number) {
    return `${this.url}/${id}`;
  }

  fetchDefect(id: number): Observable<Defect> {
    return this.http.get<Defect>(`${this.url}/${id}`, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.getFetchDefectCacheKey(id),
      }),
    });
  }
}
