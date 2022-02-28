import { TestTypesApplicable } from '@app/test-record/test-record.mapper';

export const TEST_TYPE_APPLICABLE_UTILS = {
  mockTestTypesApplicable
};

function mockTestTypesApplicable() {
  return {
    seatBeltApplicable: { 1: 'test' },
    defectsApplicable: { 44: 'test' },
    emissionDetailsApplicable: { 44: 'test' },
    anniversaryDateApplicable: { 3: 'test' },
    expiryDateApplicable: { 50: 'test' },
    certificateApplicable: { 50: 'test' },
    specialistTestApplicable: { 125: 'test' },
    specialistCOIFApplicable: { 142: 'test' },
    specialistCertificateApplicable: { 143: 'test' }
  } as TestTypesApplicable;
}
