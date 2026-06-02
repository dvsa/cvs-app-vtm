import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import {
	addSearchInformation,
	amendReferenceDataItemSuccess,
	createReferenceDataItemSuccess,
	deleteReferenceDataItemSuccess,
	fetchReferenceDataAuditSuccess,
	fetchReferenceDataByKeySearch,
	fetchReferenceDataByKeySearchFailed,
	fetchReferenceDataByKeySearchSuccess,
	fetchReferenceDataByKeySuccess,
	fetchReferenceDataSuccess,
	fetchTyreReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearchFailed,
	fetchTyreReferenceDataByKeySearchSuccess,
	removeTyreSearch,
} from './reference-data.actions';

export const STORE_FEATURE_REFERENCE_DATA_KEY = 'referenceData';

const selectResourceKey = (a: ReferenceDataModelBase): string | number => {
	return a.resourceKey;
};

interface Extras {
	searchReturn: ReferenceDataModelBase[] | null;
	term: string | null;
	filter: string | null;
}

interface ReferenceDataEntityState extends EntityState<ReferenceDataModelBase> {}

export interface ReferenceDataEntityStateSearch extends EntityState<ReferenceDataModelBase>, Extras {}

export type ReferenceDataState = Record<
	ReferenceDataResourceType,
	ReferenceDataEntityState | ReferenceDataEntityStateSearch
>;

function hasSortOrder(obj: ReferenceDataModelBase): obj is ReferenceDataModelBase & { sortOrder: number } {
	return 'sortOrder' in obj;
}

function sortComparer(a: ReferenceDataModelBase, b: ReferenceDataModelBase) {
	if (hasSortOrder(a) && hasSortOrder(b)) {
		return a.sortOrder - b.sortOrder;
	}

	// If no sort order, then sort based on how the BE returns the data
	return 0;
}

function createAdapter() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey as any, sortComparer });
}

function getInitialState(
	resourceType: ReferenceDataResourceType
): (EntityState<ReferenceDataModelBase> & ReferenceDataEntityState) | ReferenceDataEntityStateSearch {
	return resourceTypeAdapters[`${resourceType}`].getInitialState();
}

export const resourceTypeAdapters: Record<ReferenceDataResourceType, EntityAdapter<ReferenceDataModelBase>> = {
	[ReferenceDataResourceType.Brakes]: createAdapter(),
	[ReferenceDataResourceType.CountryOfRegistration]: createAdapter(),
	[ReferenceDataResourceType.HgvMake]: createAdapter(),
	[ReferenceDataResourceType.PsvMake]: createAdapter(),
	[ReferenceDataResourceType.ReasonsForAbandoningHgv]: createAdapter(),
	[ReferenceDataResourceType.ReasonsForAbandoningPsv]: createAdapter(),
	[ReferenceDataResourceType.ReasonsForAbandoningTrl]: createAdapter(),
	[ReferenceDataResourceType.ReferenceDataAdminType]: createAdapter(),
	[ReferenceDataResourceType.SpecialistReasonsForAbandoning]: createAdapter(),
	[ReferenceDataResourceType.MsvaReasonsForAbandoning]: createAdapter(),
	[ReferenceDataResourceType.TirReasonsForAbandoning]: createAdapter(),
	[ReferenceDataResourceType.TrlMake]: createAdapter(),
	[ReferenceDataResourceType.Tyres]: createAdapter(),
	[ReferenceDataResourceType.User]: createAdapter(),
	[ReferenceDataResourceType.TyreLoadIndex]: createAdapter(),
};

// IMPORTANT: Ensure the keys in initialReferenceDataState call get the initial state from the matching resourceType

