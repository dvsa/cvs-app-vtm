import { InspectionType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { createSelector } from '@ngrx/store';
import { testResultInEdit } from '../test-records';
import { requiredStandardsAdapter, requiredStandardsFeatureState } from './required-standards.reducer';

const { selectEntities } = requiredStandardsAdapter.getSelectors();

export const selectRequiredStandardEntities = createSelector(requiredStandardsFeatureState, selectEntities);

export const getRequiredStandardsState = createSelector(
	selectRequiredStandardEntities,
	testResultInEdit,
	(manuals, editingTestResult) => {
		return manuals[editingTestResult?.euVehicleCategory ?? ''] || { basic: [], normal: [], euVehicleCategories: [] };
	}
);

export const getRequiredStandardFromTypeAndRef = (inspectionType: InspectionType, rsRefCalculation: string) =>
	createSelector(getRequiredStandardsState, (state) => {
		const deRefRsCalculation = rsRefCalculation.split('.');
		const sectionNumber = deRefRsCalculation[0];
		const section = state[inspectionType]?.find((sec) => sec.sectionNumber === sectionNumber);
		const requiredStandard = section?.requiredStandards.find((rs) => rs.refCalculation === rsRefCalculation);

		if (requiredStandard && section) {
			return { ...requiredStandard, sectionNumber, sectionDescription: section.sectionDescription };
		}

		return undefined;
	});

export const requiredStandardsLoadingState = createSelector(requiredStandardsFeatureState, (state) => state.loading);
