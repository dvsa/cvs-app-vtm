import {
	EUVehicleCategory,
	TechRecordPUTCarComplete,
	VehicleConfiguration,
	VehicleSubclass,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/complete';

/*
 * Can perform the following actions:
 * - Contingency tests:
 *   - Basic IVA inspection (yf4)
 *   - Appeal on a basic IVA inspection (yk4)
 *   - Basic voluntary IVA inspection (yj4)
 *   - Paid basic IVA inspection retest (yg4)
 *   - Free basic IVA inspection retest (yh4)
 *   - Basic voluntary IVA inspection retest (ys4)
 *   - IVA17 Appeal for IVA (desk based) (yk4)
 */
export const COMPLETE_CAR_1: TechRecordPUTCarComplete = {
	vin: 'COMPLETECAR1',
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'car',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['a', 'c', 's'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_euVehicleCategory: 'm1' as EUVehicleCategory,
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
 *   - Basic IVA inspection (yl4)
 *   - Appeal on a basic IVA inspection (yq4)
 *   - Basic voluntary IVA inspection (yp4)
 *   - Paid basic IVA inspection retest (ym4)
 *   - Free basic IVA inspection retest (yn4)
 *   - Basic voluntary IVA inspection retest (yt4)
 *   - IVA17 Appeal for IVA (desk based) (yq4)
 */
export const COMPLETE_CAR_2: TechRecordPUTCarComplete = {
	vin: 'COMPLETECAR2',
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'car',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['l', 'm', 'n', 'p', 't'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_euVehicleCategory: 'm1' as EUVehicleCategory,
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
 *   - Normal IVA inspection (ya4)
 *   - Appeal on a normal IVA inspection (ye4)
 *   - Normal voluntary IVA inspection (yd4)
 *   - Paid normal IVA inspection retest (yb4)
 *   - Free normal IVA inspection retest (yc4)
 *   - Normal voluntary IVA inspection retest (yr4)
 *   - IVA17 Appeal for IVA (desk based) (ye4)
 */
export const COMPLETE_CAR_3: TechRecordPUTCarComplete = {
	vin: 'COMPLETECAR3',
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'car',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleSubclass: ['r'] as VehicleSubclass,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,

	techRecord_regnDate: '2000-01-01T00:00:00.000Z',
	techRecord_manufactureYear: 2000,
	techRecord_euVehicleCategory: 'm1' as EUVehicleCategory,
	techRecord_applicantDetails_name: 'name',
	techRecord_applicantDetails_address1: 'address1',
	techRecord_applicantDetails_address2: 'address2',
	techRecord_applicantDetails_postTown: 'postTown',
	techRecord_applicantDetails_address3: 'address3',
	techRecord_applicantDetails_postCode: 'postCode',
	techRecord_applicantDetails_telephoneNumber: '5555555555',
	techRecord_applicantDetails_emailAddress: 'test@email.com',
};
