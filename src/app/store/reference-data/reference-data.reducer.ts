import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import {
	addSearchInformation,
	amendReferenceDataItemSuccess,
	createReferenceDataItemSuccess,
	deleteReferenceDataItemSuccess,
	fetchReferenceData,
	fetchReferenceDataAudit,
	fetchReferenceDataAuditFailed,
	fetchReferenceDataAuditSuccess,
	fetchReferenceDataByKey,
	fetchReferenceDataByKeyFailed,
	fetchReferenceDataByKeySearch,
	fetchReferenceDataByKeySearchFailed,
	fetchReferenceDataByKeySearchSuccess,
	fetchReferenceDataByKeySuccess,
	fetchReferenceDataComplete,
	fetchReferenceDataFailed,
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

interface Loading {
	loading: boolean;
}

interface Extras extends Loading {
	searchReturn: ReferenceDataModelBase[] | null;
	term: string | null;
	filter: string | null;
}

interface ReferenceDataEntityState extends EntityState<ReferenceDataModelBase>, Loading {}

export interface ReferenceDataEntityStateSearch extends EntityState<ReferenceDataModelBase>, Extras {}

export type ReferenceDataState = Record<
	ReferenceDataResourceType,
	ReferenceDataEntityState | ReferenceDataEntityStateSearch
>;

function createAdapter() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey as any });
}

function getInitialState(
	resourceType: ReferenceDataResourceType
): (EntityState<ReferenceDataModelBase> & ReferenceDataEntityState) | ReferenceDataEntityStateSearch {
	return resourceTypeAdapters[`${resourceType}`].getInitialState({ loading: false });
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
	on(fetchReferenceData, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: true },
	})),
	on(fetchReferenceDataSuccess, (state, action) => {
		const { resourceType, payload, paginated } = action;
		return {
			...state,
			[resourceType]: {
				...resourceTypeAdapters[`${resourceType}`]?.upsertMany(payload, state[`${resourceType}`]),
				loading: paginated,
			},
		};
	}),
	on(fetchReferenceDataFailed, fetchReferenceDataComplete, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: false },
	})),
	on(fetchReferenceDataAudit, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: true },
	})),
	on(fetchReferenceDataAuditSuccess, (state, action) => {
		const { resourceType, payload, paginated } = action;
		return {
			...state,
			[resourceType]: { ...state[action.resourceType], searchReturn: payload, loading: paginated },
		};
	}),
	on(fetchReferenceDataAuditFailed, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: false },
	})),
	on(fetchReferenceDataByKey, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: true },
	})),
	on(fetchReferenceDataByKeySuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: {
				...resourceTypeAdapters[`${resourceType}`].upsertOne(payload, state[`${resourceType}`]),
				loading: false,
			},
		};
	}),
	on(fetchReferenceDataByKeyFailed, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], loading: false },
	})),
	on(fetchReferenceDataByKeySearch, (state, action) => ({
		...state,
		[action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: true },
	})),
	on(fetchReferenceDataByKeySearchSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: { ...state[action.resourceType], searchReturn: payload, loading: false },
		};
	}),
	on(fetchReferenceDataByKeySearchFailed, (state, action) => ({
		...state,
		[action.resourceType]: {
			...state[action.resourceType],
			searchReturn: null,
			loading: false,
			filter: null,
			term: null,
		},
	})),
	on(fetchTyreReferenceDataByKeySearch, (state) => ({
		...state,
		[ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], searchReturn: null, loading: true },
	})),
	on(fetchTyreReferenceDataByKeySearchSuccess, (state, action) => {
		const { resourceType, payload } = action;
		return {
			...state,
			[resourceType]: { ...state[`${resourceType}`], searchReturn: payload, loading: false },
		};
	}),
	on(fetchTyreReferenceDataByKeySearchFailed, (state, action) => ({
		...state,
		[action.resourceType]: {
			...state[action.resourceType],
			searchReturn: null,
			loading: false,
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
