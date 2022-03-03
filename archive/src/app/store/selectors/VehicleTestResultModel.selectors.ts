import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IVehicleTestResultModelState } from '@app/store/state/VehicleTestResultModel.state';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { TestTypeCategory } from '@app/models/test-type-category';
import { TreeData } from '@app/models/tree-data';
import { getTestTypeCategories } from '@app/store/selectors/ReferenceData.selectors';

export const selectFeature = createFeatureSelector<IVehicleTestResultModelState>(
  'vehicleTestResultModel'
);

export const getVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.vehicleTestResultModel
);

export const selectTestTypeById = (id: string) =>
  createSelector(selectFeature, (state: IVehicleTestResultModelState) => {
    let testType: TestType;
    let testRecord: TestResultModel;

    if (state.selectedTestResultModel) {
      testRecord = state.selectedTestResultModel;

      testType = state.selectedTestResultModel.testTypes.filter(
        (testTypeRes: TestType) => testTypeRes.testNumber === id
      )[0];
    }
    const test: TestRecordTestType = { testType, testRecord };
    return test;
  });

export const getTestViewState = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.editState
);

export const getSelectedVehicleTestResultModel = createSelector(
  selectFeature,
  (state: IVehicleTestResultModelState) => state.selectedTestResultModel
);

export const getFilteredTestTypeCategories = createSelector(
  selectFeature,
  getTestTypeCategories,
  (state: IVehicleTestResultModelState, testTypeCategories: TestTypeCategory[]) => {
    let testRecord: TestResultModel;
    let filteredCategories;

    if (state.selectedTestResultModel) {
      testRecord = state.selectedTestResultModel;
      filteredCategories = testTypeCategories.filter((element: TestTypeCategory) => {
        return filterCategories(element, testRecord);
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
