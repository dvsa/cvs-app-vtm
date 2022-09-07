import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { User } from '@models/reference-data.model';
import { TestStation } from '@models/test-stations/test-station.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectUserByResourceKey } from '@store/reference-data';
import { sectionTemplates, testResultInEdit, updateTesterDatails } from '@store/test-records';
import { getTestStationFromProperty, updateTestStation } from '@store/test-stations';
import { map, Observable, of, take } from 'rxjs';

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
      store
        .pipe(select(getTestStationFromProperty((control as CustomFormControl).meta.name as keyof TestStation, control.value)), take(1))
        .subscribe(stations => {
          stations && store.dispatch(updateTestStation({ payload: stations }));
        });
      return of(null);
    };
  }

  static updateTesterDetails(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      store.pipe(select(selectUserByResourceKey(control.value)), take(1)).subscribe(user => {
        user && store.dispatch(updateTesterDatails({ payload: user as User }));
      });
      return of(null);
    };
  }

  static testWithDefectTaxonomy(store: Store<State>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<null> => {
      store.pipe(select(sectionTemplates), take(1)).subscribe(sections => {
        (control as CustomFormControl).meta.hide = sections && sections?.map(section => section.name).some(name => 'defects' === name);
      });
      return of(null);
    };
  }
}
