import { createActionGroup, emptyProps } from '@ngrx/store';
import { STORE_LOADING_KEY } from './loading.feature';

export const { startLoading, stopLoading } = createActionGroup({
	source: STORE_LOADING_KEY,
	events: {
		startLoading: emptyProps(),
		stopLoading: emptyProps(),
	},
});