export const initialReferenceDataState = {
	[ReferenceDataResourceType.Brakes]: getInitialState(ReferenceDataResourceType.Brakes),
	[ReferenceDataResourceType.CountryOfRegistration]: getInitialState(ReferenceDataResourceType.CountryOfRegistration),
	[ReferenceDataResourceType.HgvMake]: getInitialState(ReferenceDataResourceType.HgvMake),
	[ReferenceDataResourceType.PsvMake]: getInitialState(ReferenceDataResourceType.PsvMake),
	[ReferenceDataResourceType.ReasonsForAbandoningTrl]: getInitialState(
		ReferenceDataResourceType.ReasonsForAbandoningTrl
	),
	[ReferenceDataResourceType.ReasonsForAbandoningHgv]: getInitialState(
		ReferenceDataResourceType.ReasonsForAbandoningHgv
	),
	[ReferenceDataResourceType.ReasonsForAbandoningPsv]: getInitialState(
		ReferenceDataResourceType.ReasonsForAbandoningPsv
	),
	[ReferenceDataResourceType.ReferenceDataAdminType]: getInitialState(ReferenceDataResourceType.ReferenceDataAdminType),
	[ReferenceDataResourceType.SpecialistReasonsForAbandoning]: getInitialState(
		ReferenceDataResourceType.SpecialistReasonsForAbandoning
	),
	[ReferenceDataResourceType.MsvaReasonsForAbandoning]: getInitialState(
		ReferenceDataResourceType.MsvaReasonsForAbandoning
	),
	[ReferenceDataResourceType.TirReasonsForAbandoning]: getInitialState(
		ReferenceDataResourceType.TirReasonsForAbandoning
	),
	[ReferenceDataResourceType.TrlMake]: getInitialState(ReferenceDataResourceType.TrlMake),
	[ReferenceDataResourceType.Tyres]: getInitialState(ReferenceDataResourceType.Tyres),
	[ReferenceDataResourceType.User]: getInitialState(ReferenceDataResourceType.User),
	[ReferenceDataResourceType.TyreLoadIndex]: getInitialState(ReferenceDataResourceType.TyreLoadIndex),
};

export const referenceDataReducer = createReducer(
	initialReferenceDataState,
	on(fetchReferenceDataSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: {
				...resourceTypeAdapters[`${resourceType}`]?.upsertMany(payload, state[`${resourceType}`]),
			},
		};
	}),
	on(fetchReferenceDataAuditSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: { ...state[action.resourceType], searchReturn: payload },
		};
	}),
	on(fetchReferenceDataByKeySuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: {
				...resourceTypeAdapters[`${resourceType}`].upsertOne(payload, state[`${resourceType}`]),
			},
		};
	}),
	on(fetchReferenceDataByKeySearch, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], searchReturn: null },
	})),
	on(fetchReferenceDataByKeySearchSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: { ...state[action.resourceType], searchReturn: payload },
		};
	}),
	on(fetchReferenceDataByKeySearchFailed, (state, action) => ({
		...state,
		[action.resourceType]: {
			...state[action.resourceType],
			searchReturn: null,
			filter: null,
			term: null,
		},
	})),
	on(fetchTyreReferenceDataByKeySearch, (state) => ({
		...state,
		[ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], searchReturn: null },
	})),
	on(fetchTyreReferenceDataByKeySearchSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: { ...state[`${resourceType}`], searchReturn: payload },
		};
	}),
	on(fetchTyreReferenceDataByKeySearchFailed, (state, action) => ({
		...state,
		[action.resourceType]: {
			...state[action.resourceType],
			searchReturn: null,
			filter: null,
			term: null,
		},
	})),
	on(removeTyreSearch, (state) => ({
		...state,
		[ReferenceDataResourceType.Tyres]: {
			...state[ReferenceDataResourceType.Tyres],
			searchReturn: null,
			filter: null,
			term: null,
		},
	})),
	on(deleteReferenceDataItemSuccess, (state, action) => {
		const { resourceType, resourceKey } = action;
		const currentState = cloneDeep(state);

		currentState[`${resourceType}`] = resourceTypeAdapters[`${resourceType}`].removeOne(
			resourceKey,
			currentState[`${resourceType}`]
		);

		return currentState;
	}),
	on(amendReferenceDataItemSuccess, (state, action) => {
		const { result } = action;
		const { resourceKey, resourceType } = result;
		const currentState = cloneDeep(state);

		currentState[`${resourceType}`] = resourceTypeAdapters[`${resourceType}`].updateOne(
			{ id: resourceKey.toString(), changes: result },
			currentState[`${resourceType}`]
		);

		return currentState;
	}),
	on(createReferenceDataItemSuccess, (state, action) => {
		const { result } = action;
		const { resourceType } = result;
		const currentState = cloneDeep(state);

		currentState[`${resourceType}`] = resourceTypeAdapters[`${resourceType}`].addOne(
			result,
			currentState[`${resourceType}`]
		);

		return currentState;
	}),
	on(addSearchInformation, (state, action) => ({
		...state,
		[ReferenceDataResourceType.Tyres]: {
			...state[ReferenceDataResourceType.Tyres],
			filter: action.filter,
			term: action.term,
		},
	}))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);
