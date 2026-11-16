import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecordValidatorsService } from '../tech-record-validators.service';

describe('TechRecordValidatorsService', () => {
	let service: TechRecordValidatorsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TechRecordValidatorsService],
		});
		service = TestBed.inject(TechRecordValidatorsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('validateVRMTrailerIdLength', () => {
		it('should return null when the control has no value', () => {
			const control = new FormControl('');
			const validator = service.validateVRMTrailerIdLength('vehicleType');
			expect(validator(control)).toBeNull();
		});

		it('should return null when the control has no parent', () => {
			const control = new FormControl('ABC123');
			const validator = service.validateVRMTrailerIdLength('vehicleType');
			expect(validator(control)).toBeNull();
		});

		describe('when the sibling vehicle type is TRL (trailer)', () => {
			function buildForm(value: string) {
				const form = new FormGroup({
					vehicleType: new FormControl(VehicleTypes.TRL),
					vrmOrTrailerId: new FormControl(value),
				});
				return form.get('vrmOrTrailerId') as FormControl;
			}

			it('should error when the value is shorter than 7 characters', () => {
				const control = buildForm('ABC12');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Trailer ID must be greater than or equal to 7 characters',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});

			it('should error when the value is longer than 8 characters', () => {
				const control = buildForm('ABC123456');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Trailer ID must be less than or equal to 8 characters',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});

			it('should return null when the value is exactly 7 characters', () => {
				const control = buildForm('ABC1234');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toBeNull();
			});

			it('should return null when the value is exactly 8 characters', () => {
				const control = buildForm('ABC12345');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toBeNull();
			});
		});

		describe('when the sibling vehicle type is not TRL', () => {
			function buildForm(value: string, vehicleType: string | null = VehicleTypes.HGV) {
				const form = new FormGroup({
					vehicleType: new FormControl(vehicleType),
					vrmOrTrailerId: new FormControl(value),
				});
				return form.get('vrmOrTrailerId') as FormControl;
			}

			it('should error when the value is longer than 9 characters', () => {
				const control = buildForm('ABCDEFGHIJ');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Vehicle Registration Mark (VRM) or Trailer ID must be less than or equal to 9 characters',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});

			it('should error when the value has a length under 1 (truthy but empty-like value)', () => {
				// A plain '' value is caught by the earlier falsy-value guard, so to exercise the
				// "less than 1 character" branch we use a truthy value whose length is still 0.
				const control = buildForm([] as unknown as string);
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Vehicle Registration Mark (VRM) or Trailer ID must be greater than or equal to 1 character',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});

			it('should return null when the value is exactly 1 character', () => {
				const control = buildForm('A');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toBeNull();
			});

			it('should return null when the value is exactly 9 characters', () => {
				const control = buildForm('ABCDEFGHI');
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toBeNull();
			});

			it('should treat a missing sibling value as not being a trailer', () => {
				const control = buildForm('ABCDEFGHIJ', null);
				const validator = service.validateVRMTrailerIdLength('vehicleType');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Vehicle Registration Mark (VRM) or Trailer ID must be less than or equal to 9 characters',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});

			it('should treat a missing sibling control as not being a trailer', () => {
				const form = new FormGroup({
					vrmOrTrailerId: new FormControl('ABCDEFGHIJ'),
				});
				const control = form.get('vrmOrTrailerId') as FormControl;
				const validator = service.validateVRMTrailerIdLength('nonExistentSibling');
				expect(validator(control)).toEqual({
					validateVRMTrailerIdLength: {
						error: 'Vehicle Registration Mark (VRM) or Trailer ID must be less than or equal to 9 characters',
						anchorLink: 'input-vrm-or-trailer-id',
					},
				});
			});
		});
	});
});
