import { AxlesService } from '@/src/app/services/axles/axles.service';
import { KeyValuePipe, ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagComponent, TagType } from '@components/tag/tag.component';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import {
	FITMENT_CODE_OPTIONS,
	HGV_TYRE_USE_CODE_OPTIONS,
	SPEED_CATEGORY_SYMBOL_OPTIONS,
	TRL_TYRE_USE_CODE_OPTIONS,
} from '@models/options.model';
import { ReferenceDataResourceType, ReferenceDataTyre, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { Axle, FitmentCode, ReasonForEditing, Tyre, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { updateScrollPosition } from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { ReplaySubject, combineLatest, filter, takeUntil } from 'rxjs';
import { FieldWarningMessageComponent } from '../../../components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '../../../components/govuk-form-group-select/govuk-form-group-select.component';

@Component({
	selector: 'app-tyres-section-edit',
	templateUrl: './tyres-section-edit.component.html',
	styleUrls: ['./tyres-section-edit.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		TagComponent,
		FieldWarningMessageComponent,
		GovukFormGroupSelectComponent,
		KeyValuePipe,
	],
})
export class TyresSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy, OnChanges {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly HGV_TYRE_USE_CODE_OPTIONS = HGV_TYRE_USE_CODE_OPTIONS;
	protected readonly TRL_TYRE_USE_CODE_OPTIONS = TRL_TYRE_USE_CODE_OPTIONS;
	protected readonly SPEED_CATEGORY_SYMBOL_OPTIONS = SPEED_CATEGORY_SYMBOL_OPTIONS;
	protected readonly FITMENT_CODE_OPTIONS = FITMENT_CODE_OPTIONS;

	actions = inject(Actions);
	route = inject(ActivatedRoute);
	router = inject(Router);
	axlesService = inject(AxlesService);
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
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.loadReferenceData();

		this.editingReason = this.route.snapshot.data['reason'];

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
		this.checkFitmentCodeHasChanged(changes);
		this.checkAxleWeights(changes);
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
		};
	}

	get psvControls() {
		return {
			techRecord_speedRestriction: this.fb.control<number | null>(null, [
				this.commonValidators.min(0, 'Speed restriction must be greater than or equal to 0'),
				this.commonValidators.max(99, 'Speed restriction must be less than or equal to 99'),
			]),
		};
	}

	get trlControls() {
		return {
			techRecord_tyreUseCode: this.fb.control<string | null>(null),
		};
	}

	get techRecordAxles() {
		return this.parent.get('techRecord_axles') as FormArray;
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
				fitmentCode: lastAxle.tyres_fitmentCode as FitmentCode,
			});

			if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
				tyre.speedCategorySymbol = lastAxle.tyres_speedCategorySymbol;
			}

			this.addTyre(tyre, axleNumber);
		}
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
