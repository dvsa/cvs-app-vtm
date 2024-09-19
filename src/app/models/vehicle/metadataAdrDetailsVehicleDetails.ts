/**
 * Vehicles Microservice
 * This is the API spec for the vehicle microservice. Endpoints and parameters only exist for the operations getVehicle and getTechRecords. Other operations within the microservice are out of scope.
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface MetadataAdrDetailsVehicleDetails {
	typeFe?: Array<MetadataAdrDetailsVehicleDetails.TypeFeEnum>;
}
export namespace MetadataAdrDetailsVehicleDetails {
	export type TypeFeEnum =
		| 'Artic tractor'
		| 'Rigid box body'
		| 'Rigid sheeted load'
		| 'Rigid tank'
		| 'Rigid skeletal'
		| 'Rigid battery'
		| 'Full drawbar box body'
		| 'Full drawbar sheeted load'
		| 'Full drawbar tank'
		| 'Full drawbar skeletal'
		| 'Full drawbar battery'
		| 'Centre axle box body'
		| 'Centre axle sheeted load'
		| 'Centre axle tank'
		| 'Centre axle skeletal'
		| 'Centre axle battery'
		| 'Semi trailer box body'
		| 'Semi trailer sheeted load'
		| 'Semi trailer tank'
		| 'Semi trailer skeletal'
		| 'Semi trailer battery';
	export const TypeFeEnum = {
		ArticTractor: 'Artic tractor' as TypeFeEnum,
		RigidBoxBody: 'Rigid box body' as TypeFeEnum,
		RigidSheetedLoad: 'Rigid sheeted load' as TypeFeEnum,
		RigidTank: 'Rigid tank' as TypeFeEnum,
		RigidSkeletal: 'Rigid skeletal' as TypeFeEnum,
		RigidBattery: 'Rigid battery' as TypeFeEnum,
		FullDrawbarBoxBody: 'Full drawbar box body' as TypeFeEnum,
		FullDrawbarSheetedLoad: 'Full drawbar sheeted load' as TypeFeEnum,
		FullDrawbarTank: 'Full drawbar tank' as TypeFeEnum,
		FullDrawbarSkeletal: 'Full drawbar skeletal' as TypeFeEnum,
		FullDrawbarBattery: 'Full drawbar battery' as TypeFeEnum,
		CentreAxleBoxBody: 'Centre axle box body' as TypeFeEnum,
		CentreAxleSheetedLoad: 'Centre axle sheeted load' as TypeFeEnum,
		CentreAxleTank: 'Centre axle tank' as TypeFeEnum,
		CentreAxleSkeletal: 'Centre axle skeletal' as TypeFeEnum,
		CentreAxleBattery: 'Centre axle battery' as TypeFeEnum,
		SemiTrailerBoxBody: 'Semi trailer box body' as TypeFeEnum,
		SemiTrailerSheetedLoad: 'Semi trailer sheeted load' as TypeFeEnum,
		SemiTrailerTank: 'Semi trailer tank' as TypeFeEnum,
		SemiTrailerSkeletal: 'Semi trailer skeletal' as TypeFeEnum,
		SemiTrailerBattery: 'Semi trailer battery' as TypeFeEnum,
	};
}