import { createAction, props } from '@ngrx/store';

export const upsertVehicleBatch = createAction(
  '[Technical Record Batch Create] upsert many',
  props<{ vehicles: Array<{ vin: string; trailerId?: string }> }>()
);

export const setGenerateNumberFlag = createAction('[Technical Record Batch Create] set generate number', props<{ generateNumber: boolean }>());
export const setBatchId = createAction('[Technical Record Batch Create] set batch ID', props<{ batchId: string }>());
export const clearBatch = createAction('[Technical Record Batch Create] clear all');
