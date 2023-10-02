import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { cancelEditingTestResult } from '@store/test-records';

import { TestRecordComponent } from 'src/app/features/test-records/amend/views/test-record/test-record.component';

@Injectable({
  providedIn: 'root',
})
export class CancelEditTestGuard implements CanDeactivate<TestRecordComponent> {
  constructor(private store: Store<State>) {}

  canDeactivate(): boolean {
    this.store.dispatch(cancelEditingTestResult());
    return true;
  }
}
