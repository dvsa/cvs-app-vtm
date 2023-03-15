import { createAction, props } from '@ngrx/store';

export const upsertVehicleBatch = createAction(
  '[Technical Record Batch Create] upsert many',
  props<{ vehicles: Array<{ vin: string; trailerId?: string }> }>()
);
