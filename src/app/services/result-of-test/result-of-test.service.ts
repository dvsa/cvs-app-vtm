import { Injectable } from '@angular/core';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { resultOfTestSelector, setResultOfTest, testResultInEdit, updateResultOfTest } from '@store/test-records';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultOfTestService {
  constructor(private store: Store<State>) {}

  get resultOfTest(): Observable<resultOfTestEnum | undefined> {
    return this.store.pipe(select(resultOfTestSelector));
  }

  updateResultOfTest() {
    this.store.dispatch(updateResultOfTest());
  }

  toggleAbandoned() {
    this.store.pipe(take(1), select(testResultInEdit)).subscribe(testResult => {
      const result = testResult?.testTypes[0].testResult;
      if (result !== resultOfTestEnum.abandoned) {
        this.store.dispatch(setResultOfTest({ result: resultOfTestEnum.abandoned }));
      } else {
        this.store.dispatch(setResultOfTest({ result: resultOfTestEnum.pass }));
        this.updateResultOfTest();
      }
    });
  }
}
