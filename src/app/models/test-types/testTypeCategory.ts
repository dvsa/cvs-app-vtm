/**
 * Test Types Microservice
 * This is the API spec for the test types microservice. This microservice has one endpoint which will get all of the test type data.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { TestType } from './testType';

/**
 * A category that can be composed of zero/more categories + one/more test types
 */
export interface TestTypeCategory {
	/**
	 * Unique identifier
	 */
	id: string;
	/**
	 * used in helping to sort test types
	 */
	sortId?: string;
	/**
	 * The lsit of test type IDs or categories IDs, used to determine if two test types can be added as linked within the same test.
	 */
	linkedIds?: Array<string>;
	/**
	 * Name of the category
	 */
	name: string;
	/**
	 * This category is applying only to these vehicle types.
	 */
	forVehicleType: Array<TestTypeCategory.ForVehicleTypeEnum>;
	/**
	 * Used to filter test types that allow creating tests on Provisional Records
	 */
	forProvisionalStatus?: boolean;
	/**
	 * Used to filter test types that allow creating tests on Provisional Records and not current
	 */
	forProvisionalStatusOnly?: boolean;
	/**
	 * Used to filter in test types with a specific typeOfTest, send as a query param in the request
	 */
	typeOfTest?: string;
	/**
	 * This category is applying only to these vehicle sizes.
	 */
	forVehicleSize?: Array<TestTypeCategory.ForVehicleSizeEnum>;
	/**
	 * This category is applying only to these vehicle configurations.
	 */
	forVehicleConfiguration?: Array<string>;
	/**
	 * This category is applying only to the vehicles with those number of axles. If the value is null then it means the category or test type is applicable to any number of axles.
	 */
	forVehicleAxles?: Array<number>;
	/**
	 * This category is applying only to the vehicles with that eu category. The eu vehicle category should descend from its parent, but should not be necessarily the same. If the value is null then it means the category or test type is applicable to any eu vehicle category.
	 */
	forEuVehicleCategory?: Array<string>;
	/**
	 * This category is applying only to the vehicles with that vehicle class. The vehicle class should descend from its parent, but should not be necessarily the same. If the value is null then it means the category or test type is applicable to any vehicle class.
	 */
	forVehicleClass?: Array<string>;
	/**
	 * This category is applying only to the vehicles with that vehicle subclass. The vehicle subclass should descend from its parent, but should not be necessarily the same. If the value is null then it means the category or test type is applicable to any vehicle subclass.
	 */
	forVehicleSubclass?: Array<string>;
	/**
	 * This category is applying only to the vehicles with those number of wheels. The vehicle number of wheels should descend from its parent, but should not be necessarily the same. If the value is null then it means the category or test type is applicable to any number of wheels.
	 */
	forVehicleWheels?: Array<number>;
	/**
	 * This is an array composed of TestTypeCategories and/or TestTypes
	 */
	nextTestTypesOrCategories?: Array<TestType | TestTypeCategory>;
}
export namespace TestTypeCategory {
	export type ForVehicleTypeEnum = 'psv' | 'hgv' | 'trl' | 'lgv' | 'car' | 'small trl' | 'motorcycle';
	export const ForVehicleTypeEnum = {
		Psv: 'psv' as ForVehicleTypeEnum,
		Hgv: 'hgv' as ForVehicleTypeEnum,
		Trl: 'trl' as ForVehicleTypeEnum,
		Car: 'car' as ForVehicleTypeEnum,
		Lgv: 'lgv' as ForVehicleTypeEnum,
		SmallTrl: 'small trl' as ForVehicleTypeEnum,
		Motorcycle: 'motorcycle' as ForVehicleTypeEnum,
	};
	export type ForVehicleSizeEnum = 'small' | 'large';
	export const ForVehicleSizeEnum = {
		Small: 'small' as ForVehicleSizeEnum,
		Large: 'large' as ForVehicleSizeEnum,
	};
}