import {
  getFilteredTestTypeCategories,
  getTestViewState,
  getVehicleTestResultModel,
  selectFeature,
  selectTestType
} from '@app/store/selectors/VehicleTestResult.selectors';
import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { initialVehicleTestResultModelState } from '@app/store/state/VehicleTestResult.state';
import { TEST_MODEL_UTILS } from '@app/utils';
import { VehicleTechRecordEdit } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';

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

  const mockRouterParams = {
    params: { id: '1' }
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

  it('should return an object containing the selected test result & the test type', () => {
    expect(selectTestType.projector(vehicleTestResultModelState, mockRouterParams)).toEqual({
      testRecord: vehicleTestResultModelState.selectedTestResultModel,
      testType: vehicleTestResultModelState.selectedTestResultModel.testTypes[0]
    });
  });

  it('should return at least a category if attributes match, in node tree format', () => {
    const activeTechRec = {} as TechRecord;
    const matchedCategory = getFilteredTestTypeCategories.projector(
      vehicleTestResultModelState,
      [mockTestTypeCategoryMatch],
      activeTechRec
    );
    expect(matchedCategory).toEqual([{ id: '1', nodeName: 'Annual test' }]);
  });

  it('should return empty array if attribute values from test record don;t match any from taxonomy', () => {
    const activeTechRec = {} as TechRecord;
    const matchedCategory = getFilteredTestTypeCategories.projector(
      vehicleTestResultModelState,
      [mockTestTypeCategoryNotMatch],
      activeTechRec
    );
    expect(matchedCategory).toEqual([]);
  });
});
