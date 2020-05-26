import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ModalState } from './modal.reducer';



export const selectFeature = createFeatureSelector<ModalState>('modalState');

export const getCurrentModalState = createSelector(selectFeature, (state: ModalState) => state);


