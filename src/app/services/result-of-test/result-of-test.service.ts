import { Injectable } from '@angular/core';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import {
  resultOfTestSelector, setResultOfTest, updateResultOfTest, updateResultOfTestRequiredStandards,
} from '@store/test-records';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultOfTestService {
  constructor(private store: Store<State>) {}

  get resultOfTest(): Observable<resultOfTestEnum | undefined> {
    return this.store.pipe(select(resultOfTestSelector));
  }

  updateResultOfTest() {
    this.store.dispatch(updateResultOfTest());
  }

  updateResultOfTestRequiredStandards() {
    this.store.dispatch(updateResultOfTestRequiredStandards());
  }

  toggleAbandoned(result: resultOfTestEnum) {
    if (result !== resultOfTestEnum.abandoned) {
      this.store.dispatch(setResultOfTest({ result }));
    } else {
      this.store.dispatch(setResultOfTest({ result }));
      this.updateResultOfTest();
    }
  }
}
