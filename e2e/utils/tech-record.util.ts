import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';

export function isSmallTrailer(
	data: Partial<TechRecordType<'put'>>
): data is Partial<TechRecordVehicleType<'trl', 'put'>> {
	return (
		data.techRecord_vehicleType === 'trl' &&
		(data.techRecord_euVehicleCategory === 'o1' || data.techRecord_euVehicleCategory === 'o2')
	);
}

export function isHeavyTrailer(
	data: Partial<TechRecordType<'put'>>
): data is Partial<TechRecordVehicleType<'trl', 'put'>> {
	return (
		data.techRecord_vehicleType === 'trl' &&
		(data.techRecord_euVehicleCategory === 'o3' || data.techRecord_euVehicleCategory === 'o4')
	);
}

export function isHeavyVehicle(
	data: Partial<TechRecordType<'put'>>
): data is Partial<TechRecordVehicleType<'hgv' | 'trl' | 'psv', 'put'>> {
	return data.techRecord_vehicleType === 'hgv' || data.techRecord_vehicleType === 'psv' || isHeavyTrailer(data);
}

export function isLightVehicle(
	data: Partial<TechRecordType<'put'>>
): data is Partial<TechRecordVehicleType<'lgv' | 'car' | 'motorcycle' | 'trl', 'put'>> {
	return (
		data.techRecord_vehicleType === 'lgv' ||
		data.techRecord_vehicleType === 'car' ||
		data.techRecord_vehicleType === 'motorcycle' ||
		isSmallTrailer(data)
	);
}
