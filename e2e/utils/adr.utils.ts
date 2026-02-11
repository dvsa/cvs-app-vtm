import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';

export function isAdrVehicle(
	data: Partial<TechRecordType<'put'>>
): data is Partial<TechRecordVehicleType<'hgv' | 'trl' | 'lgv', 'put'>> {
	return (
		data.techRecord_vehicleType === 'hgv' ||
		data.techRecord_vehicleType === 'trl' ||
		data.techRecord_vehicleType === 'lgv'
	);
}

export function isApprovedToCarryDangerousGoods(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return data.techRecord_adrDetails_dangerousGoods === true;
}

export function isCarryingType2Explosives(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	if (!Array.isArray(data.techRecord_adrDetails_permittedDangerousGoods)) return false;
	return data.techRecord_adrDetails_permittedDangerousGoods.includes(ADRDangerousGood.EXPLOSIVES_TYPE_2);
}

export function isCarryingType3Explosives(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	if (!Array.isArray(data.techRecord_adrDetails_permittedDangerousGoods)) return false;
	return data.techRecord_adrDetails_permittedDangerousGoods.includes(ADRDangerousGood.EXPLOSIVES_TYPE_3);
}

export function isCarryingExplosives(data: Partial<TechRecordType<'put'>>): boolean {
	return isCarryingType2Explosives(data) || isCarryingType3Explosives(data);
}

export function isTank(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	if (!data.techRecord_adrDetails_vehicleDetails_type) return false;
	return data.techRecord_adrDetails_vehicleDetails_type.includes('tank');
}

export function isBattery(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	if (!data.techRecord_adrDetails_vehicleDetails_type) return false;
	return data.techRecord_adrDetails_vehicleDetails_type.includes('battery');
}

export function isTankOrBattery(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return isTank(data) || isBattery(data);
}

export function isPermittedUnderTankCode(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return (
		data.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted ===
		ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER
	);
}

export function isPermittedUnderUNNumber(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return (
		data.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted ===
		ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER
	);
}

export function hasStatement(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return (
		data.techRecord_adrDetails_tank_tankDetails_tankStatement_select === ADRTankDetailsTankStatementSelect.STATEMENT
	);
}

export function hasProductList(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return (
		data.techRecord_adrDetails_tank_tankDetails_tankStatement_select === ADRTankDetailsTankStatementSelect.PRODUCT_LIST
	);
}

export function hasManufacturerBrakeDeclaration(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	return data.techRecord_adrDetails_brakeDeclarationsSeen === true;
}

export function hasBrakeEndurance(data: Partial<TechRecordType<'put'>>): boolean {
	if (!isAdrVehicle(data)) return false;
	if (!hasManufacturerBrakeDeclaration(data)) return false;
	return data.techRecord_adrDetails_brakeEndurance === true;
}
