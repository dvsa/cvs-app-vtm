import { DestroyRef, inject, provideEnvironmentInitializer } from '@angular/core';
import { MockStore } from '@ngrx/store/testing';

export default [
	provideEnvironmentInitializer(() => {
		const store = inject(MockStore, { optional: true });
		if (store) {
			// Downstream selectors must not reuse cached results for a previous test's state.
			store.refreshState();
			// Selector overrides mutate shared selector objects, not just this store.
			inject(DestroyRef).onDestroy(() => store.resetSelectors());
		}
	}),
];
