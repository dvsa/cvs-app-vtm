import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { StatusCodes, V3TechRecordModel, VehicleSubclass, VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectTechRecord, selectTechRecordHistory } from '@store/technical-records';
import { toEditOrNotToEdit } from '@store/test-records';
import { testTypesAdapter, testTypesFeatureState } from './test-types.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = testTypesAdapter.getSelectors();

// select the array of ids
export const selectTestTypesIds = createSelector(testTypesFeatureState, (state) => selectIds(state));

// select the dictionary of test types entities
export const selectTestTypesEntities = createSelector(testTypesFeatureState, (state) => selectEntities(state));

// select the array of tests result
export const selectAllTestTypes = createSelector(testTypesFeatureState, (state) => selectAll(state));

// select the total test types count
export const selectTestTypesTotal = createSelector(testTypesFeatureState, (state) => selectTotal(state));

export const selectTestTypesLoadingState = createSelector(testTypesFeatureState, (state) => state.loading);

export const selectTestTypesByVehicleType = createSelector(
	selectAllTestTypes,
	toEditOrNotToEdit,
	selectTechRecordHistory,
	selectTechRecord,
	(testTypes, testResult, techRecordHistory, techRecord) => {
		const hasCurrentRecordInHistory = techRecordHistory ? currentRecordInHistoryCheck(techRecordHistory) : false;

		if (testResult && techRecord) {
			return filterTestTypes(testTypes, testResult, hasCurrentRecordInHistory, techRecord);
		}
		return [];
	}
);

export const sortedTestTypes = createSelector(selectTestTypesByVehicleType, (testTypes) => {
	const sortTestTypes = (testTypesList: TestTypesTaxonomy): TestTypesTaxonomy => {
		return testTypesList
			.sort((a, b) => {
				if (!Object.prototype.hasOwnProperty.call(b, 'sortId')) {
					return 1;
				}

				if (!Object.prototype.hasOwnProperty.call(a, 'sortId')) {
					return -1;
				}

				return (
					Number.parseInt((a as TestTypeCategory).sortId || '0', 10) -
					Number.parseInt((b as TestTypeCategory).sortId || '0', 10)
				);
			})
			.map((testType) => {
				const newTestType = { ...testType } as TestTypeCategory;

				if (Object.prototype.hasOwnProperty.call(newTestType, 'nextTestTypesOrCategories')) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					newTestType.nextTestTypesOrCategories = sortTestTypes(newTestType.nextTestTypesOrCategories!);
				}

				return newTestType;
			});
	};

	return sortTestTypes(testTypes);
});

export const selectTestType = (id: string | undefined) =>
	createSelector(selectTestTypesByVehicleType, (testTypes): TestType | undefined => {
		function findUsingId(
			idToSearch: string | undefined,
			testTypesList: TestTypesTaxonomy | undefined
		): TestType | undefined {
			if (!testTypesList) {
				return undefined;
			}

			// eslint-disable-next-line no-restricted-syntax
			for (const testType of testTypesList) {
				if (testType.id === idToSearch) {
					return testType;
				}

				const found = findUsingId(idToSearch, (testType as TestTypeCategory).nextTestTypesOrCategories);

				if (found) {
					return found;
				}
			}

			return undefined;
		}

		return findUsingId(id, testTypes);
	});

export const getTypeOfTest = (id: string | undefined) =>
	createSelector(selectTestType(id), (testTypes) => testTypes?.typeOfTest);

function currentRecordInHistoryCheck(techRecordHistorys: TechRecordSearchSchema[]): boolean {
	return techRecordHistorys.some((techRecordHis) => techRecordHis.techRecord_statusCode === 'current');
}

