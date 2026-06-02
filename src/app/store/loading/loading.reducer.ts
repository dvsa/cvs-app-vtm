import { createReducer, on } from '@ngrx/store';

import { startLoading, stopLoading } from './loading.actions';

export type LoadingState = {
	pendingCount: number;
};

export const initialLoadingState: LoadingState = {
	pendingCount: 0,
};

export const loadingReducer = createReducer(
	initialLoadingState,
	on(startLoading, (state) => ({ ...state, pendingCount: state.pendingCount + 1 })),
	on(stopLoading, (state) => ({ ...state, pendingCount: state.pendingCount > 0 ? state.pendingCount - 1 : 0 }))
);
