import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Defect } from '@models/defects/defect.model';
import { CacheBucket, withCache } from '@ngneat/cashew';
import { Store } from '@ngrx/store';
import { DefectsState, setDefectsLoading } from '@store/defects';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DefectsService {
  private url = `${environment.VTM_API_URI}/defects`;
  private cacheBucket = new CacheBucket();

  constructor(private http: HttpClient, private store: Store<DefectsState>) {}

  fetchDefects(): Observable<Defect[]> {
    if (!this.cacheBucket.has(this.url)) {
      this.store.dispatch(setDefectsLoading({ loading: true }));
    }

    return this.http.get<Defect[]>(this.url, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.url,
      }),
    });
  }

  fetchDefect(id: number): Observable<Defect> {
    const url = `${this.url}/${id}`;

    if (!this.cacheBucket.has(url)) {
      this.store.dispatch(setDefectsLoading({ loading: true }));
    }

    return this.http.get<Defect>(url, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.url,
      }),
    });
  }
}
