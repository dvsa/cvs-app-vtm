import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectRouteDataProperty } from '@store/router/router.selectors';
import { detailedDiff } from 'deep-object-diff';
import { getTechRecordState } from './technical-record-service.reducer';

export const techRecord = createSelector(getTechRecordState, (state) => state.vehicleTechRecord);

export const getSingleVehicleType = createSelector(
	getTechRecordState,
	(state) => state.vehicleTechRecord?.techRecord_vehicleType
);

export const editingTechRecord = createSelector(getTechRecordState, (state) => state.editingTechRecord);

export const getCanGeneratePlate = createSelector(getTechRecordState, (state) => state.canGeneratePlate);

export const selectTechRecordHistory = createSelector(getTechRecordState, (state) =>
	state.techRecordHistory?.sort((a, b) => {
		const aTimeCode = new Date(a.createdTimestamp).getTime();
		const bTimeCode = new Date(b.createdTimestamp).getTime();
		// return aTimeCode < bTimeCode ? 1 : aTimeCode > bTimeCode ? -1 : 0;
		if (aTimeCode < bTimeCode) {
			return 1;
		}
		if (aTimeCode > bTimeCode) {
			return -1;
		}
		return 0;
	})
);

export const selectTechRecord = createSelector(
	techRecord,
	selectRouteDataProperty('isEditing'),
	editingTechRecord,
	(viewableTechRecord, isEditing, editableTechRecord): V3TechRecordModel | undefined => {
		return isEditing ? editableTechRecord : viewableTechRecord;
	}
);

// Return the current tech record from the history, if it exists
export const selectCurrentTechRecordFromHistory = createSelector(selectTechRecordHistory, (history) => {
	return history?.find((record) => record.techRecord_statusCode === StatusCodes.CURRENT);
});

// Return the current tech record from the history, excluding the one we're currently viewing
export const selectNonViewedCurrentTechRecordFromHistory = createSelector(
	selectTechRecord,
	selectCurrentTechRecordFromHistory,
	(techRecord, currentTechRecord) => {
		if (techRecord?.techRecord_statusCode === StatusCodes.CURRENT) return undefined;
		return currentTechRecord;
	}
);

export const selectSectionState = createSelector(getTechRecordState, (state) => state.sectionState);

export const selectScrollPosition = createSelector(getTechRecordState, (state) => state.scrollPosition);

export const selectTechRecordDeletions = createSelector(techRecord, editingTechRecord, (current, amended) => {
	if (current == null || amended == null) return {};

	// Note: we use added changes from the comparison of amended to current, as deletions are not working as expected
	return detailedDiff(amended, current).added as Partial<TechRecordType<'get'>>;
});

export const selectTechRecordChanges = createSelector(techRecord, editingTechRecord, (current, amended) => {
	if (current == null || amended == null) return {};

	const changes = detailedDiff(current, amended);

	return { ...changes.added, ...changes.updated, ...changes.deleted } as Partial<TechRecordType<'get'>>;
});
