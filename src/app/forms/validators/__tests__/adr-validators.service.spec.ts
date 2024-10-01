import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { AdrValidatorsService } from '../adr-validators.service';

describe('AdrValidatorsService', () => {
	let form: FormGroup;
	let service: AdrValidatorsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AdrValidatorsService],
		});

		service = TestBed.inject(AdrValidatorsService);

		form = new FormGroup({
			techRecord_adrDetails_dangerousGoods: new FormControl(false),
			techRecord_adrDetails_applicantDetails_name: new FormControl(null),
			techRecord_adrDetails_vehicleDetails_type: new FormControl(null),
			techRecord_adrDetails_permittedDangerousGoods: new FormControl(null),
			techRecord_adrDetails_compatibilityGroupJ: new FormControl(false),
			techRecord_adrDetails_tank_tankDetails_tankManufacturer: new FormControl(null),
			techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: new FormControl(null),
			techRecord_adrDetails_tank_tankDetails_tankStatement_select: new FormControl(null),
			techRecord_adrDetails_listStatementApplicable: new FormControl(null),
			techRecord_adrDetails_brakeEndurance: new FormControl(null),
			techRecord_adrDetails_weight: new FormControl(null),
			techRecord_adrDetails_batteryListNumber: new FormControl(null),
		});
	});

	describe('requiredWithDangerousGoods', () => {
		it('should return null when able to carry dangerous goods is false', () => {
			const validator = service.requiredWithDangerousGoods('message');
			const control = form.get('techRecord_adrDetails_applicantDetails_name') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_applicantDetails_name: 'name',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when able to carry dangerous goods is true and control has a value', () => {
			const validator = service.requiredWithDangerousGoods('message');
			const control = form.get('techRecord_adrDetails_applicantDetails_name') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_applicantDetails_name: 'name',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when able to carry dangerous goods is true and control has no value', () => {
			const validator = service.requiredWithDangerousGoods('message');
			const control = form.get('techRecord_adrDetails_applicantDetails_name') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_applicantDetails_name: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithExplosives', () => {
		it('should return null when compatibility group J is false', () => {
			const validator = service.requiredWithExplosives('message');
			const control = form.get('techRecord_adrDetails_compatibilityGroupJ') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.EXPLOSIVES_TYPE_2],
				techRecord_adrDetails_compatibilityGroupJ: null,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when compatibility group J is true and control has a value', () => {
			const validator = service.requiredWithExplosives('message');
			const control = form.get('techRecord_adrDetails_compatibilityGroupJ') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.EXPLOSIVES_TYPE_2],
				techRecord_adrDetails_compatibilityGroupJ: true,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when permitted dangerous goods includes explosives, but compatibility group J has no value', () => {
			const validator = service.requiredWithExplosives('message');
			const control = form.get('techRecord_adrDetails_compatibilityGroupJ') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.EXPLOSIVES_TYPE_2],
				techRecord_adrDetails_compatibilityGroupJ: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithBattery', () => {
		it('should return null when the battery section is not visible', () => {
			const validator = service.requiredWithBattery('message');
			const control = form.get('techRecord_adrDetails_listStatementApplicable') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_listStatementApplicable: null,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when the battery section is visible and the control has a value', () => {
			const validator = service.requiredWithBattery('message');
			const control = form.get('techRecord_adrDetails_listStatementApplicable') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_BATTERY,
				techRecord_adrDetails_listStatementApplicable: true,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when the battery section is visible and the control has no value', () => {
			const validator = service.requiredWithBattery('message');
			const control = form.get('techRecord_adrDetails_listStatementApplicable') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_BATTERY,
				techRecord_adrDetails_listStatementApplicable: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithTankOrBattery', () => {
		it('should return null when the tank or battery section is not visible', () => {
			const validator = service.requiredWithTankOrBattery('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankManufacturer') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when the tank or battery section is visible and the control has a value', () => {
			const validator = service.requiredWithTankOrBattery('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankManufacturer') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_TANK,
				techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'manufacturer',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when the tank or battery section is visible and the control has no value', () => {
			const validator = service.requiredWithTankOrBattery('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankManufacturer') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_TANK,
				techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithTankStatement', () => {
		it('should return null when the tank statement section is not visible', () => {
			const validator = service.requiredWithTankStatement('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_select') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when the tank statement section is visible and the control has a value', () => {
			const validator = service.requiredWithTankStatement('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_select') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_TANK,
				techRecord_adrDetails_tank_tankDetails_tankStatement_select: ADRTankDetailsTankStatementSelect.PRODUCT_LIST,
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when the tank statement section is visible and the control has no value', () => {
			const validator = service.requiredWithTankStatement('message');
			const control = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_select') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_TANK,
				techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted:
					ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER,
				techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithBrakeEndurance', () => {
		it('should return null when the weight section is not visible', () => {
			const validator = service.requiredWithBrakeEndurance('message');
			const control = form.get('techRecord_adrDetails_listStatementApplicable') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_brakeEndurance: true,
				techRecord_adrDetails_weight: '1000',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when the weight section is visible and the control has a value', () => {
			const validator = service.requiredWithBrakeEndurance('message');
			const control = form.get('techRecord_adrDetails_weight') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_brakeEndurance: true,
				techRecord_adrDetails_weight: '1000',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when the weight section is visible and the control has no value', () => {
			const validator = service.requiredWithBrakeEndurance('message');
			const control = form.get('techRecord_adrDetails_weight') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_brakeEndurance: true,
				techRecord_adrDetails_weight: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});

	describe('requiredWithBatteryListApplicable', () => {
		it('should return null when the battery list section is not visible', () => {
			const validator = service.requiredWithBatteryListApplicable('message');
			const control = form.get('techRecord_adrDetails_batteryListNumber') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: false,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_BATTERY,
				techRecord_adrDetails_listStatementApplicable: true,
				techRecord_adrDetails_batteryListNumber: '123',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return null when the battery list section is visible and the control has a value', () => {
			const validator = service.requiredWithBatteryListApplicable('message');
			const control = form.get('techRecord_adrDetails_batteryListNumber') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_BATTERY,
				techRecord_adrDetails_listStatementApplicable: true,
				techRecord_adrDetails_batteryListNumber: '123',
			});
			expect(validator(control)).toBeNull();
		});

		it('should return an error when the battery list section is visible and the control has no value', () => {
			const validator = service.requiredWithBatteryListApplicable('message');
			const control = form.get('techRecord_adrDetails_batteryListNumber') as FormControl;
			form.patchValue({
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_vehicleDetails_type: ADRBodyType.CENTRE_AXLE_BATTERY,
				techRecord_adrDetails_listStatementApplicable: true,
				techRecord_adrDetails_batteryListNumber: null,
			});
			expect(validator(control)).toEqual({ required: 'message' });
		});
	});
});
