import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	EUVehicleCategory,
	TechRecordPUTLGVComplete,
	VehicleConfiguration,
	VehicleSubclass,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/complete';

/*
 * Can perform the following actions:
 * - Contingency tests:
 *   - Basic IVA inspection (yf7)
 *   - Basic voluntary IVA inspection (yj7)
 *   - Paid basic IVA inspection retest (yg7)
 *   - Free basic IVA inspection retest (yh7)
 *   - Basic voluntary IVA inspection retest (ys7)
 *   - IVA17 Appeal for IVA (desk based) (yk7)
 */
export const COMPLETE_LGV_1: TechRecordPUTLGVComplete = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'lgv',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['a', 'c', 's'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_euVehicleCategory: 'n1' as EUVehicleCategory,
	techRecord_applicantDetails_name: 'name',
	techRecord_applicantDetails_address1: 'address1',
	techRecord_applicantDetails_address2: 'address2',
	techRecord_applicantDetails_postTown: 'postTown',
	techRecord_applicantDetails_address3: 'address3',
	techRecord_applicantDetails_postCode: 'postCode',
	techRecord_applicantDetails_telephoneNumber: '5555555555',
	techRecord_applicantDetails_emailAddress: 'test@email.com',
};

/*
 * Can perform the following actions:
 * - Contingency tests:
 *   - Basic IVA inspection (yl7)
 *   - Basic voluntary IVA inspection (yp7)
 *   - Paid basic IVA inspection retest (ym7)
 *   - Free basic IVA inspection retest (yn7)
 *   - Basic voluntary IVA inspection retest (yt7)
 *   - IVA17 Appeal for IVA (desk based) (yq7)
 */
export const COMPLETE_LGV_2: TechRecordPUTLGVComplete = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'lgv',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['l', 'm', 'n', 'p', 't'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_euVehicleCategory: 'n1' as EUVehicleCategory,
	techRecord_applicantDetails_name: 'name',
	techRecord_applicantDetails_address1: 'address1',
	techRecord_applicantDetails_address2: 'address2',
	techRecord_applicantDetails_postTown: 'postTown',
	techRecord_applicantDetails_address3: 'address3',
	techRecord_applicantDetails_postCode: 'postCode',
	techRecord_applicantDetails_telephoneNumber: '5555555555',
	techRecord_applicantDetails_emailAddress: 'test@email.com',
};

/*
 * Can perform the following actions:
 * - Contingency tests:
 *   - Normal IVA inspection (ya7)
 *   - Appeal on a normal IVA inspection (ye7)
 *   - Normal voluntary IVA inspection (yd4)
 *   - Paid normal IVA inspection retest (yb7)
 *   - Free normal IVA inspection retest (yc7)
 *   - Normal voluntary IVA inspection retest (yr7)
 *   - IVA17 Appeal for IVA (desk based) (ye7)
 */
export const COMPLETE_LGV_3: TechRecordPUTLGVComplete = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'lgv',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['r'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_euVehicleCategory: 'n1' as EUVehicleCategory,
	techRecord_applicantDetails_name: 'name',
	techRecord_applicantDetails_address1: 'address1',
	techRecord_applicantDetails_address2: 'address2',
	techRecord_applicantDetails_postTown: 'postTown',
	techRecord_applicantDetails_address3: 'address3',
	techRecord_applicantDetails_postCode: 'postCode',
	techRecord_applicantDetails_telephoneNumber: '5555555555',
	techRecord_applicantDetails_emailAddress: 'test@email.com',
};
