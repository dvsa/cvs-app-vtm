import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormatVehicleTypePipe } from '../format-vehicle-type.pipe';

describe('FormatVehicleTypePipe', () => {
	it('create an instance', () => {
		const pipe = new FormatVehicleTypePipe();
		expect(pipe).toBeTruthy();
	});

	describe('transform the values', () => {
		const pipe = new FormatVehicleTypePipe();

		it('should return trailer if value is trl', () => {
			expect(pipe.transform(VehicleTypes.TRL)).toBe('trailer');
		});

		it('should return HGV if value is hgv', () => {
			expect(pipe.transform(VehicleTypes.HGV)).toBe('HGV');
		});

		it('should return undefined if value is undefined', () => {
			expect(pipe.transform(undefined)).toBeUndefined();
		});
	});
});
