import { Injectable, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { AxleSpacing, Axles, VehicleTypes } from '@models/vehicle-tech-record.model';
import { AxleTyreProperties } from '@models/vehicle/axleTyreProperties';
import { FeatureToggleService } from '../feature-toggle-service/feature-toggle-service';
import FitmentCodeEnum = AxleTyreProperties.FitmentCodeEnum;

@Injectable({
	providedIn: 'root',
})
export class AxlesService {
	fb = inject(FormBuilder);
	featureToggleService = inject(FeatureToggleService);
	commonValidators = inject(CommonValidatorsService);

	private lockAxlesSignal = signal(false);
	lockAxles$ = this.lockAxlesSignal.asReadonly();
	showDimensionsWarning = false;
	axleDistancesWithValues = false;
	allInvalidAxles: Array<number> = [];

	setLockAxles(lock: boolean) {
		this.lockAxlesSignal.set(lock);
	}

	sortAxles(axles: Axles) {
		return axles.sort((a, b) => (a.axleNumber || 0) - (b.axleNumber || 0));
	}

	generateAxlesForm(techRecord: TechRecordType<'hgv' | 'trl' | 'psv'>) {
		const axles = techRecord.techRecord_axles ?? [];

		switch (techRecord.techRecord_vehicleType) {
			case 'hgv':
				return this.fb.nonNullable.array(
					axles
						.map((axle) => this.generateHGVAxleForm(axle as HGVAxles))
						.sort((a, b) => (a.value.axleNumber || 0) - (b.value.axleNumber || 0))
				);
			case 'psv':
				return this.fb.nonNullable.array(
					axles
						.map((axle) => this.generatePSVAxleForm(axle as TRLAxles))
						.sort((a, b) => (a.value.axleNumber || 0) - (b.value.axleNumber || 0))
				);
			case 'trl':
				return this.fb.nonNullable.array(
					axles
						.map((axle) => this.generateTRLAxleForm(axle as TRLAxles))
						.sort((a, b) => (a.value.axleNumber || 0) - (b.value.axleNumber || 0))
				);
		}
	}

	generateAxleForm(type: 'hgv' | 'psv' | 'trl', axle: HGVAxles | PSVAxles | TRLAxles) {
		switch (type) {
			case 'hgv':
				return this.generateHGVAxleForm(axle as HGVAxles);
			case 'psv':
				return this.generatePSVAxleForm(axle as PSVAxles);
			case 'trl':
				return this.generateTRLAxleForm(axle as TRLAxles);
		}
	}

	refDataValidator(): ValidatorFn {
		return this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
			? this.commonValidators.doesTyresRefDataExist(ReferenceDataResourceType.Tyres, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} tyre code not in database`,
						anchorLink: `tyres_tyreCode-${index}`,
						accordion: 'tyres',
					};
				})
			: (control) => null;
	}

	generateHGVAxleForm(axle?: HGVAxles) {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(axle?.axleNumber || null),

			// Tyres fields
			tyres_tyreCode: this.fb.control<number | null>(axle?.tyres_tyreCode || null, [
				this.commonValidators.max(99999, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be less than or equal to 99999`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres',
						};
					}
					return {
						error: `Axle ${index} tyre code must be less than or equal to 99999`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.commonValidators.min(0, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be greater than or equal to 0`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres',
						};
					}
					return {
						error: `Axle ${index} tyre code must be greater than or equal to 0`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.refDataValidator(),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.maxLength(12, 'Tyre Size', 'tyres', 'tyres_tyreSize')
					: this.commonValidators.maxLength(12, 'Tyre Size'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.minLength(0, 'Tyre Size', 'tyres', 'tyres_tyreSize')
					: this.commonValidators.minLength(0, 'Tyre Size'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.maxLength(2, 'Ply Rating', 'tyres', 'tyres_plyRating')
					: this.commonValidators.maxLength(2, 'Ply Rating'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.minLength(0, 'Ply Rating', 'tyres', 'tyres_plyRating')
					: this.commonValidators.minLength(0, 'Ply Rating'),
			]),
			// TODO remove feature flag when released to production and flag disabled
			tyres_fitmentCode: this.fb.control<string | null>(
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? FitmentCodeEnum.Single
					: axle?.tyres_fitmentCode || null
			),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: axle?.tyres_dataTrAxles || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.max(999, 'Data TR Axles', '', 'tyres', 'tyres_dataTrAxles')
					: this.commonValidators.max(999, 'Data TR Axles'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Data TR Axles', 'tyres', 'tyres_dataTrAxles')
					: this.commonValidators.min(0, 'Data TR Axles'),
			]),

			// Weight fields
			weights_gbWeight: this.fb.control<number | null>(axle?.weights_gbWeight || null, [
				this.maxWeightHGV('GB Weight', 'weights_gbWeight'),
			]),
			weights_eecWeight: this.fb.control<number | null>(axle?.weights_eecWeight || null, [
				this.maxWeightHGV('EEC Weight', 'weights_eecWeight'),
			]),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.maxWeightHGV('Design Weight', 'weights_designWeight'),
			]),
		});
	}

	generatePSVAxleForm(axle?: PSVAxles) {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(axle?.axleNumber || null),

			// Brakes fields
			parkingBrakeMrk: this.fb.control<boolean | null>(axle?.parkingBrakeMrk || false, []),

			// Tyres fields
			tyres_tyreCode: this.fb.control<number | null>(axle?.tyres_tyreCode || null, [
				this.commonValidators.max(99999, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be less than or equal to 99999`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres',
						};
					}
					return {
						error: `Axle ${index} tyre code must be less than or equal to 99999`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.commonValidators.min(0, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be greater than or equal to 0`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres_dataTrAxles',
						};
					}
					return {
						error: `Axle ${index} tyre code must be greater than or equal to 0`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.refDataValidator(),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.maxLength(12, 'Tyre Size', 'tyres', 'tyres_tyreSize')
					: this.commonValidators.maxLength(12, 'Tyre Size'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Tyre Size', 'tyres_tyreSize', 'tyres')
					: this.commonValidators.min(0, 'Tyre Size'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.maxLength(2, 'Ply Rating', 'tyres', 'tyres_plyRating')
					: this.commonValidators.maxLength(2, 'Ply Rating'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Ply Rating', 'tyres_plyRating', 'tyres')
					: this.commonValidators.min(0, 'Ply Rating'),
			]),
			tyres_speedCategorySymbol: this.fb.control<string | null>(axle?.tyres_speedCategorySymbol || null),
			// TODO remove feature flag when released to production and flag disabled
			tyres_fitmentCode: this.fb.control<string | null>(
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? FitmentCodeEnum.Single
					: axle?.tyres_fitmentCode || null
			),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: axle?.tyres_dataTrAxles || null, disabled: true }),

			// Weights fields
			weights_kerbWeight: this.fb.control<number | null>(axle?.weights_kerbWeight || null, [
				this.maxWeightPSV('Kerb Weight', 'weights_kerbWeight'),
			]),
			weights_ladenWeight: this.fb.control<number | null>(axle?.weights_ladenWeight || null, [
				this.maxWeightPSV('Laden Weight', 'weights_ladenWeight'),
			]),
			weights_gbWeight: this.fb.control<number | null>(axle?.weights_gbWeight || null, [
				this.maxWeightPSV('GB Weight', 'weights_gbWeight'),
			]),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.maxWeightPSV('Design Weight', 'weights_designWeight'),
			]),
		});
	}

	generateTRLAxleForm(axle?: TRLAxles) {
		const featureEnabled = this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails');

		return this.fb.group({
			axleNumber: this.fb.control<number | null>(axle?.axleNumber || null),

			// Brakes fields
			brakes_brakeActuator: this.fb.control<number | null>(axle?.brakes_brakeActuator || null, [
				this.commonValidators.max(999, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: featureEnabled
								? 'Brake actuator and Lever length must be less than or equal to 999mm'
								: 'This field must be less than or equal to 999',
							anchorLink: `brakes_brakeActuator-${index}`,
							accordion: 'brakes',
						};
					}
					return {
						error: featureEnabled
							? 'Brake actuator and Lever length must be less than or equal to 999mm'
							: 'This field must be less than or equal to 999',
						anchorLink: `brakes_brakeActuator-${index}`,
					};
				}),
			]),
			brakes_leverLength: this.fb.control<number | null>(axle?.brakes_leverLength || null, [
				this.commonValidators.max(999, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: featureEnabled
								? 'Brake actuator and Lever length must be less than or equal to 999mm'
								: 'This field must be less than or equal to 999',
							anchorLink: `brakes_leverLength-${index}`,
							accordion: 'brakes',
						};
					}
					return {
						error: featureEnabled
							? 'Brake actuator and Lever length must be less than or equal to 999mm'
							: 'This field must be less than or equal to 999',
						anchorLink: `brakes_leverLength-${index}`,
					};
				}),
			]),
			brakes_springBrakeParking: this.fb.control<boolean | null>(
				typeof axle?.brakes_springBrakeParking === 'boolean' ? axle?.brakes_springBrakeParking : null,
				[]
			),
			parkingBrakeMrk: this.fb.control<boolean | null>(axle?.parkingBrakeMrk || false, []),

			// Tyres fields
			tyres_tyreCode: this.fb.control<number | null>(axle?.tyres_tyreCode || null, [
				this.commonValidators.max(99999, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be less than or equal to 99999`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres',
						};
					}
					return {
						error: `Axle ${index} tyre code must be less than or equal to 99999`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.commonValidators.min(0, (control) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${index} tyre code must be greater than or equal to 0`,
							anchorLink: `tyres_tyreCode-${index}`,
							accordion: 'tyres',
						};
					}
					return {
						error: `Axle ${index} tyre code must be greater than or equal to 0`,
						anchorLink: `tyres_tyreCode-${index}`,
					};
				}),
				this.refDataValidator(),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.max(12, 'Tyre Size', 'tyres', 'tyres_tyreSize')
					: this.commonValidators.max(12, 'Tyre Size'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Tyre Size')
					: this.commonValidators.min(0, 'Tyre Size', 'tyres', 'tyres_tyreSize'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.max(2, 'Ply rating', 'tyres', 'tyres_plyRating')
					: this.commonValidators.max(2, 'Ply rating'),

				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Ply rating')
					: this.commonValidators.min(0, 'Ply rating', 'tyres', 'tyres_plyRating'),
			]),
			// TODO remove feature flag when released to production and flag disabled
			tyres_fitmentCode: this.fb.control<string | null>(
				featureEnabled ? FitmentCodeEnum.Single : axle?.tyres_fitmentCode || null
			),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: axle?.tyres_dataTrAxles || null, disabled: true }, [
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.max(999, 'Load index', 'tyres', 'tyres_dataTrAxles')
					: this.commonValidators.max(999, 'Load index'),
				this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')
					? this.commonValidators.min(0, 'Load index')
					: this.commonValidators.min(0, 'Load index', 'tyres', 'tyres_dataTrAxles'),
			]),

			// Weights fields
			weights_gbWeight: this.fb.control<number | null>(axle?.weights_gbWeight || null, [
				this.maxWeightHGV('GB Weight', 'weights_gbWeight'),
			]),
			weights_eecWeight: this.fb.control<number | null>(axle?.weights_eecWeight || null, [
				this.maxWeightHGV('EEC Weight', 'weights_eecWeight'),
			]),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.maxWeightHGV('Design Weight', 'weights_designWeight'),
			]),
		});
	}

	maxWeightHGV(label: string, id: string): ValidatorFn {
		return this.commonValidators.max(99999, (control) => {
			const index = control.parent?.get('axleNumber')?.value || 0;
			if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
				return {
					error: `Axle ${index} GB, EEC, Design Weight must be less than or equal to 99999kg`,
					anchorLink: `${id}-${index}`,
					accordion: 'weights',
				};
			}
			return {
				error: `Axle ${index} ${label} must be less than or equal to 99999`,
				anchorLink: `${id}-${index}`,
			};
		});
	}

	maxWeightPSV(label: string, id: string): ValidatorFn {
		return this.commonValidators.max(99999, (control) => {
			const index = control.parent?.get('axleNumber')?.value || 0;
			if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
				return {
					error: `Axle ${index} Kerb, Laden, GB Max, EEC, Design Weight must be less than or equal to 99999kg`,
					anchorLink: `${id}-${index}`,
					accordion: 'weights',
				};
			}
			return {
				error: `Axle ${index} ${label} must be less than or equal to 99999`,
				anchorLink: `${id}-${index}`,
			};
		});
	}

	generateAxleSpacingsForm(techRecord: TechRecordType<'hgv' | 'trl'>) {
		const axleSpacings = techRecord.techRecord_dimensions_axleSpacing ?? [];
		return this.fb.array(axleSpacings.map((spacing, index) => this.generateAxleSpacingForm(spacing, index)));
	}

	generateAxleSpacingForm(spacing: AxleSpacing, axlesNumber: number) {
		return this.fb.group({
			axles: this.fb.control<string>(spacing?.axles || ''),
			value: this.fb.control<number | null>(spacing?.value || null, [
				this.commonValidators.max(99999, () => {
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						return {
							error: `Axle ${axlesNumber - 1} to ${axlesNumber} spacing must be less than or equal to 99999mm`,
							anchorLink: `techRecord_dimensions_axleSpacing_${axlesNumber - 2}_value`,
							accordion: 'dimensions',
						};
					}
					return {
						error: `Axle ${axlesNumber - 1} to ${axlesNumber} spacing must be less than or equal to 99999mm`,
						anchorLink: `techRecord_dimensions_axleSpacing_${axlesNumber - 2}_value`,
					};
				}),
			]),
		});
	}

	addAxle(parent: FormGroup, type: 'hgv' | 'psv' | 'trl') {
		const axlesForm = parent.get('techRecord_axles');
		if (!(axlesForm instanceof FormArray)) return;

		if (axlesForm.controls.length < 10) {
			this.setLockAxles(true);
			const axleNumber = axlesForm.controls.length + 1;
			axlesForm.setErrors(null);
			axlesForm.push(this.generateAxleForm(type, { axleNumber }));

			if ((type === VehicleTypes.TRL || type === VehicleTypes.HGV) && axlesForm.controls.length > 1) {
				const axleSpacingsForm = parent.get('techRecord_dimensions_axleSpacing') as FormArray;
				axleSpacingsForm.push(
					this.generateAxleSpacingForm(
						{
							axles: `${axleNumber - 1}-${axleNumber}`,
							value: null,
						},
						axleNumber
					)
				);
			}

			return;
		}

		axlesForm.setErrors({ length: 'Cannot have more than 10 axles' });
	}

	removeAllAxles(parent: FormGroup, type: 'hgv' | 'psv' | 'trl') {
		const axlesForm = parent.get('techRecord_axles') as FormArray;
		const axleSpacingsForm = parent.get('techRecord_dimensions_axleSpacing') as FormArray;
		axlesForm.clear();

		if (type === VehicleTypes.TRL || type === VehicleTypes.HGV) {
			axleSpacingsForm.clear();
		}
	}

	removeAxle(parent: FormGroup, type: 'hgv' | 'psv' | 'trl', index: number) {
		const axlesForm = parent.get('techRecord_axles') as FormArray;
		const minLength = type === VehicleTypes.TRL ? 1 : 2;
		const axles = axlesForm.value;
		if (Array.isArray(axles) && axles.length > minLength) {
			axlesForm.setErrors(null);
			axlesForm.removeAt(index);

			// Relabel axle numbers
			for (let i = 0; i < axlesForm.controls.length; i++) {
				axlesForm.at(i).patchValue({ axleNumber: i + 1 });
			}

			if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
				parent.get('techRecord_frontAxleToRearAxle')?.patchValue(null);
			}
			if (type === VehicleTypes.TRL || type === VehicleTypes.HGV) {
				const axleSpacingsForm = parent.get('techRecord_dimensions_axleSpacing') as FormArray;
				axleSpacingsForm.removeAt(index - 1 >= 0 ? index - 1 : 0);

				// Relabel axle spacings
				for (let i = 0; i < axleSpacingsForm.controls.length; i++) {
					if (this.featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
						if (type === VehicleTypes.TRL) {
							parent.patchValue({
								techRecord_rearAxleToRearTrl: null,
								techRecord_centreOfRearmostAxleToRearOfTrl: null,
								techRecord_couplingCenterToRearTrlMin: null,
								techRecord_couplingCenterToRearTrlMax: null,
								techRecord_couplingCenterToRearAxleMin: null,
								techRecord_couplingCenterToRearAxleMax: null,
							});
						}
						if (type === VehicleTypes.HGV) {
							parent.patchValue({
								techRecord_frontVehicleTo5thWheelCouplingMin: null,
								techRecord_frontVehicleTo5thWheelCouplingMax: null,
								techRecord_frontAxleTo5thWheelMin: null,
								techRecord_frontAxleTo5thWheelMax: null,
							});
						}
						axleSpacingsForm.at(i).patchValue({ axles: `${i + 1}-${i + 2}`, value: null });
					} else {
						axleSpacingsForm.at(i).patchValue({ axles: `${i + 1}-${i + 2}` });
					}
				}
			}
			this.showDimensionsWarning = true;
			this.axleDistancesWithValues = false;
			return;
		}

		axlesForm.setErrors({ length: `Cannot have less than ${minLength} axles` });
	}
}
