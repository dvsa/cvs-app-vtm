import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomFormControl, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { User } from '@models/reference-data.model';
import { TestStation } from '@models/test-stations/test-station.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectUserByResourceKey } from '@store/reference-data';
import { sectionTemplates, testResultInEdit, updateResultOfTest } from '@store/test-records';
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

  static testWithDefectTaxonomy(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      return store.pipe(
        select(sectionTemplates),
        take(1),
        tap(sections => {
          (control as CustomFormControl).meta.hide = sections && sections.some(section => section.name === 'defects');
        }),
        map(() => null),
        catchError(() => of(null))
      );
    };
  }

  static testAndSwitchToHiddenFieldWithDefectTaxonomy(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      return store.pipe(
        select(sectionTemplates),
        take(1),
        tap(sections => {
          if(sections && sections.some(section => section.name === 'defects')){
            (control as CustomFormControl).meta.editType = FormNodeEditTypes.HIDDEN;
          }
        }),
        map(() => null),
        catchError(() => of(null))
      );
    };
  }

  static checkAndUpdateTestResult(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      store.pipe(
        take(1),
        map(() => {
          store.dispatch(updateResultOfTest());
          return null;
        })
      );
  }
}