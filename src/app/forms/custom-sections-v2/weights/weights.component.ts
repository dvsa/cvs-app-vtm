import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { updateBrakeForces } from '@/src/app/store/technical-records';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { CouplingTypeOptions } from '@models/coupling-type-enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { AxlesService } from '@services/axles/axles.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-weights',
	templateUrl: './weights.component.html',
	styleUrls: ['./weights.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		FieldWarningMessageComponent,
		FieldErrorMessageComponent,
		GovukFormGroupSelectComponent,
	],
})
export class WeightsComponent extends EditBaseComponent implements OnInit, OnDestroy, OnChanges {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;

	showDimensionsWarning = false;

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	axlesService = inject(AxlesService);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.handleGrossKerbWeightChange();
		this.handleGrossLadenWeightChange();
		this.init(this.form);
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get hgvControls() {
		return {
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
		};
	}

	get psvControls() {
		return {
			techRecord_unladenWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Unladen Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossKerbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99999,
					'Gross Kerb, Laden, GB Max, Design Weight must be less than or equal to 99999kg'
				),
			]),
			techRecord_grossLadenWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99999,
					'Gross Kerb, Laden, GB Max, Design Weight must be less than or equal to 99999kg'
				),
			]),
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99999,
					'Gross Kerb, Laden, GB Max, Design Weight must be less than or equal to 99999kg'
				),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99999,
					'Gross Kerb, Laden, GB Max, Design Weight must be less than or equal to 99999kg'
				),
			]),
			techRecord_maxTrainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB Max, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB Max, Design Weight must be less than or equal to 99999kg'),
			]),
		};
	}

	get trlControls() {
		return {
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_couplingType: this.fb.control<string | null>(null),
			techRecord_maxLoadOnCoupling: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max load on coupling must be less than or equal to 99999kg'),
			]),
		};
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return this.hgvControls;
			case VehicleTypes.TRL:
				return this.trlControls;
			case VehicleTypes.PSV:
				return this.psvControls;
			default:
				return {};
		}
	}

	get techRecordAxles() {
		return this.parent.get('techRecord_axles') as FormArray;
	}

	showAddAxleButton() {
		return (this.techRecord()?.techRecord_noOfAxles ?? 0) < 10;
	}

	removeAxle(index: number) {
		this.axlesService.removeAxle(this.parent, this.techRecord().techRecord_vehicleType, index);
		this.showDimensionsWarning = true;
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.handleVehicleTechRecordChange(changes);
	}

	handleGrossKerbWeightChange() {
		if (this.techRecord().techRecord_vehicleType !== VehicleTypes.PSV) return;
		const grossKerbWeight = this.form.get('techRecord_grossKerbWeight');
		grossKerbWeight?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			if (value)
				this.store.dispatch(
					updateBrakeForces({
						grossKerbWeight: value,
						grossLadenWeight: this.form.get('techRecord_grossLadenWeight')?.value,
					})
				);
		});
	}

	handleGrossLadenWeightChange() {
		if (this.techRecord().techRecord_vehicleType !== VehicleTypes.PSV) return;
		const grossLadenWeight = this.form.get('techRecord_grossLadenWeight');
		grossLadenWeight?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			if (value)
				this.store.dispatch(
					updateBrakeForces({
						grossKerbWeight: this.form.get('techRecord_grossKerbWeight')?.value,
						grossLadenWeight: value,
					})
				);
		});
	}

	private handleVehicleTechRecordChange(changes: SimpleChanges): void {
		const { techRecord } = changes;
		if (this.form && techRecord) {
			const { currentValue, previousValue } = techRecord;
			if (currentValue?.techRecord_vehicleType === 'psv' && currentValue?.techRecord_manufactureYear) {
				const fieldsChanged = [
					'techRecord_seatsUpperDeck',
					'techRecord_seatsLowerDeck',
					'techRecord_manufactureYear',
					'techRecord_grossKerbWeight',
					'techRecord_standingCapacity',
				].some((field) => currentValue[`${field}`] !== previousValue?.[`${field}`]);

				if (fieldsChanged) {
					const grossLadenWeight = this.calculateGrossLadenWeight();
					if (grossLadenWeight !== currentValue.techRecord_grossLadenWeight) {
						currentValue.techRecord_grossLadenWeight = grossLadenWeight;
						if (currentValue.techRecord_grossLadenWeight !== previousValue?.techRecord_grossLadenWeight) {
							this.form.patchValue({ techRecord_grossLadenWeight: grossLadenWeight }, { emitEvent: false });
							this.technicalRecordService.updateEditingTechRecord(currentValue);
						}
					}
				}
			}
		}
	}

	calculateGrossLadenWeight(): number {
		const psvRecord = this.techRecord() as TechRecordType<'psv'>;
		const techRecord_seatsUpperDeck = psvRecord?.techRecord_seatsUpperDeck ?? 0;
		const techRecord_seatsLowerDeck = psvRecord?.techRecord_seatsLowerDeck ?? 0;
		const techRecord_manufactureYear = psvRecord?.techRecord_manufactureYear ?? 0;
		const techRecord_grossKerbWeight = psvRecord?.techRecord_grossKerbWeight ?? 0;
		const techRecord_standingCapacity = psvRecord?.techRecord_standingCapacity ?? 0;
		const kgAllowedPerPerson = techRecord_manufactureYear >= 1988 ? 65 : 63.5;

		const totalPassengers = techRecord_seatsUpperDeck + techRecord_seatsLowerDeck + techRecord_standingCapacity + 1; // Add 1 for the driver
		return Math.ceil(totalPassengers * kgAllowedPerPerson + techRecord_grossKerbWeight);
	}

	protected readonly CouplingTypeOptions = CouplingTypeOptions;
}
