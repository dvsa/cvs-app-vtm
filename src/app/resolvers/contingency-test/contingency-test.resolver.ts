import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TestType } from '@models/test-types/test-type.model';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { initialContingencyTest } from '@store/test-records';
import { catchError, map, Observable, of, switchMap, take, tap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContingencyTestResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions, private techRecordService: TechnicalRecordService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.techRecordService.selectedVehicleTechRecord$.pipe(
      withLatestFrom(this.store.pipe(select(selectRouteNestedParams))),
      switchMap(([techRecord, params]) => {
        const { testResultId } = params;
        const { vin, vrms, systemNumber } = techRecord!;
        const vrm = vrms.find(vrm => vrm.isPrimary);
        return this.techRecordService.viewableTechRecord$(techRecord!).pipe(
          map(viewableTechRecord => ({
            vin,
            vrm: vrm?.vrm,
            systemNumber,
            vehicleType: viewableTechRecord?.vehicleType,
            testResultId,
            testTypes: [
              {
                testTypeId: '1',
                testNumber: '0'
              } as TestType
            ]
          }))
        );
      }),
      tap(testResult => {
        this.store.dispatch(initialContingencyTest({ testResult }));
      }),
      take(1),
      map(() => {
        return true;
      }),
      catchError(e => {
        return of(true);
      })
    );
  }
}
