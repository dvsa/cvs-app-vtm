import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DefectsState, fetchDefects, fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefectsTaxonomyResolver implements Resolve<boolean> {
  constructor(private store: Store<DefectsState>, private action$: Actions) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchDefects());

    return this.action$.pipe(
      ofType(fetchDefectsSuccess, fetchDefectsFailed),
      take(1),
      map(action => action.type === fetchDefectsSuccess.type)
    );
  }
}
