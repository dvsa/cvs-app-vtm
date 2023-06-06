import { createAction, props } from '@ngrx/store';

export const upsertVehicleBatch = createAction(
  '[Technical Record Batch Create] upsert many',
  props<{ vehicles: Array<{ vin: string; trailerId?: string; primaryVrm?: string }> }>()
);

export const setGenerateNumberFlag = createAction('[Technical Record Batch Create] set generate number', props<{ generateNumber: boolean }>());
export const setApplicationId = createAction('[Technical Record Batch Create] set batch ID', props<{ applicationId: string }>());
export const clearBatch = createAction('[Technical Record Batch Create] clear all');
