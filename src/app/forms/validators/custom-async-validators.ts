import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { TestStation } from '@models/test-stations/test-station.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { getTestStationFromProperty } from '@store/test-stations';
import { map, Observable, of, take, tap, catchError } from 'rxjs';

export class CustomAsyncValidators {
  static resultDependantOnCustomDefects(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      store.pipe(
        take(1),
        select(testResultInEdit),
        map(testResult => {
          const hasCustomDefects = testResult?.testTypes?.some(testType => testType?.customDefects && testType.customDefects.length > 0);

          if (control.value === 'pass' && hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot pass test when defects are present' } };
          } else if (control.value === 'fail' && !hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot fail test when no defects are present' } };
          } else if (control.value === 'prs' && !hasCustomDefects) {
            return { invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } };
          } else {
            return null;
          }
        })
      );
  }

  static updateTestStationDetails(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      return store.pipe(
        select(getTestStationFromProperty((control as CustomFormControl).meta.name as keyof TestStation, control.value)),
        take(1),
        tap(stations => {
          const testStationName = control.parent?.get('testStationName');
          const testStationType = control.parent?.get('testStationType');
          if (stations) {
            testStationName && testStationName.setValue(stations.testStationName, { emitEvent: true, onlySelf: true });
            testStationType && testStationType.setValue(stations.testStationType, { emitEvent: true, onlySelf: true });
          }
        }),
        map(() => null),
        catchError(() => of(null))
      );
    };
  }
}
