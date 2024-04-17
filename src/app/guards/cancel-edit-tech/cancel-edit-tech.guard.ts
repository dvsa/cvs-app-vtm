import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { TechRecordComponent } from 'src/app/features/tech-record/tech-record.component';

export const CancelEditTechActivateGuard: CanActivateFn = () => {
  const store = inject(Store);
  store.dispatch(updateEditingTechRecordCancel());
  return true;
};

export const CancelEditTechDeactivateGuard: CanDeactivateFn<TechRecordComponent> = () => {
  const store = inject(Store);
  store.dispatch(updateEditingTechRecordCancel());
  return true;
};
