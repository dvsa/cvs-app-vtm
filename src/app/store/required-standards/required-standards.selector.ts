import { InspectionType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { createSelector } from '@ngrx/store';
import { requiredStandardsFeatureState } from './required-standards.reducer';

export const getRequiredStandardsState = createSelector(
	requiredStandardsFeatureState,
	(state) => state.requiredStandards
);

export const getRequiredStandardFromTypeAndRef = (inspectionType: InspectionType, rsRefCalculation: string) =>
	createSelector(requiredStandardsFeatureState, (state) => {
		const deRefRsCalculation = rsRefCalculation.split('.');
		const sectionNumber = deRefRsCalculation[0];
		// eslint-disable-next-line security/detect-object-injection
		const section = state.requiredStandards[inspectionType].find((sec) => sec.sectionNumber === sectionNumber);
		const requiredStandard = section?.requiredStandards.find((rs) => rs.refCalculation === rsRefCalculation);

		if (requiredStandard && section)
			return { ...requiredStandard, sectionNumber, sectionDescription: section.sectionDescription };
		return undefined;
	});

export const requiredStandardsLoadingState = createSelector(requiredStandardsFeatureState, (state) => state.loading);
