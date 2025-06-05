import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { globalWarningState } from '@store/global-warning/global-warning-service.reducers';
import { clearWarning, setWarnings } from '@store/global-warning/global-warning.actions';
import { GlobalWarning } from './global-warning.interface';

@Injectable({
	providedIn: 'root',
})
export class GlobalWarningService {
	store = inject(Store);

	warnings$ = this.store.pipe(select(globalWarningState));

	setWarnings(warnings: GlobalWarning[]) {
		this.store.dispatch(setWarnings({ warnings }));
	}

	clearWarnings(): void {
		this.store.dispatch(clearWarning());
	}
}
