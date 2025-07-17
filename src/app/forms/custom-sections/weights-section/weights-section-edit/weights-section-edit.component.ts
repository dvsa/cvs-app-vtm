import { KeyValuePipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input, output } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { addAxle, removeAxle, updateBrakeForces } from '@store/technical-records';
import { ReplaySubject, takeUntil } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';

@Component({
	selector: 'app-weights-section-edit',
	templateUrl: './weights-section-edit.component.html',
	styleUrls: ['./weights-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, TagComponent, GovukFormGroupInputComponent, KeyValuePipe],
})
export class WeightsSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy, OnChanges {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	actions = inject(Actions);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();
	formChange = output<Partial<TechRecordType<'hgv' | 'trl' | 'psv'>>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.prepopulateAxles();
		this.checkAxleAdded();
		this.checkAxleRemoved();
		this.handleFormChange();
		this.handleGrossKerbWeightChange();
		this.handleGrossLadenWeightChange();

		// Attach all form controls to parent
		this.init(this.form);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.handleVehicleTechRecordChange(changes);
	}

	get techRecordAxles() {
		return this.form.get('techRecord_axles') as FormArray;
	}

	getAxleForm() {
		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) return this.addPsvAxleWeights();
		return this.addHgvTrlAxleWeights();
	}

	prepopulateAxles() {
		this.techRecord().techRecord_axles?.forEach((axle) => {
			const form = this.getAxleForm();
			form.patchValue(axle as any, { emitEvent: false });
			this.techRecordAxles.push(form, { emitEvent: false });
		});
	}

	handleFormChange() {
		this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
			this.formChange.emit(changes);
		});
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

	addHgvTrlAxleWeights() {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(null),
			weights_gbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle GB Weight must be less than or equal to 99999'),
			]),
			weights_eecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle EEC Weight must be less than or equal to 99999'),
			]),
			weights_designWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle Design Weight must be less than or equal to 99999'),
			]),
		});
	}

	addPsvAxleWeights() {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(null),
			weights_kerbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle Kerb Weight must be less than or equal to 99999'),
			]),
			weights_ladenWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle Laden Weight must be less than or equal to 99999'),
			]),
			weights_gbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle GB Weight must be less than or equal to 99999'),
			]),
			weights_designWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle Design Weight must be less than or equal to 99999'),
			]),
		});
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

	get hgvControls() {
		return {
			techRecord_axles: this.fb.array([]),
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB Weight must be less than or equal to 99999'),
			]),
			techRecord_grossEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross EEC Weight must be less than or equal to 99999'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Design Weight must be less than or equal to 99999'),
			]),
			techRecord_trainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB Weight must be less than or equal to 99999'),
			]),
			techRecord_trainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train EEC Weight must be less than or equal to 99999'),
			]),
			techRecord_trainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train Design Weight must be less than or equal to 99999'),
			]),
			techRecord_maxTrainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max Train GB Weight must be less than or equal to 99999'),
			]),
			techRecord_maxTrainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max Train EEC weight must be less than or equal to 99999'),
			]),
			techRecord_maxTrainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max Train Design Weight must be less than or equal to 99999'),
			]),
		};
	}

	get trlControls() {
		return {
			techRecord_axles: this.fb.array([]),
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB Weight be less than or equal to 99999'),
			]),
			techRecord_grossEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross EEC Weight must be less than or equal to 99999'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Design Weight must be less than or equal to 99999'),
			]),
		};
	}

	get psvControls() {
		return {
			techRecord_unladenWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Unladen Weight must be less than or equal to 99999'),
			]),
			techRecord_axles: this.fb.array([]),
			techRecord_grossKerbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Kerb Weight must be less than or equal to 99999'),
			]),
			techRecord_grossLadenWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Laden Weight  be less than or equal to 99999'),
			]),
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB Weight must be less than or equal to 99999'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross Design Weight must be less than or equal to 99999'),
			]),
			techRecord_maxTrainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max Train GB Weight must be less than or equal to 99999'),
			]),
			techRecord_trainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train Design Weight must be less than or equal to 99999'),
			]),
		};
	}

	addAxle() {
		const techRecord = this.techRecord();
		if (!techRecord.techRecord_axles || techRecord.techRecord_axles.length < 10) {
			this.techRecordAxles.setErrors(null);
			this.store.dispatch(addAxle());
			return;
		}

		this.techRecordAxles.setErrors({
			length: 'Cannot have more than 10 axles',
		});
	}

	removeAxle(index: number) {
		const techRecord = this.techRecord();
		const minLength = techRecord.techRecord_vehicleType === VehicleTypes.TRL ? 1 : 2;
		const axles = this.techRecordAxles.value;

		if (Array.isArray(axles) && axles.length > minLength) {
			this.techRecordAxles.setErrors(null);
			this.store.dispatch(removeAxle({ index }));
			return;
		}

		this.techRecordAxles.setErrors({
			length: `Cannot have less than ${minLength} axles`,
		});
	}

	checkAxleAdded() {
		this.actions
			.pipe(ofType(addAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord) {
					const axles = (techRecord as TechRecordType<'hgv' | 'trl' | 'psv'>).techRecord_axles || [];
					const form = this.getAxleForm();
					form.patchValue(axles[axles.length - 1], { emitEvent: false });
					this.techRecordAxles.push(form, { emitEvent: false });
					this.techRecordAxles.patchValue(axles, { emitEvent: false });
				}
			});
	}

	checkAxleRemoved() {
		this.actions
			.pipe(ofType(removeAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord) {
					const axles = (techRecord as TechRecordType<'hgv' | 'trl' | 'psv'>).techRecord_axles || [];
					this.techRecordAxles.removeAt(0, { emitEvent: false });
					this.techRecordAxles.patchValue(axles, { emitEvent: false });
				}
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
}
