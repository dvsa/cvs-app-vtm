import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppFormState } from '../reducers/app-form-state.reducers';


export const selectFeature = createFeatureSelector<AppFormState>('appFormState');

export const getAppFormState = createSelector(selectFeature, (state: AppFormState) => state.pristine);


