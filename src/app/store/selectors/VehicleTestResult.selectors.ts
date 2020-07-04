import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IVehicleTestResultState } from '@app/store/state/VehicleTestResult.state';
import { TestResultModel } from '@app/models/test-result.model';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { TestTypeCategory } from '@app/models/test-type-category';
import { TreeData } from '@app/models/tree-data';

import { getTestTypeCategories } from '@app/store/selectors/ReferenceData.selectors';
import { getSelectedVehicleTechRecord } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS } from '@app/app.enums';
import { getRouterParams } from '@app/store/selectors/route.selectors';

export const selectFeature = createFeatureSelector<IVehicleTestResultState>(
  'vehicleTestResultModel'
);

export const getVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultState) => state.vehicleTestResultModel
);

export const selectTestType = createSelector(
  selectFeature,
  getRouterParams,
  (state: IVehicleTestResultState, routerParams) => {
    let testType: TestType;
    let testRecord: TestResultModel;
    let id: string;

    if (state.selectedTestResultModel) {
      testRecord = state.selectedTestResultModel;
      id = !!routerParams ? routerParams.params.id : '';

      testType = state.selectedTestResultModel.testTypes.filter(
        (testTypeRes: TestType) => testTypeRes.testNumber === id
      )[0];
    }
    const test: TestRecordTestType = { testType, testRecord };
    return test;
  }
);

export const getTestViewState = createSelector(
  selectFeature,
  (state: IVehicleTestResultState) => state.editState
);

export const getSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultState) => state.selectedTestResultModel
);

export const getActiveTechRecord = createSelector(
  selectFeature,
  getSelectedVehicleTechRecord,
  (state: IVehicleTestResultState, selectedRecord: VehicleTechRecordModel) => {
    let record: TechRecord;
    if (selectedRecord) {
      const techRecords = selectedRecord.techRecord;

      record = techRecords.find((tRecord) => tRecord.statusCode === RECORD_STATUS.CURRENT);
      if (record) {
        return record;
      }

      record = techRecords.find((tRecord) => tRecord.statusCode === RECORD_STATUS.PROVISIONAL);
      if (record) {
        return record;
      }

      record = techRecords
        .filter((tRecord) => tRecord.statusCode === RECORD_STATUS.ARCHIVED)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      if (record) {
        return record;
      }
    }
  }
);

export const getFilteredTestTypeCategories = createSelector(
  selectFeature,
  getTestTypeCategories,
  getActiveTechRecord,
  (state: IVehicleTestResultState, testTypeCategories: TestTypeCategory[], techRecord) => {
    let record;
    let filteredCategories;

    if (testTypeCategories) {
      record = !!state.selectedTestResultModel
        ? state.selectedTestResultModel
        : !!techRecord
        ? techRecord
        : [];
      filteredCategories = testTypeCategories.filter((element: TestTypeCategory) => {
        return filterCategories(element, record);
      });
    }
    filteredCategories = getTestTypeTree(filteredCategories, 0);

    return filteredCategories;
  }
);

function getTestTypeTree(filteredCategories, level: number) {
  return filteredCategories
    ? filteredCategories.reduce((accumulator, testObj) => {
        const value = testObj.nextTestTypesOrCategories;
        const node: TreeData = {} as TreeData;
        node.nodeName = testObj.name;
        node.id = testObj.id;

        if (value != null) {
          if (typeof value === 'object') {
            node.children = getTestTypeTree(value, level + 1);
          } else {
            node.children = [];
          }
        }

        return accumulator.concat(node);
      }, [])
    : console.error('Error: Sorry, no filtered categories available in State');
}

function filterCategories(category: TestTypeCategory, testRecord: TestResultModel) {
  const vehicleClass = !!testRecord.vehicleClass
    ? !!testRecord.vehicleClass.code
      ? testRecord.vehicleClass.code
      : ''
    : '';
  const vehicleSubclass = !!testRecord.vehicleSubclass ? testRecord.vehicleSubclass[0] : '';

  if (category.forVehicleType && !category.forVehicleType.includes(testRecord.vehicleType)) {
    return false;
  }
  if (category.forVehicleSize && !category.forVehicleSize.includes(testRecord.vehicleSize)) {
    return false;
  }
  if (
    category.forVehicleConfiguration &&
    !category.forVehicleConfiguration.includes(testRecord.vehicleConfiguration)
  ) {
    return false;
  }
  if (category.forVehicleAxles && !category.forVehicleAxles.includes(testRecord.noOfAxles)) {
    return false;
  }
  if (
    category.forEuVehicleCategory &&
    testRecord.euVehicleCategory &&
    !category.forEuVehicleCategory.includes(testRecord.euVehicleCategory)
  ) {
    return false;
  }
  if (
    category.forVehicleWheels &&
    !category.forVehicleWheels.includes(testRecord.numberOfWheelsDriven)
  ) {
    return false;
  }
  if (category.forVehicleClass && !category.forVehicleClass.includes(vehicleClass)) {
    return false;
  }
  if (category.forVehicleSubclass && !category.forVehicleSubclass.includes(vehicleSubclass)) {
    return false;
  }

  return category;
}
