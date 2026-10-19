import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { ReferenceDataResourceType } from '../../models/reference-data.model';
import {
	TEST_TYPES_ALL_DESK_BASED_TESTS,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_MSVA,
} from '../../models/testTypeId.enum';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';
import { TestTypeService } from './test-type.service';

describe('TestTypeService', () => {
	let service: TestTypeService;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [TestTypeService] });
		service = TestBed.inject(TestTypeService);
	});

	describe('isTestTypeFirstTest', () => {
		it('should identify first test types', () => {
			expect(service.isTestTypeFirstTest('41')).toBe(true);
			expect(service.isTestTypeFirstTest('999')).toBe(false);
		});
	});

	describe('isTestTypeNotifiableAlteration', () => {
		it('should identify notifiable alteration test types', () => {
			expect(service.isTestTypeNotifiableAlteration('38')).toBe(true);
			expect(service.isTestTypeNotifiableAlteration('999')).toBe(false);
		});
	});

	describe('isTestTypeCOIF', () => {
		it('should identify COIF test types', () => {
			expect(service.isTestTypeCOIF('142')).toBe(true);
			expect(service.isTestTypeCOIF('999')).toBe(false);
		});
	});

	describe('isTestTypeIVA', () => {
		it('should identify IVA test types', () => {
			expect(service.isTestTypeIVA('133')).toBe(true);
			expect(service.isTestTypeIVA('999')).toBe(false);
		});
	});

	describe('isTestTypeAbandonable', () => {
		it('should determine abandonable test types', () => {
			// Desk based should not be abandonable
			const deskBased = TEST_TYPES_ALL_DESK_BASED_TESTS[0];
			expect(service.isTestTypeAbandonable(deskBased)).toBe(false);
			// A normal test type should be abandonable
			expect(service.isTestTypeAbandonable('56')).toBe(true);
		});
	});

	describe('getAbandonReasonsResourceType', () => {
		it('returns TIR reasons for group5/13 tests', () => {
			const result = service.getAbandonReasonsResourceType({
				testTypes: [{ testTypeId: TEST_TYPES_GROUP5_13[0] } as any],
			} as any);
			expect(result).toBe(ReferenceDataResourceType.TirReasonsForAbandoning);
		});

		it('returns MSVA reasons for MSVA tests', () => {
			const result = service.getAbandonReasonsResourceType({
				testTypes: [{ testTypeId: TEST_TYPES_MSVA[0] } as any],
			} as any);
			expect(result).toBe(ReferenceDataResourceType.MsvaReasonsForAbandoning);
		});

		it('returns Specialist reasons for specialist tests', () => {
			const result = service.getAbandonReasonsResourceType({
				testTypes: [{ testTypeId: TEST_TYPES_GROUP1_SPEC_TEST[0] } as any],
			} as any);
			expect(result).toBe(ReferenceDataResourceType.SpecialistReasonsForAbandoning);
		});

		it('returns vehicle-type specific reasons', () => {
			const passPsv = { testTypes: [{ testTypeId: '999' } as any], vehicleType: VehicleTypes.PSV } as any;
			expect(service.getAbandonReasonsResourceType(passPsv)).toBe(ReferenceDataResourceType.ReasonsForAbandoningPsv);

			const passHgv = { testTypes: [{ testTypeId: '999' } as any], vehicleType: VehicleTypes.HGV } as any;
			expect(service.getAbandonReasonsResourceType(passHgv)).toBe(ReferenceDataResourceType.ReasonsForAbandoningHgv);

			const passTrl = { testTypes: [{ testTypeId: '999' } as any], vehicleType: VehicleTypes.TRL } as any;
			expect(service.getAbandonReasonsResourceType(passTrl)).toBe(ReferenceDataResourceType.ReasonsForAbandoningTrl);
		});

		it('throws for unexpected vehicle types', () => {
			expect(() => service.getAbandonReasonsResourceType({ testTypes: [{ testTypeId: '999' } as any] } as any)).toThrow(
				'Unexpected vehicle type'
			);
		});
	});

	describe('isADRTest', () => {
		it('should detect ADR tests', () => {
			expect(service.isADRTest({ testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0] } as any] } as any)).toBe(true);
			expect(service.isADRTest({ testTypes: [{ testTypeId: '999' } as any] } as any)).toBe(false);
		});
	});

	describe('shouldShowExpiryDate', () => {
		it('returns true for group7 pass tests', () => {
			const t = { testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0], testResult: TestResults.PASS } as any] } as any;
			expect(service.shouldShowExpiryDate(t)).toBe(true);
		});

		it('returns false for group7 fail or abandoned', () => {
			const fail = { testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0], testResult: TestResults.FAIL } as any] } as any;
			const abandoned = {
				testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0], testResult: TestResults.ABANDONED } as any],
			} as any;
			expect(service.shouldShowExpiryDate(fail)).toBe(false);
			expect(service.shouldShowExpiryDate(abandoned)).toBe(false);
		});

		it('returns false for non-group7', () => {
			const t = { testTypes: [{ testTypeId: '999', testResult: TestResults.PASS } as any] } as any;
			expect(service.shouldShowExpiryDate(t)).toBe(false);
		});
	});

	describe('isCentralDocsApplicable', () => {
		it('returns true for central docs test types that are not fail', () => {
			const t = {
				testTypes: [{ testTypeId: TEST_TYPES_GROUP9_10_CENTRAL_DOCS[0], testResult: TestResults.PASS } as any],
			} as any;
			expect(service.isCentralDocsApplicable(t)).toBe(true);
		});

		it('returns false for fail results', () => {
			const t = {
				testTypes: [{ testTypeId: TEST_TYPES_GROUP9_10_CENTRAL_DOCS[0], testResult: TestResults.FAIL } as any],
			} as any;
			expect(service.isCentralDocsApplicable(t)).toBe(false);
		});
	});

	describe('isCertificateNumberApplicable', () => {
		it('returns false for fail', () => {
			const t = { testTypes: [{ testTypeId: '999', testResult: TestResults.FAIL } as any] } as any;
			expect(service.isCertificateNumberApplicable(t)).toBe(false);
		});

		it('returns true for central docs pass with issueRequired true', () => {
			const t = {
				testTypes: [
					{
						testTypeId: TEST_TYPES_GROUP9_10_CENTRAL_DOCS[0],
						testResult: TestResults.PASS,
						centralDocs: { issueRequired: true },
					} as any,
				],
			} as any;
			expect(service.isCertificateNumberApplicable(t)).toBe(true);
		});

		it('returns false for central docs pass with issueRequired false', () => {
			const t = {
				testTypes: [
					{
						testTypeId: TEST_TYPES_GROUP9_10_CENTRAL_DOCS[0],
						testResult: TestResults.PASS,
						centralDocs: { issueRequired: false },
					} as any,
				],
			} as any;
			expect(service.isCertificateNumberApplicable(t)).toBe(false);
		});

		it('returns true for non-central-docs non-fail', () => {
			const t = { testTypes: [{ testTypeId: '999', testResult: TestResults.PASS } as any] } as any;
			expect(service.isCertificateNumberApplicable(t)).toBe(true);
		});
	});

	describe('isGeneratedADRCertificateApplicable', () => {
		it('returns true for group7 pass', () => {
			const t = { testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0], testResult: TestResults.PASS } as any] } as any;
			expect(service.isGeneratedADRCertificateApplicable(t)).toBe(true);
		});

		it('returns false otherwise', () => {
			const fail = { testTypes: [{ testTypeId: TEST_TYPES_GROUP7[0], testResult: TestResults.FAIL } as any] } as any;
			const notGroup7 = { testTypes: [{ testTypeId: '999', testResult: TestResults.PASS } as any] } as any;
			expect(service.isGeneratedADRCertificateApplicable(fail)).toBe(false);
			expect(service.isGeneratedADRCertificateApplicable(notGroup7)).toBe(false);
		});
	});
});
