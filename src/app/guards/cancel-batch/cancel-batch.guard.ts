import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { clearBatch } from '../../store/technical-records/batch-create.actions';

export const cancelBatchGuard: CanDeactivateFn<boolean> = () => {
	const store = inject(Store);
	store.dispatch(clearBatch());
	return true;
};
