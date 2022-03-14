import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { UserServiceReducer } from '../user-service/user-service.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  "userservice": UserServiceReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
