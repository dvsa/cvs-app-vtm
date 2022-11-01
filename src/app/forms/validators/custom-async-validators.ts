import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { User } from '@models/reference-data.model';
import { TestStation } from '@models/test-stations/test-station.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectUserByResourceKey } from '@store/reference-data';
import { testResultInEdit } from '@store/test-records';
import { getTestStationFromProperty } from '@store/test-stations';
import { catchError, map, Observable, of, take, tap } from 'rxjs';

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

  static updateTesterDetails(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      return store.pipe(
        select(selectUserByResourceKey(control.value)),
        take(1),
        tap(user => {
          const testerName = control.parent?.get('testerName');
          const testerEmail = control.parent?.get('testerEmailAddress');
          if (user && testerName && testerEmail) {
            testerName.setValue((user as User).name, { emitEvent: false, onlySelf: true });
            testerEmail.setValue((user as User).email, { emitEvent: false, onlySelf: true });
          }
        }),
        map(() => null),
        catchError(() => of(null))
      );
    };
  }

  static requiredIfNotResult(store: Store<State>, result: resultOfTestEnum | resultOfTestEnum[]): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      store.pipe(
        take(1),
        select(testResultInEdit),
        map(testResult => {
          const currentResult = testResult?.testTypes[0].testResult;
          if ((Array.isArray(result) ? currentResult&&!result.includes(currentResult) : currentResult !== result) && (control.value == null || control.value === '')) {
            if(Array.isArray(result)) return { requiredIfNotResult: true }
            else return { [`requiredIfNot${result}`]: true };
          }
          return null;
        })
      );
  }

  static requiredIfNotFail(store: Store<State>): AsyncValidatorFn {
    return this.requiredIfNotResult(store, resultOfTestEnum.fail);
  }

  static requiredIfNotAbandoned(store: Store<State>): AsyncValidatorFn {
    return this.requiredIfNotResult(store, resultOfTestEnum.abandoned);
  }
  
  static requiredIfNotResultAndSiblingEquals(store: Store<State>, result: resultOfTestEnum | resultOfTestEnum[], sibling: string, value: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      store.pipe(
        take(1),
        select(testResultInEdit),
        map(testResult => {
          if (control?.parent) {
            const siblingControl = control.parent.get(sibling) as CustomFormControl;
            const siblingValue = siblingControl.value;
            const newValue = Array.isArray(value) ? value.includes(siblingValue) : siblingValue === value;

            const currentResult = testResult?.testTypes[0].testResult;

            if ((Array.isArray(result) ? currentResult&&!result.includes(currentResult) : currentResult !== result) && newValue && (control.value === null || control.value === undefined || control.value === '')) {
              return { requiredIfNotResultAndSiblingEquals: true };
            }
          }

          return null;
        })
      );
  }
 
}
