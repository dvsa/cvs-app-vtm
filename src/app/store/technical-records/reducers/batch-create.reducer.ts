import { Action, createReducer, on } from '@ngrx/store';
import { upsertVehicleBatch } from '../actions/batch-create.actions';

export const vehicleBatchCreateReducer = createReducer<Array<{ vin: string; trailerId?: string }> | undefined, Action>(
  undefined,
  on(upsertVehicleBatch, (state, action) => [...action.vehicles])
);
