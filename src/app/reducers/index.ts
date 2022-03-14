import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { usernameReducer } from '../user-service/user-service.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  "username": usernameReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
