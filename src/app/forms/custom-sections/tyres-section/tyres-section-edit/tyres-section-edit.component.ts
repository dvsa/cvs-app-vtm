import { TagType } from '@/src/app/components/tag/tag.component';
import {
	FITMENT_CODE_OPTIONS,
	HGV_TYRE_USE_CODE_OPTIONS,
	SPEED_CATEGORY_SYMBOL_OPTIONS,
	TRL_TYRE_USE_CODE_OPTIONS,
} from '@/src/app/models/options.model';
import {
	ReferenceDataResourceType,
	ReferenceDataTyre,
	ReferenceDataTyreLoadIndex,
} from '@/src/app/models/reference-data.model';
import { FormNodeWidth, TagTypeLabels } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@/src/app/services/reference-data/reference-data.service';
import { addAxle, removeAxle, updateScrollPosition } from '@/src/app/store/technical-records';
import { ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { Axle, FitmentCode, ReasonForEditing, Tyre, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { cloneDeep } from 'lodash';
import { ReplaySubject, combineLatest, filter, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tyres-section-edit',
	templateUrl: './tyres-section-edit.component.html',
	styleUrls: ['./tyres-section-edit.component.scss'],
})
export class TyresSectionEditComponent implements OnInit, OnDestroy, OnChanges {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly HGV_TYRE_USE_CODE_OPTIONS = HGV_TYRE_USE_CODE_OPTIONS;
	protected readonly TRL_TYRE_USE_CODE_OPTIONS = TRL_TYRE_USE_CODE_OPTIONS;
	protected readonly SPEED_CATEGORY_SYMBOL_OPTIONS = SPEED_CATEGORY_SYMBOL_OPTIONS;
	protected readonly FITMENT_CODE_OPTIONS = FITMENT_CODE_OPTIONS;

	fb = inject(FormBuilder);
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	referenceDataService = inject(ReferenceDataService);
	viewportScroller = inject(ViewportScroller);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);
	editingReason = ReasonForEditing.CORRECTING_AN_ERROR;
	invalidAxles: Array<number> = [];
	tyresReferenceData: ReferenceDataTyre[] = [];
	tyreLoadIndexReferenceData: ReferenceDataTyreLoadIndex[] = [];

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();
		this.prepopulateAxles();
		this.loadReferenceData();

		this.editingReason = this.route.snapshot.data['reason'];

		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key, { emitEvent: false });
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.checkAxleAdded(changes);
		this.checkAxleRemoved(changes);
		this.checkFitmentCodeHasChanged(changes);
		this.checkAxleWeights(changes);
	}

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord()?.techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return this.hgvControls;
			case VehicleTypes.PSV:
				return this.psvControls;
			case VehicleTypes.TRL:
				return this.trlControls;
			default:
				return {};
		}
	}

	get hgvControls() {
		return {
			techRecord_tyreUseCode: this.fb.control(null),
			techRecord_axles: this.fb.array([]),
		};
	}

	get psvControls() {
		return {
			techRecord_speedRestriction: this.fb.control<number | null>(null, [
				this.commonValidators.min(0, 'Speed restriction must be greater than or equal to 0'),
				this.commonValidators.max(99, 'Speed restriction must be less than or equal to 99'),
			]),
			techRecord_axles: this.fb.array([]),
		};
	}

	get trlControls() {
		return {
			techRecord_tyreUseCode: this.fb.control<string | null>(null),
			techRecord_axles: this.fb.array([]),
		};
	}

	get techRecordAxles() {
		return this.form.get('techRecord_axles') as FormArray;
	}

	getHGVAxle() {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(null),
			tyres_tyreCode: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(12, 'Tyre Size must be less than or equal to 12 characters'),
				this.commonValidators.minLength(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(2, 'Ply Rating must be less than or equal to 2 characters'),
				this.commonValidators.minLength(0, 'Ply Rating must be greater than or equal to 0'),
			]),
			tyres_fitmentCode: this.fb.control<number | null>(null),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.max(999, 'Data TR Axles must be less than or equal to 999'),
				this.commonValidators.min(0, 'Data TR Axles must be greater than or equal to 0'),
			]),
		});
	}

	getPSVAxle() {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(null),
			tyres_tyreCode: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(12, 'Tyre Size must be less than or equal to 12 characters'),
				this.commonValidators.min(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(2, 'Ply Rating must be less than or equal to 2 characters'),
				this.commonValidators.min(0, 'Ply Rating must be greater than or equal to 0'),
			]),
			tyres_speedCategorySymbol: this.fb.control<string | null>(null),
			tyres_fitmentCode: this.fb.control<string | null>(null),
			tyres_dataTrAxles: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'Load index must be less than or equal to 999'),
				this.commonValidators.min(0, 'Load index must be greater than or equal to 0'),
			]),
		});
	}

	getTRLAxle() {
		return this.fb.group({
			axleNumber: this.fb.control<number | null>(null),
			tyres_tyreCode: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Tyre Code must be less than or equal to 99999'),
				this.commonValidators.min(0, 'Tyre Code must be greater than or equal to 0'),
			]),
			tyres_tyreSize: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.max(12, 'Tyre Size must be less than or equal to 12'),
				this.commonValidators.min(0, 'Tyre Size must be greater than or equal to 0'),
			]),
			tyres_plyRating: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.max(2, 'Ply rating must be less than or equal to 2'),
				this.commonValidators.min(0, 'Ply rating must be greater than or equal to 0'),
			]),
			tyres_fitmentCode: this.fb.control<string | null>(null),
			tyres_dataTrAxles: this.fb.control<number | null>({ value: null, disabled: true }, [
				this.commonValidators.max(999, 'Load index must be less than or equal to 999'),
				this.commonValidators.min(0, 'Load index must be greater than or equal to 0'),
			]),
		});
	}

	prepopulateAxles() {
		this.techRecord().techRecord_axles?.forEach((axle) => {
			const form = this.getAxleForm();
			form.patchValue(axle as any, { emitEvent: false });
			this.techRecordAxles.push(form, { emitEvent: false });
		});
	}

	loadReferenceData() {
		combineLatest([
			this.referenceDataService.getAll$(ReferenceDataResourceType.Tyres).pipe(filter(Boolean)),
			this.referenceDataService.getAll$(ReferenceDataResourceType.TyreLoadIndex).pipe(filter(Boolean)),
		])
			.pipe(takeUntil(this.destroy$))
			.subscribe(([tyres, tyreLoadIndex]) => {
				this.tyresReferenceData = tyres as ReferenceDataTyre[];
				this.tyreLoadIndexReferenceData = tyreLoadIndex as ReferenceDataTyreLoadIndex[];
			});
	}

	getTyreSearchPage(axleNumber: any) {
		const route = this.editingReason
			? `../${this.editingReason}/tyre-search/${axleNumber}`
			: `./tyre-search/${axleNumber}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate([route], { relativeTo: this.route, state: this.techRecord() });
	}

	getTyresRefData(axleNumber: number) {
		const axles = this.techRecordAxles.value;

		// Don't search if the axle is unfocused by removing the axle
		if (axles === null || axles === undefined) return;

		// Get the last added axle, as this is the one that needs autopopulating
		const lastAxle = axles[axleNumber - 1];

		if (lastAxle?.tyres_tyreCode) {
			const refData = this.tyresReferenceData.find((tyre) => tyre.code === String(lastAxle.tyres_tyreCode));

			if (!refData) {
				this.techRecordAxles.setErrors({ noAxleData: `Cannot find data of this tyre on axle ${axleNumber}` });
				return;
			}

			const indexLoad =
				lastAxle.tyres_fitmentCode === FitmentCode.SINGLE
					? Number.parseInt(String(refData.loadIndexSingleLoad), 10)
					: Number.parseInt(String(refData.loadIndexTwinLoad), 10);
			const tyre = new Tyre({
				tyreCode: lastAxle.tyres_tyreCode,
				tyreSize: refData.tyreSize,
				plyRating: refData.plyRating,
				dataTrAxles: indexLoad,
				fitmentCode: lastAxle.tyres_fitmentCode,
			});
			if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
				tyre.speedCategorySymbol = lastAxle.tyres_speedCategorySymbol;
			}

			this.addTyre(tyre, axleNumber);
		}
	}

	getAxleForm() {
		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) return this.getTRLAxle();
		if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) return this.getPSVAxle();
		return this.getHGVAxle();
	}

	addAxle() {
		const techRecord = this.techRecord();
		if (!techRecord.techRecord_axles || techRecord.techRecord_axles.length < 10) {
			this.techRecordAxles.setErrors(null);
			this.store.dispatch(addAxle());
			return;
		}

		this.techRecordAxles.setErrors({ length: 'Cannot have more than 10 axles' });
	}

	removeAxle(index: number) {
		const techRecord = this.techRecord();
		const minLength = techRecord.techRecord_vehicleType === VehicleTypes.TRL ? 1 : 2;

		if (techRecord.techRecord_axles && techRecord.techRecord_axles.length > minLength) {
			this.techRecordAxles.setErrors(null);
			this.store.dispatch(removeAxle({ index }));
			return;
		}

		this.techRecordAxles.setErrors({ length: `Cannot have less than ${minLength} axles` });
	}

	addTyre(tyre: Tyre, axleNumber: number) {
		const techRecord = this.techRecord();

		// Only add tyres if we can push to the axles array
		if (!techRecord.techRecord_axles) return;

		// Find axle by axle number, as they may be out of order
		const axleIndex = techRecord.techRecord_axles?.findIndex((ax) => ax.axleNumber === axleNumber);

		if (axleIndex === undefined || axleIndex === -1) return;

		const axlesClone = cloneDeep(techRecord.techRecord_axles);
		const axle = axlesClone[axleIndex];
		axle.tyres_tyreCode = tyre.tyreCode;
		axle.tyres_tyreSize = tyre.tyreSize;
		axle.tyres_plyRating = tyre.plyRating;
		axle.tyres_dataTrAxles = tyre.dataTrAxles;
		axle.tyres_fitmentCode = tyre.fitmentCode;
		if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) {
			(axle as PSVAxles).tyres_speedCategorySymbol = tyre.speedCategorySymbol;
		}

		this.techRecordAxles.patchValue(axlesClone);
		this.technicalRecordService.updateEditingTechRecord({ techRecord_axles: axlesClone } as any);
	}

	checkAxleAdded(changes: SimpleChanges) {
		const current = changes['techRecord']?.currentValue?.techRecord_axles;
		const previous = changes['techRecord']?.previousValue?.techRecord_axles;

		if (this.techRecordAxles && current?.length > previous?.length) {
			const control = this.getAxleForm();
			control.patchValue(current[current.length - 1]);
			this.techRecordAxles.push(control, { emitEvent: false });
		}
	}

	checkAxleRemoved(changes: SimpleChanges) {
		const current = changes['techRecord']?.currentValue?.techRecord_axles;
		const previous = changes['techRecord']?.previousValue?.techRecord_axles;

		if (this.techRecordAxles && current < previous) {
			this.techRecordAxles.removeAt(0);
			this.techRecordAxles.patchValue(current, { emitEvent: false });
		}
	}

	checkFitmentCodeHasChanged(changes: SimpleChanges) {
		if (changes['techRecord']?.firstChange) {
			const currentAxles = changes['techRecord']?.currentValue?.techRecord_axles;
			const previousAxles = changes['techRecord']?.previousValue?.techRecord_axles;

			if (!currentAxles) return false;
			if (!previousAxles) return false;

			for (const [index, axle] of currentAxles.entries()) {
				if (
					axle?.tyres_fitmentCode !== undefined &&
					previousAxles[index]?.tyres_fitmentCode !== undefined &&
					axle.tyres_fitmentCode !== previousAxles[index].tyres_fitmentCode &&
					axle.tyres_tyreCode === previousAxles[index].tyres_tyreCode
				) {
					return this.getTyresRefData(axle.axleNumber);
				}
			}
		}
	}

	checkAxleWeights(changes: SimpleChanges) {
		this.invalidAxles = [];

		if (
			!changes['techRecord']?.currentValue?.techRecord_axles ||
			(changes['techRecord']?.previousValue &&
				!changes['techRecord']?.previousValue.techRecord_axles &&
				changes['techRecord']?.currentValue?.techRecord_axles ===
					changes['techRecord']?.previousValue?.techRecord_axles)
		) {
			return;
		}

		changes['techRecord'].currentValue.techRecord_axles.forEach((axle: Axle) => {
			if (axle.tyres_dataTrAxles && axle.weights_gbWeight && axle.axleNumber) {
				const weightValue = this.technicalRecordService.getAxleFittingWeightValueFromLoadIndex(
					axle.tyres_dataTrAxles?.toString(),
					axle.tyres_fitmentCode,
					this.tyreLoadIndexReferenceData
				);
				if (weightValue && axle.weights_gbWeight > weightValue) {
					this.invalidAxles.push(axle.axleNumber);
				}
			}
		});
	}
}
