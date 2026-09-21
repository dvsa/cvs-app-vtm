import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { STORE_FEATURE_BATCH_KEY } from './batch.feature';
import { BatchRecord, BatchState } from './batch.models';

export const { updateBatch, upsertBatchVehicles, cancelBatch } = createActionGroup({
	source: STORE_FEATURE_BATCH_KEY,
	events: {
		updateBatch: props<{ changes: Partial<BatchState> }>(),
		upsertBatchVehicles: props<{ vehicles: BatchRecord[] }>(),
		cancelBatch: emptyProps(),
	},
});
