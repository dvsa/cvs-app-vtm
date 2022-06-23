import { createSelector } from '@ngrx/store';
import { countriesOfRegistrationEntityAdapter, referenceDataFeatureState } from '../reducers/reference-data.reducer';

const { selectAll } = countriesOfRegistrationEntityAdapter.getSelectors();

// select the array of all CountriesOfRegistration
// export const selectAllCountriesOfRegistration = selectAll;

export const selectAllCountriesOfRegistration = createSelector(referenceDataFeatureState, (state) => {
  return Object.values(state.COUNTRY_OF_REGISTRATION);
});