function filterTestTypes(
	testTypes: TestTypesTaxonomy,
	testResult: TestResultModel,
	hasCurrentRecordInHistory: boolean,
	techRecord: V3TechRecordModel
): TestTypesTaxonomy {
	const {
		vehicleType,
		euVehicleCategory,
		vehicleSize,
		vehicleConfiguration,
		noOfAxles,
		vehicleClass,
		vehicleSubclass,
		numberOfWheelsDriven,
	} = testResult;
	const adrTestIds = ['50', '59', '60', '58'];
	const filterAllFirstTestIds = ['41', '119', '120', '67', '103', '104', '51', '95', '82', '83', '65', '66'];
	const filterHgvFirstTestIds = ['41', '119', '120', '67', '103', '104'];
	const { techRecord_statusCode: statusCode } = techRecord;
	return (
		testTypes
			.filter((testType) => !vehicleType || !testType.forVehicleType || testType.forVehicleType.includes(vehicleType))
			.filter((testType) => !vehicleType || !testType.forVehicleType || testType.forVehicleType.includes(vehicleType))
			.filter((testType) => !statusCode || statusCode !== StatusCodes.PROVISIONAL || testType.forProvisionalStatus)
			.filter((testType) => !statusCode || !testType.forProvisionalStatusOnly || statusCode === StatusCodes.PROVISIONAL)
			.filter(
				(testType) =>
					!euVehicleCategory ||
					!testType.forEuVehicleCategory ||
					testType.forEuVehicleCategory.includes(euVehicleCategory)
			)
			.filter((testType) => !vehicleSize || !testType.forVehicleSize || testType.forVehicleSize.includes(vehicleSize))
			.filter(
				(testType) =>
					!vehicleConfiguration ||
					!testType.forVehicleConfiguration ||
					testType.forVehicleConfiguration.includes(vehicleConfiguration)
			)
			.filter((testType) => !noOfAxles || !testType.forVehicleAxles || testType.forVehicleAxles.includes(noOfAxles))
			// if code AND description are null, or if either code OR description are in forVehicleClass, include in filter
			.filter(
				(testType) =>
					!vehicleClass ||
					!testType.forVehicleClass ||
					(!vehicleClass.code && !vehicleClass.description) ||
					(vehicleClass.code && testType.forVehicleClass.includes(vehicleClass.code as unknown as string)) ||
					(vehicleClass.description && testType.forVehicleClass.includes(vehicleClass.description as unknown as string))
			)
			.filter(
				(testType) =>
					!vehicleSubclass ||
					!testType.forVehicleSubclass ||
					testType.forVehicleSubclass.some((forVehicleSubclass) =>
						vehicleSubclass.includes(forVehicleSubclass as VehicleSubclass)
					)
			)
			.filter(
				(testType) =>
					!numberOfWheelsDriven ||
					!testType.forVehicleWheels ||
					testType.forVehicleWheels.includes(numberOfWheelsDriven)
			)
			// for some first tests, only show them for provisional record when there are no current records in history
			.filter(
				(testType) =>
					!statusCode ||
					statusCode !== StatusCodes.PROVISIONAL ||
					!hasCurrentRecordInHistory ||
					!(vehicleType === VehicleTypes.HGV
						? filterHgvFirstTestIds.includes(testType.id)
						: filterAllFirstTestIds.includes(testType.id))
			)
			// only allow ADR tests on ADR vehicles which carry dangerous goods
			.filter((testType) => {
				const isAdrTest = adrTestIds.includes(testType.id);
				const isHGV = techRecord.techRecord_vehicleType === VehicleTypes.HGV;
				const isTRL = techRecord.techRecord_vehicleType === VehicleTypes.TRL;
				const isLGV = techRecord.techRecord_vehicleType === VehicleTypes.LGV;
				const isADRVehicle = isHGV || isTRL || isLGV;

				return isAdrTest && isADRVehicle ? techRecord.techRecord_adrDetails_dangerousGoods : true;
			})
			.map((testType: TestTypeCategory) => {
				const newTestType = { ...testType } as TestTypeCategory;

				if (Object.prototype.hasOwnProperty.call(newTestType, 'nextTestTypesOrCategories')) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					newTestType.nextTestTypesOrCategories = filterTestTypes(
						newTestType.nextTestTypesOrCategories!,
						testResult,
						hasCurrentRecordInHistory,
						techRecord
					);
				}

				return newTestType;
			})
	);
}
