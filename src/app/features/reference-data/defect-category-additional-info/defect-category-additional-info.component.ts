import { Component, input } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { DefectLocationMetadataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { GovukCheckboxGroupComponent } from '@forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';

type Vehicle = 'psv' | 'hgv' | 'trl';
type VehicleInfo = { notes: boolean; location: DefectLocationMetadataSchema | null };
type ExistingVehicleInfo = { notes?: boolean; location?: DefectLocationMetadataSchema | null };
export type CategoryAdditionalInfo = Partial<Record<Vehicle, VehicleInfo>> | null;

const vehicles: { value: Vehicle; label: string }[] = [
	{ value: 'psv', label: 'PSV' },
	{ value: 'hgv', label: 'HGV' },
	{ value: 'trl', label: 'TRL' },
];

function maximumValidator(label: string, maximum: number, anchorLink: string): ValidatorFn {
	return (control) => {
		const value: unknown = control.value;
		if (value === null || value === undefined || value === '') return null;
		if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= maximum) return null;
		return {
			range: {
				error: `${label} must be a whole number between 1 and ${maximum}`,
				anchorLink,
				accordion: `additional-info-${anchorLink.split('-')[0]}`,
			},
		};
	};
}

function createVehicleForm(fb: FormBuilder, vehicle: Vehicle) {
	const maxControl = (field: string, label: string, max: number) =>
		fb.control<number | null>(null, maximumValidator(`${vehicle.toUpperCase()} ${label}`, max, `${vehicle}-${field}`));
	return fb.group({
		notes: fb.nonNullable.control(false),
		vertical: fb.control<string[] | null>(null),
		horizontal: fb.control<string[] | null>(null),
		lateral: fb.control<string[] | null>(null),
		longitudinal: fb.control<string[] | null>(null),
		rowNumber: maxControl('rowNumber', 'maximum row number', 20),
		seatNumber: maxControl('seatNumber', 'maximum seat number', 6),
		axleNumber: maxControl('axleNumber', 'maximum axle number', 10),
	});
}

export function createAdditionalInfoForm(fb: FormBuilder, vehicleTypes: FormControl<string[]>) {
	const form = fb.group({
		psv: createVehicleForm(fb, 'psv'),
		hgv: createVehicleForm(fb, 'hgv'),
		trl: createVehicleForm(fb, 'trl'),
	});
	const syncVehicles = (selected: string[]) => {
		for (const { value } of vehicles) {
			const group = form.controls[value];
			if (selected.includes(value) && group.disabled) group.enable({ emitEvent: false });
			if (!selected.includes(value) && group.enabled) group.disable({ emitEvent: false });
		}
	};
	syncVehicles(vehicleTypes.value);
	vehicleTypes.valueChanges.subscribe(syncVehicles);
	return form;
}

export type AdditionalInfoForm = ReturnType<typeof createAdditionalInfoForm>;

export function populateAdditionalInfo(
	form: AdditionalInfoForm,
	value: Partial<Record<Vehicle, ExistingVehicleInfo | null>> | null | undefined
) {
	for (const { value: vehicle } of vehicles) {
		const info = value?.[vehicle];
		const location = info?.location;
		const max = (numbers: number[] | null | undefined) => (numbers?.length ? Math.max(...numbers) : null);
		form.controls[vehicle].setValue({
			notes: info?.notes ?? false,
			vertical: location?.vertical ?? null,
			horizontal: location?.horizontal ?? null,
			lateral: location?.lateral ?? null,
			longitudinal: location?.longitudinal ?? null,
			rowNumber: max(location?.rowNumber),
			seatNumber: max(location?.seatNumber),
			axleNumber: max(location?.axleNumber),
		});
	}
}

export function serialiseAdditionalInfo(form: AdditionalInfoForm, vehicleTypes: string[]): CategoryAdditionalInfo {
	if (form.invalid) throw new Error('Cannot serialise invalid additional information');
	const values = form.getRawValue();
	const selectedVehicles = vehicles.filter(({ value }) => vehicleTypes.includes(value));
	if (!selectedVehicles.length) return null;
	const result: NonNullable<CategoryAdditionalInfo> = {};
	const selected = (value: string[] | null) => (value?.length ? value : null);
	const range = (maximum: number | null) =>
		maximum === null ? null : Array.from({ length: maximum }, (_, index) => index + 1);
	for (const { value: vehicle } of selectedVehicles) {
		const info = values[vehicle];
		const location = {
			vertical: selected(info.vertical),
			horizontal: selected(info.horizontal),
			lateral: selected(info.lateral),
			longitudinal: selected(info.longitudinal),
			rowNumber: range(info.rowNumber),
			seatNumber: range(info.seatNumber),
			axleNumber: range(info.axleNumber),
		};
		result[vehicle] = {
			notes: info.notes,
			location: Object.values(location).some((value) => value !== null) ? location : null,
		};
	}
	return result;
}

export function includeVehiclesWithAdditionalInfo(
	selected: string[],
	info: Partial<Record<Vehicle, ExistingVehicleInfo | null>> | null | undefined
): string[] {
	const result = [...selected];
	for (const { value } of vehicles) {
		const vehicleInfo = info?.[value];
		if (vehicleInfo && (vehicleInfo.notes != null || vehicleInfo.location != null) && !result.includes(value)) {
			result.push(value);
		}
	}
	return result;
}

@Component({
	selector: 'app-defect-category-additional-info',
	templateUrl: './defect-category-additional-info.component.html',
	imports: [
		ReactiveFormsModule,
		GovukCheckboxGroupComponent,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupInputComponent,
		AccordionComponent,
		AccordionControlComponent,
	],
})
export class DefectCategoryAdditionalInfoComponent {
	readonly form = input.required<AdditionalInfoForm>();
	readonly vehicleTypes = input.required<FormControl<string[]>>();
	readonly vehicles = vehicles;
	readonly directions = [
		{
			name: 'vertical',
			label: 'Vertical',
			options: [
				{ value: 'upper', label: 'Upper' },
				{ value: 'lower', label: 'Lower' },
			],
		},
		{
			name: 'horizontal',
			label: 'Horizontal',
			options: [
				{ value: 'inner', label: 'Inner' },
				{ value: 'outer', label: 'Outer' },
			],
		},
		{
			name: 'lateral',
			label: 'Lateral',
			options: [
				{ value: 'nearside', label: 'Nearside' },
				{ value: 'offside', label: 'Offside' },
				{ value: 'centre', label: 'Centre' },
			],
		},
		{
			name: 'longitudinal',
			label: 'Longitudinal',
			options: [
				{ value: 'front', label: 'Front' },
				{ value: 'rear', label: 'Rear' },
			],
		},
	];
	readonly numbers = [
		{ name: 'rowNumber', label: 'Maximum row number', maximum: 20 },
		{ name: 'seatNumber', label: 'Maximum seat number', maximum: 6 },
		{ name: 'axleNumber', label: 'Maximum axle number', maximum: 10 },
	];
}
