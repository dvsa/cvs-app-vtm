import {
  EmissionStandard, FuelType, ModTypeCode, ModeTypeDescription,
} from '@models/test-types/emissions.enum';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';

export const createMockTestType = (params: Partial<TestType> = {}): TestType => ({
  testTypeId: 'testTypeId',
  testNumber: 'testNumber',
  name: 'testName',
  testCode: 'testCode',
  testTypeName: 'testTypeName',
  testTypeStartTimestamp: '',
  testTypeEndTimestamp: '',
  testExpiryDate: '',
  certificateNumber: '',
  reasonForAbandoning: '',
  testAnniversaryDate: 'testAnniversaryDate',
  prohibitionIssued: false,
  testResult: resultOfTestEnum.fail,
  seatbeltInstallationCheckDate: false,
  numberOfSeatbeltsFitted: 0,
  lastSeatbeltInstallationCheckDate: '',
  emissionStandard: EmissionStandard.Euro3,
  smokeTestKLimitApplied: 'smokeTestKLimitApplied',
  fuelType: FuelType.Diesel,
  modificationTypeUsed: 'modificationTypeUsed',
  particulateTrapFitted: 'particulateTrapFitted',
  particulateTrapSerialNumber: 'particulateTrapSerialNumber',
  modType: {
    code: ModTypeCode.g,
    description: ModeTypeDescription.Engine,
  },
  customDefects: [],
  additionalNotesRecorded: '',
  ...params,
});
