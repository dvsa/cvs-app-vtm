export interface TestType {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * The list of test type IDs or categories IDs, used to determine if two test types can be added as linked within the same test.
     */
    linkedIds?: Array<string>;
    /**
     * The list of suggested test types, used to determine suggested test types for psv, trl and hgv.
     */
    suggestedTestTypeIds?: Array<string>;
    /**
     * Name of the test type
     */
    name: string;
    /**
     * Full name of the test type containing the entire path, having a business value
     */
    testTypeName?: string;
    /**
     * Name to be displayed in the mobile app suggested next test type popup
     */
    suggestedTestTypeDisplayName?: string;
    /**
     * Order in which this test type is displayed in the mobile app suggested next test type popup
     */
    suggestedTestTypeDisplayOrder?: string;
    /**
     * Used to filter in test types with a specific typeOfTest, send as a query param in the request
     */
    typeOfTest?: string;
    /**
     * This category is applying only to these vehicle types. The vehicle types should descend from its parent, but should not be necessarily the same
     */
    forVehicleType: Array<TestType.ForVehicleTypeEnum>;
    /**
     * This category is applying only to these vehicle sizes. The vehicle sizes should descend from its parent, but should not be necessarily the same
     */
    forVehicleSize?: Array<TestType.ForVehicleSizeEnum>;
    /**
     * This category is applying only to these vehicle configurations. The vehicle configurations should descend from its parent, but should not be necessarily the same
     */
    forVehicleConfiguration?: Array<string>;
    /**
     * This category is applying only to the vehicles with those number of axles. The vehicle number of axles should descend from its parent, but should not be necessarily the same. If the value is null then it means the category or test type is applicable to any number of axles.
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
}
export namespace TestType {
    export type ForVehicleTypeEnum = 'psv' | 'hgv' | 'trl' | 'lgv' | 'car' | 'small trl' | 'motorcycle';
    export const ForVehicleTypeEnum = {
        Psv: 'psv' as ForVehicleTypeEnum,
        Hgv: 'hgv' as ForVehicleTypeEnum,
        Trl: 'trl' as ForVehicleTypeEnum,
        Lgv: 'lgv' as ForVehicleTypeEnum,
        Car: 'car' as ForVehicleTypeEnum,
        SmallTrl: 'small trl' as ForVehicleTypeEnum,
        Motorcycle: 'motorcycle' as ForVehicleTypeEnum,
    };
    export type ForVehicleSizeEnum = 'small' | 'large';
    export const ForVehicleSizeEnum = {
        Small: 'small' as ForVehicleSizeEnum,
        Large: 'large' as ForVehicleSizeEnum
    };
}
