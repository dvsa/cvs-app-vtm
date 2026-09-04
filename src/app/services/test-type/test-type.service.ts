import { Injectable } from '@angular/core';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { ReferenceDataResourceType } from '../../models/reference-data.model';
import {
	TEST_TYPES_ALL_DESK_BASED_TESTS,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2_SPEC_TEST,
	TEST_TYPES_GROUP3_SPEC_TEST,
	TEST_TYPES_GROUP4_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP15_16,
	TEST_TYPES_MSVA,
} from '../../models/testTypeId.enum';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';

@Injectable({
	providedIn: 'root',
})
export class TestTypeService {
	isTestTypeFirstTest(testTypeId: string): boolean {
		const firstTestIds = ['41', '95', '65', '66', '67', '103', '104', '82', '83', '119', '120'];
		return firstTestIds.includes(testTypeId);
	}

	isTestTypeNotifiableAlteration(testTypeId: string): boolean {
		const notifiableAlterationIds = ['38', '47', '48'];
		return notifiableAlterationIds.includes(testTypeId);
	}

	isTestTypeCOIF(testTypeId: string): boolean {
		const coifIds = ['142', '143', '175', '176'];
		return coifIds.includes(testTypeId);
	}

	isTestTypeIVA(testTypeId: string): boolean {
		const ivaIds = [
			'133',
			'134',
			'138',
			'139',
			'140',
			'165',
			'169',
			'167',
			'170',
			'135',
			'172',
			'173',
			'439',
			'449',
			'136',
			'187',
			'126',
			'186',
			'193',
			'192',
			'195',
			'162',
			'191',
			'128',
			'188',
			'189',
			'125',
			'161',
			'158',
			'159',
			'154',
			'190',
			'129',
			'196',
			'194',
			'197',
			'185',
			'420',
			'438',
			'163',
			'153',
			'184',
			'130',
			'183',
		];
		return ivaIds.includes(testTypeId);
	}

	isTestTypeAbandonable(testTypeId: string): boolean {
		// You cannot abanadon a test that is desk-based or LEC
		return ![...TEST_TYPES_ALL_DESK_BASED_TESTS, ...TEST_TYPES_GROUP15_16].includes(testTypeId);
	}

	getAbandonReasonsResourceType(testResult: TestResultSchema) {
		const testTypeId = testResult.testTypes[0].testTypeId;

		// Display TIR reasons when abandoning TIR tests
		if (TEST_TYPES_GROUP5_13.includes(testTypeId)) {
			return ReferenceDataResourceType.TirReasonsForAbandoning;
		}

		// Display MSVA reasons when abandoning MSVA tests
		if (TEST_TYPES_MSVA.includes(testTypeId)) {
			return ReferenceDataResourceType.MsvaReasonsForAbandoning;
		}

		// Display specialist reasons when abandoning non-MSVA specialist tests
		if (
			[
				...TEST_TYPES_GROUP1_SPEC_TEST,
				...TEST_TYPES_GROUP2_SPEC_TEST,
				...TEST_TYPES_GROUP3_SPEC_TEST,
				...TEST_TYPES_GROUP4_SPEC_TEST,
				...TEST_TYPES_GROUP5_SPEC_TEST,
			].includes(testTypeId)
		) {
			return ReferenceDataResourceType.SpecialistReasonsForAbandoning;
		}

		// Otherwise, display vehicle type specific reasons
		const vehicleType = testResult.vehicleType;

		if (vehicleType === VehicleTypes.PSV) {
			return ReferenceDataResourceType.ReasonsForAbandoningPsv;
		}

		if (vehicleType === VehicleTypes.HGV) {
			return ReferenceDataResourceType.ReasonsForAbandoningHgv;
		}

		if (vehicleType === VehicleTypes.TRL) {
			return ReferenceDataResourceType.ReasonsForAbandoningTrl;
		}

		// If we reach here, then we have invalid data
		throw new Error('Unexpected vehicle type');
	}
}
