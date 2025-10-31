import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { EXEMPT_OR_NOT_OPTIONS, VEHICLE_SIZE_OPTIONS } from '@models/options.model';
import { V3TechRecordModel, VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-seats-and-vehicle-size',
	templateUrl: './seats-and-vehicle-size.component.html',
	styleUrls: ['./seats-and-vehicle-size.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
	],
})
export class SeatsAndVehicleSizeComponent extends EditBaseComponent implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({
		techRecord_seatsUpperDeck: this.fb.control<number | null>(null, [
			this.commonValidators.max(99, 'Upper deck seats must be less than or equal to 99'),
			this.handlePsvPassengersChange(),
		]),
		techRecord_seatsLowerDeck: this.fb.control<number | null>(null, [
			this.commonValidators.max(999, 'Lower deck seats must be less than or equal to 999'),
			this.handlePsvPassengersChange(),
		]),
		techRecord_standingCapacity: this.fb.control<number | null>(null, [
			this.commonValidators.max(999, 'Standing capacity must be less than or equal to 999'),
			this.handlePsvPassengersChange(),
		]),
		techRecord_dda_wheelchairCapacity: this.fb.control<number | null>(null, [
			this.commonValidators.max(99, 'Wheelchair capacity must be less than or equal to 99'),
		]),
		techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
			this.commonValidators.required('Vehicle class is required'),
		]),
		techRecord_vehicleSize: this.fb.control<string | null>(null, [
			this.commonValidators.required('Vehicle size is required'),
		]),
		techRecord_numberOfSeatbelts: this.fb.control<string | null>(null, [
			this.commonValidators.max(150, 'Number of seatbelts must be less than or equal to 150'),
		]),
		techRecord_seatbeltInstallationApprovalDate: this.fb.control<string | null>(null, [
			this.commonValidators.date('Seatbelt installation approval date'),
			this.commonValidators.pastDate('Seatbelt installation approval date must be in the past'),
		]),
	});

	handlePsvPassengersChange(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.dirty) {
				const seatsUpper: number = control.parent?.get('techRecord_seatsUpperDeck')?.getRawValue();
				const seatsLower: number = control.parent?.get('techRecord_seatsLowerDeck')?.getRawValue();
				const standingCapacity: number = control.parent?.get('techRecord_standingCapacity')?.getRawValue();
				const totalPassengers = seatsUpper + seatsLower + standingCapacity;
				this.setPassengerValue(totalPassengers <= 22, control);
				control.markAsPristine();
			}

			return null;
		};
	}

	setPassengerValue(smallPsv: boolean, control: AbstractControl) {
		const classControl = control.parent?.get('techRecord_vehicleClass_description');
		const sizeControl = control.parent?.get('techRecord_vehicleSize');
		if (smallPsv) {
			sizeControl?.setValue(VehicleSizes.SMALL, { emitEvent: false });
			classControl?.setValue(VehicleClassDescription.SmallPsvIeLessThanOrEqualTo22Seats, { emitEvent: false });
		} else {
			sizeControl?.setValue(VehicleSizes.LARGE, { emitEvent: false });
			classControl?.setValue(VehicleClassDescription.LargePsvIeGreaterThan23Seats, { emitEvent: false });
		}
	}

	ngOnInit(): void {
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	VehicleClassOptions = [
		{
			label: 'Small PSV',
			value: 'small psv (ie: less than or equal to 22 seats)',
			hint: 'Less than or equal to 22 passengers',
		},
		{
			label: 'Large PSV',
			value: 'large psv(ie: greater than 23 seats)',
			hint: 'Greater than or equal to 23 passengers',
		},
	];

	protected readonly VehicleTypes = VehicleTypes;
	protected readonly EXEMPT_OR_NOT_OPTIONS = EXEMPT_OR_NOT_OPTIONS;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly VEHICLE_SIZE_OPTIONS = VEHICLE_SIZE_OPTIONS;
}
