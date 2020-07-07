import {
  getCreatedTestResult,
  getFilteredTestTypeCategories,
  getTestViewState,
  getVehicleTestResultModel,
  selectFeature,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResult.selectors';
import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { initialVehicleTestResultModelState } from '@app/store/state/VehicleTestResult.state';
import { TEST_MODEL_UTILS, TESTING_UTILS } from '@app/utils';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

describe('vehicleTestResult selectors', () => {
  const vehicleTestResultModelState = {
    vehicleTestResultModel: {
      testResultId: '123'
    } as TestResultModel,
    selectedTestResultModel: {
      testResultId: '111',
      testTypes: [{ testNumber: '1' } as TestType],
      vehicleType: 'psv',
      vehicleSize: 'small',
      vehicleConfiguration: 'rigid'
    } as TestResultModel,
    editState: 1
  };

  const mockTestTypeCategoryMatch = TEST_MODEL_UTILS.mockTestTypeCategory();

  const mockTestTypeCategoryNotMatch = TEST_MODEL_UTILS.mockTestTypeCategory({
    id: '2',
    name: 'First test',
    linkedIds: ['1', '1'],
    testTypeName: 'First test',
    forVehicleType: ['hgv'],
    forVehicleSize: ['test']
  });

  it('should return the default state on initialization', () => {
    expect(selectFeature.projector(initialVehicleTestResultModelState)).toEqual({
      vehicleTestResultModel: null,
      selectedTestResultModel: null,
      editState: 0,
      error: null
    });
  });

  it('should return the vehicleTestResultModel from state', () => {
    expect(getVehicleTestResultModel.projector(vehicleTestResultModelState)).toEqual(
      vehicleTestResultModelState.vehicleTestResultModel
    );
  });

  it('should return the current state value from state', () => {
    expect(getTestViewState.projector(vehicleTestResultModelState)).toEqual(
      vehicleTestResultModelState.editState
    );
  });

  it('should return an object containing the selected test result and its test type having the specified id', () => {
    expect(selectTestTypeById('1').projector(vehicleTestResultModelState)).toEqual({
      testRecord: vehicleTestResultModelState.selectedTestResultModel,
      testType: vehicleTestResultModelState.selectedTestResultModel.testTypes[0]
    });
  });

  it('should return at least a category if attributes match, in node tree format', () => {
    const matchedCategory = getFilteredTestTypeCategories.projector(vehicleTestResultModelState, [
      mockTestTypeCategoryMatch
    ]);
    expect(matchedCategory).toEqual([{ id: '1', nodeName: 'Annual test' }]);
  });

  it('should return empty array if attribute values from test record don;t match any from taxonomy', () => {
    const matchedCategory = getFilteredTestTypeCategories.projector(vehicleTestResultModelState, [
      mockTestTypeCategoryNotMatch
    ]);
    expect(matchedCategory).toEqual([]);
  });

  it('should return reshaped vehicle test result used for create CTA ', () => {
    const mockSelectedTechRecord = {
      vin: '1',
      vrms: [{ vrm: '3', isPrimary: true }],
      systemNumber: '2',
      techRecord: [TESTING_UTILS.mockTechRecord({ euVehicleCategory: 'test2' })]
    } as VehicleTechRecordModel;

    const testResultExpected = {
      euVehicleCategory: 'test2',
      msUserDetails: null,
      systemNumber: '2',
      testResultId: '-1',
      testTypes: [
        {
          testNumber: '-1'
        }
      ],
      trailerId: undefined,
      vin: '1',
      vrm: '3'
    };

    expect(
      getCreatedTestResult.projector(vehicleTestResultModelState, mockSelectedTechRecord)
    ).toEqual(testResultExpected);
  });
});
