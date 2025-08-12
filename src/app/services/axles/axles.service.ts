import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { AxleSpacing, VehicleTypes } from '@models/vehicle-tech-record.model';
import { CommonValidatorsService } from '../../forms/validators/common-validators.service';

@Injectable({
	providedIn: 'root',
})
export class AxlesService {
	fb = inject(FormBuilder);
	commonValidators = inject(CommonValidatorsService);

	generateAxlesForm(techRecord: TechRecordType<'hgv' | 'trl' | 'psv'>) {
		const axles = techRecord.techRecord_axles ?? [];

		switch (techRecord.techRecord_vehicleType) {
			case 'hgv':
				return this.fb.nonNullable.array(axles.map((axle) => this.generateHGVAxleForm(axle as HGVAxles)));
			case 'psv':
				return this.fb.nonNullable.array(axles.map((axle) => this.generatePSVAxleForm(axle as TRLAxles)));
			case 'trl':
				return this.fb.nonNullable.array(axles.map((axle) => this.generateTRLAxleForm(axle as TRLAxles)));
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

	generateHGVAxleForm(axle?: HGVAxles) {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(axle?.axleNumber || null),

			// Tyres fields
			tyres_tyreCode: this.fb.control<number | null>(axle?.tyres_tyreCode || null, [
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.commonValidators.maxLength(12, 'Tyre Size must be less than or equal to 12 characters'),
				this.commonValidators.minLength(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.commonValidators.maxLength(2, 'Ply Rating must be less than or equal to 2 characters'),
				this.commonValidators.minLength(0, 'Ply Rating must be greater than or equal to 0'),
			]),
			tyres_fitmentCode: this.fb.control<string | null>(axle?.tyres_fitmentCode || null),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: axle?.tyres_dataTrAxles || null, disabled: true }, [
				this.commonValidators.max(999, 'Data TR Axles must be less than or equal to 999'),
				this.commonValidators.min(0, 'Data TR Axles must be greater than or equal to 0'),
			]),

			// Weight fields
			weights_gbWeight: this.fb.control<number | null>(axle?.weights_gbWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} GB Weight must be less than or equal to 99999`,
						anchorLink: `weights_gbWeight-${index}`,
					};
				}),
			]),
			weights_eecWeight: this.fb.control<number | null>(axle?.weights_eecWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} EEC Weight must be less than or equal to 99999`,
						anchorLink: `weights_eecWeight-${index}`,
					};
				}),
			]),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} Design Weight must be less than or equal to 99999`,
						anchorLink: `weights_designWeight-${index}`,
					};
				}),
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
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.commonValidators.maxLength(12, 'Tyre Size must be less than or equal to 12 characters'),
				this.commonValidators.min(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.commonValidators.maxLength(2, 'Ply Rating must be less than or equal to 2 characters'),
				this.commonValidators.min(0, 'Ply Rating must be greater than or equal to 0'),
			]),
			tyres_speedCategorySymbol: this.fb.control<string | null>(axle?.tyres_speedCategorySymbol || null),
			tyres_fitmentCode: this.fb.control<string | null>(axle?.tyres_fitmentCode || null),
			tyres_dataTrAxles: this.fb.control<number | null>(axle?.tyres_dataTrAxles || null, [
				this.commonValidators.max(999, 'Load index must be less than or equal to 999'),
				this.commonValidators.min(0, 'Load index must be greater than or equal to 0'),
			]),

			// Weights fields
			weights_kerbWeight: this.fb.control<number | null>(axle?.weights_kerbWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} Kerb Weight must be less than or equal to 99999`,
						anchorLink: `weights_kerbWeight-${index}`,
					};
				}),
			]),
			weights_ladenWeight: this.fb.control<number | null>(axle?.weights_ladenWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} Laden Weight must be less than or equal to 99999`,
						anchorLink: `weights_ladenbWeight-${index}`,
					};
				}),
			]),
			weights_gbWeight: this.fb.control<number | null>(
				axle?.weights_gbWeight || null,
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} GB Weight must be less than or equal to 99999`,
						anchorLink: `weights_gbWeight-${index}`,
					};
				})
			),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} Design Weight must be less than or equal to 99999`,
						anchorLink: `weights_designWeight-${index}`,
					};
				}),
			]),
		});
	}

	generateTRLAxleForm(axle?: TRLAxles) {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(axle?.axleNumber || null),

			// Brakes fields
			brakes_brakeActuator: this.fb.control<number | null>(axle?.brakes_brakeActuator || null, [
				this.commonValidators.max(999, 'This field must be less than or equal to 999'),
			]),
			brakes_leverLength: this.fb.control<number | null>(axle?.brakes_leverLength || null, [
				this.commonValidators.max(999, 'This field must be less than or equal to 999'),
			]),
			brakes_springBrakeParking: this.fb.control<boolean | null>(
				typeof axle?.brakes_springBrakeParking === 'boolean' ? axle?.brakes_springBrakeParking : null,
				[]
			),
			parkingBrakeMrk: this.fb.control<boolean | null>(axle?.parkingBrakeMrk || false, []),

			// Tyres fields
			tyres_tyreCode: this.fb.control<number | null>(axle?.tyres_tyreCode || null, [
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: axle?.tyres_tyreSize || null, disabled: true }, [
				this.commonValidators.max(12, 'Tyre Size must be less than or equal to 12'),
				this.commonValidators.min(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: axle?.tyres_plyRating || null, disabled: true }, [
				this.commonValidators.max(2, 'Ply rating must be less than or equal to 2'),
				this.commonValidators.min(0, 'Ply rating must be greater than or equal to 0'),
			]),
			tyres_fitmentCode: this.fb.control<string | null>(axle?.tyres_fitmentCode || null),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: axle?.tyres_dataTrAxles || null, disabled: true }, [
				this.commonValidators.max(999, 'Load index must be less than or equal to 999'),
				this.commonValidators.min(0, 'Load index must be greater than or equal to 0'),
			]),

			// Weights fields
			weights_gbWeight: this.fb.control<number | null>(axle?.weights_gbWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} GB Weight must be less than or equal to 99999`,
						anchorLink: `weights_gbWeight-${index}`,
					};
				}),
			]),
			weights_eecWeight: this.fb.control<number | null>(axle?.weights_eecWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} EEC Weight must be less than or equal to 99999`,
						anchorLink: `weights_eecWeight-${index}`,
					};
				}),
			]),
			weights_designWeight: this.fb.control<number | null>(axle?.weights_designWeight || null, [
				this.commonValidators.max(99999, (control: AbstractControl) => {
					const index = control.parent?.get('axleNumber')?.value || 0;
					return {
						error: `Axle ${index} Design Weight must be less than or equal to 99999`,
						anchorLink: `weights_designWeight-${index}`,
					};
				}),
			]),
		});
	}

	generateAxleSpacingsForm(techRecord: TechRecordType<'hgv' | 'trl'>) {
		const axleSpacings = techRecord.techRecord_dimensions_axleSpacing ?? [];
		return this.fb.array(axleSpacings.map((spacing) => this.generateAxleSpacingForm(spacing)));
	}

	generateAxleSpacingForm(spacing?: AxleSpacing) {
		return this.fb.group({
			axles: this.fb.control<string>(spacing?.axles || ''),
			value: this.fb.control<number | null>(spacing?.value || null, [
				this.commonValidators.max(99999, 'Axle spacing must be less than 99999 mm'),
			]),
		});
	}

	addAxle(parent: FormGroup, type: 'hgv' | 'psv' | 'trl') {
		const axlesForm = parent.get('techRecord_axles') as FormArray;

		if (axlesForm.controls.length < 10) {
			const axleNumber = axlesForm.controls.length + 1;
			axlesForm.setErrors(null);
			axlesForm.push(this.generateAxleForm(type, { axleNumber }));

			if ((type === VehicleTypes.TRL || type === VehicleTypes.HGV) && axlesForm.controls.length > 1) {
				const axleSpacingsForm = parent.get('techRecord_dimensions_axleSpacing') as FormArray;
				axleSpacingsForm.push(
					this.generateAxleSpacingForm({
						axles: `${axleNumber - 1}-${axleNumber}`,
						value: null,
					})
				);
			}

			return;
		}

		axlesForm.setErrors({ length: 'Cannot have more than 10 axles' });
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

			if (type === VehicleTypes.TRL || type === VehicleTypes.HGV) {
				const axleSpacingsForm = parent.get('techRecord_dimensions_axleSpacing') as FormArray;
				axleSpacingsForm.removeAt(index - 1 >= 0 ? index - 1 : 0);

				// Relabel axle spacings
				for (let i = 0; i < axleSpacingsForm.controls.length; i++) {
					axleSpacingsForm.at(i).patchValue({ axles: `${i + 1}-${i + 2}` });
				}
			}

			return;
		}

		axlesForm.setErrors({ length: `Cannot have less than ${minLength} axles` });
	}
}
