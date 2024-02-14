import { TestTypeCategory } from '@api/test-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import {
  EmissionStandard, FuelType, ModTypeCode, ModeTypeDescription,
} from '@models/test-types/emissions.enum';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';

export const mockTestType = (data: Partial<TestType> = {}): TestType => ({
  testTypeId: faker.string.alphanumeric(),
  testNumber: faker.string.alphanumeric(),
  name: faker.string.alphanumeric(),
  testCode: faker.string.alphanumeric(),
  testTypeName: faker.string.alphanumeric(),
  testTypeStartTimestamp: faker.date.past(),
  testTypeEndTimestamp: faker.date.past(),
  testExpiryDate: faker.date.future(),
  certificateNumber: faker.string.alphanumeric(),
  reasonForAbandoning: null,
  testAnniversaryDate: faker.date.future(),
  prohibitionIssued: null,
  testResult: resultOfTestEnum.pass,
  seatbeltInstallationCheckDate: false,
  numberOfSeatbeltsFitted: faker.number.int(),
  lastSeatbeltInstallationCheckDate: faker.date.past(),
  emissionStandard: EmissionStandard.Euro3,
  smokeTestKLimitApplied: faker.string.alphanumeric(),
  fuelType: FuelType.Diesel,
  modType: {
    code: ModTypeCode.g,
    description: ModeTypeDescription.Engine,
  },
  modificationTypeUsed: faker.string.alphanumeric(),
  particulateTrapFitted: faker.string.alphanumeric(),
  particulateTrapSerialNumber: faker.string.alphanumeric(),
  customDefects: [],
  additionalNotesRecorded: faker.string.alphanumeric(),
  ...data,
});

export const mockTestTypeCategory = (data: Partial<TestTypeCategory>): TestTypeCategory => ({
  id: faker.string.uuid(),
  name: faker.string.alphanumeric(),
  forVehicleType: [],
  ...data,
});
