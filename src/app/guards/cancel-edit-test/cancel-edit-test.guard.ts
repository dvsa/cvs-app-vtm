import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { cancelEditingTestResult } from '@store/test-records';

export const CancelEditTestGuard: CanActivateFn = () => {
  const store = inject(Store);
  store.dispatch(cancelEditingTestResult());
  return true;
};
