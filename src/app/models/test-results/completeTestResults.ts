/**
 * Test Results Microservice
 * This is the API spec for capturing test results. These test result will be stored in the AWS DynamoDB database. Authorization details will be updated once we have confirmed the security scheme we are using.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CompleteTestResultsVehicleClass } from './completeTestResultsVehicleClass';
import { TestTypes } from './testTypes';

export interface CompleteTestResults {
	/**
	 * It defines the link between a test and the vehicle, by uniqeuly identifing the vehicle.
	 */
	systemNumber?: string;
	/**
	 * Mandatory for PSV and HGV, not applicable to TRL
	 */
	vrm?: string;
	/**
	 * Mandatory for TRL, not applicable to PSV and HGV
	 */
	trailerId?: string;
	vin?: string;
	/**
	 * Not sent from FE, calculated in the BE. When the test result is submitted, in BE, the VRM of the vehicle will be copied into vehicleId also.
	 */
	vehicleId?: string;
	/**
	 * Not sent from FE, calculated in the BE.
	 */
	deletionFlag?: boolean;
	/**
	 * Array of archived test-results. The test-results in this array won't have the testHistory attribute and testVersion will always be archived. Should not be sent when performing an update
	 */
	testHistory?: Array<CompleteTestResults>;
	/**
	 * Tests submitted from the mobile app won't have this attribute. Tests updated/created by VTM will do.
	 */
	testVersion?: CompleteTestResults.TestVersionEnum;
	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	reasonForCreation?: string;
	/**
	 * Not sent from FE, calculated in the BE.
	 */
	createdAt?: Date;
	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	createdByName?: string;
	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	createdById?: string;
	/**
	 * Not sent from FE, calculated in the BE.
	 */
	lastUpdatedAt?: Date;
	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	lastUpdatedByName?: string;
	/**
	 * Applicable only when updating/creating a test from VTM
	 */
	lastUpdatedById?: string;
	/**
	 * Not sent from FE, calculated in BE. Applicable only when updating a test from VTM. Used to determine if a certificate should be emailed or not after an update.
	 */
	shouldEmailCertificate?: string;
	testStationName?: string;
	testStationPNumber?: string;
	testStationType?: CompleteTestResults.TestStationTypeEnum;
	testerName?: string;
	testerStaffId?: string;
	testResultId?: string;
	testerEmailAddress?: string;
	testStartTimestamp?: Date;
	testEndTimestamp?: Date;
	testStatus?: CompleteTestResults.TestStatusEnum;
	/**
	 * Required for Cancelled tests. Nullable only for Submitted and Abandoned tests.
	 */
	reasonForCancellation?: string;
	vehicleClass?: CompleteTestResultsVehicleClass;
	/**
	 * Used for car and lgv.
	 */
	vehicleSubclass?: Array<string>;
	vehicleType?: CompleteTestResults.VehicleTypeEnum;
	/**
	 * mandatory for PSV only, not applicable for HGV and TRL
	 */
	numberOfSeats?: number;
	vehicleConfiguration?: CompleteTestResults.VehicleConfigurationEnum;
	/**
	 * Nullable only for Cancelled tests & not applicable to TRL
	 */
	odometerReading?: number;
	/**
	 * Nullable only for Cancelled tests & not applicable to TRL
	 */
	odometerReadingUnits?: CompleteTestResults.OdometerReadingUnitsEnum;
	preparerId?: string;
	preparerName?: string;
	numberOfWheelsDriven?: number;
	/**
	 * Nullable only for Cancelled tests.
	 */
	euVehicleCategory?: CompleteTestResults.EuVehicleCategoryEnum;
	/**
	 * Nullable only for Cancelled tests.
	 */
	countryOfRegistration?: string;
	/**
	 * Mandatory for PSV only & not applicable to HGV and TRL
	 */
	vehicleSize?: CompleteTestResults.VehicleSizeEnum;
	noOfAxles?: number;
	/**
	 * Used only for PSV and HGV
	 */
	regnDate?: string;
	/**
	 * Used only for TRL
	 */
	firstUseDate?: string;
	testTypes?: TestTypes;
}
export namespace CompleteTestResults {
	export type TestVersionEnum = 'current' | 'archived';
	export const TestVersionEnum = {
		Current: 'current' as TestVersionEnum,
		Archived: 'archived' as TestVersionEnum,
	};
	export type TestStationTypeEnum = 'atf' | 'gvts' | 'hq';
	export const TestStationTypeEnum = {
		Atf: 'atf' as TestStationTypeEnum,
		Gvts: 'gvts' as TestStationTypeEnum,
		Hq: 'hq' as TestStationTypeEnum,
	};
	export type TestStatusEnum = 'submitted' | 'cancelled';
	export const TestStatusEnum = {
		Submitted: 'submitted' as TestStatusEnum,
		Cancelled: 'cancelled' as TestStatusEnum,
	};
	export type VehicleTypeEnum = 'psv' | 'hgv' | 'trl' | 'car' | 'lgv' | 'motorcycle';
	export const VehicleTypeEnum = {
		Psv: 'psv' as VehicleTypeEnum,
		Hgv: 'hgv' as VehicleTypeEnum,
		Trl: 'trl' as VehicleTypeEnum,
		Car: 'car' as VehicleTypeEnum,
		Lgv: 'lgv' as VehicleTypeEnum,
		Motorcycle: 'motorcycle' as VehicleTypeEnum,
	};
	export type VehicleConfigurationEnum =
		| 'rigid'
		| 'articulated'
		| 'centre axle drawbar'
		| 'semi-car transporter'
		| 'semi-trailer'
		| 'low loader'
		| 'other'
		| 'drawbar'
		| 'four-in-line'
		| 'dolly'
		| 'full drawbar';
	export const VehicleConfigurationEnum = {
		Rigid: 'rigid' as VehicleConfigurationEnum,
		Articulated: 'articulated' as VehicleConfigurationEnum,
		CentreAxleDrawbar: 'centre axle drawbar' as VehicleConfigurationEnum,
		SemiCarTransporter: 'semi-car transporter' as VehicleConfigurationEnum,
		SemiTrailer: 'semi-trailer' as VehicleConfigurationEnum,
		LowLoader: 'low loader' as VehicleConfigurationEnum,
		Other: 'other' as VehicleConfigurationEnum,
		Drawbar: 'drawbar' as VehicleConfigurationEnum,
		FourInLine: 'four-in-line' as VehicleConfigurationEnum,
		Dolly: 'dolly' as VehicleConfigurationEnum,
		FullDrawbar: 'full drawbar' as VehicleConfigurationEnum,
	};
	export type OdometerReadingUnitsEnum = 'kilometres' | 'miles';
	export const OdometerReadingUnitsEnum = {
		Kilometres: 'kilometres' as OdometerReadingUnitsEnum,
		Miles: 'miles' as OdometerReadingUnitsEnum,
	};
	export type EuVehicleCategoryEnum =
		| 'm1'
		| 'm2'
		| 'm3'
		| 'n1'
		| 'n2'
		| 'n3'
		| 'o1'
		| 'o2'
		| 'o3'
		| 'o4'
		| 'l1e-a'
		| 'l1e'
		| 'l2e'
		| 'l3e'
		| 'l4e'
		| 'l5e'
		| 'l6e'
		| 'l7e';
	export const EuVehicleCategoryEnum = {
		M1: 'm1' as EuVehicleCategoryEnum,
		M2: 'm2' as EuVehicleCategoryEnum,
		M3: 'm3' as EuVehicleCategoryEnum,
		N1: 'n1' as EuVehicleCategoryEnum,
		N2: 'n2' as EuVehicleCategoryEnum,
		N3: 'n3' as EuVehicleCategoryEnum,
		O1: 'o1' as EuVehicleCategoryEnum,
		O2: 'o2' as EuVehicleCategoryEnum,
		O3: 'o3' as EuVehicleCategoryEnum,
		O4: 'o4' as EuVehicleCategoryEnum,
		L1eA: 'l1e-a' as EuVehicleCategoryEnum,
		L1e: 'l1e' as EuVehicleCategoryEnum,
		L2e: 'l2e' as EuVehicleCategoryEnum,
		L3e: 'l3e' as EuVehicleCategoryEnum,
		L4e: 'l4e' as EuVehicleCategoryEnum,
		L5e: 'l5e' as EuVehicleCategoryEnum,
		L6e: 'l6e' as EuVehicleCategoryEnum,
		L7e: 'l7e' as EuVehicleCategoryEnum,
	};
	export type VehicleSizeEnum = 'large' | 'small';
	export const VehicleSizeEnum = {
		Large: 'large' as VehicleSizeEnum,
		Small: 'small' as VehicleSizeEnum,
	};
}
