import { Injectable } from '@angular/core';
import { resultOfTestEnum } from '@models/test-type.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { resultOfTestSelector, updateResultOfTest } from '@store/test-records';
import { Observable } from 'rxjs';

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
}
