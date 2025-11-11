import { TagType } from '@/src/app/components/tag/tag.component';
import { Axle, FitmentCode, Tyre, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import {
	FITMENT_CODE_OPTIONS,
	HGV_TYRE_USE_CODE_OPTIONS,
	SPEED_CATEGORY_SYMBOL_OPTIONS,
	TRL_TYRE_USE_CODE_OPTIONS,
} from '@models/options.model';
import { ReferenceDataResourceType, ReferenceDataTyre, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { AxlesService } from '@services/axles/axles.service';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { updateScrollPosition } from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { ReplaySubject, combineLatest, filter, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tyres',
	templateUrl: './tyres.component.html',
	styleUrls: ['./tyres.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
		FieldWarningMessageComponent,
		FieldErrorMessageComponent,
	],
})
export class TyresComponent extends EditBaseComponent implements OnInit, OnDestroy, OnChanges {
	readonly VehicleTypes = VehicleTypes;
	readonly Widths = FormNodeWidth;
	readonly TagType = TagType;
	readonly TagTypeLabels = TagTypeLabels;

	referenceDataService = inject(ReferenceDataService);
	viewportScroller = inject(ViewportScroller);
	router = inject(Router);
	route = inject(ActivatedRoute);
	axlesService = inject(AxlesService);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});
	tyresReferenceData: ReferenceDataTyre[] = [];
	tyreLoadIndexReferenceData: ReferenceDataTyreLoadIndex[] = [];
	invalidAxles: Array<number> = [];

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

		this.techRecordAxles.at(axleIndex).patchValue(axle);
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

	getTyresRefData(axleNumber: number) {
		const axles = this.techRecordAxles.value;

		// Don't search if the axle is unfocused by removing the axle
		if (axles === null || axles === undefined) return;

		// Get the last added axle, as this is the one that needs autopopulating
		const lastAxle = axles[axleNumber - 1];

		if (lastAxle?.tyres_tyreCode) {
			const refData = this.tyresReferenceData.find((tyre) => tyre.code === String(lastAxle.tyres_tyreCode));

			if (!refData) {
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

	getTyreSearchPage(axleNumber: any) {
		const route = `./tyre-search/${axleNumber}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate([route], { relativeTo: this.route, state: this.techRecord() });
	}

	get invalidAxlesAll() {
		return this.axlesService.allInvalidAxles;
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

	get techRecordAxles() {
		return this.parent.get('techRecord_axles') as FormArray;
	}

	get showDimensionsWarning() {
		return this.axlesService.showDimensionsWarning;
	}

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.loadReferenceData();

		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord());
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.checkFitmentCodeHasChanged(changes);
		this.checkAxleWeights(changes);
	}

	showAddAxleButton() {
		return (this.techRecord()?.techRecord_noOfAxles ?? 0) < 10;
	}

	removeAxle(index: number) {
		this.axlesService.removeAxle(this.parent, this.techRecord().techRecord_vehicleType, index);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get hgvTrlControls() {
		return {
			techRecord_tyreUseCode: this.fb.control<string | null>(null),
		};
	}

	get psvControls() {
		return {};
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return this.psvControls;
			case VehicleTypes.HGV:
				return this.hgvTrlControls;
			case VehicleTypes.TRL:
				return this.hgvTrlControls;
			default:
				return {};
		}
	}

	checkAxleWeights(changes: SimpleChanges) {
		this.axlesService.allInvalidAxles = this.invalidAxles = [];

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
					this.axlesService.allInvalidAxles = this.invalidAxles;
				}
			}
		});
	}

	protected readonly FITMENT_CODE_OPTIONS = FITMENT_CODE_OPTIONS;
	protected readonly SPEED_CATEGORY_SYMBOL_OPTIONS = SPEED_CATEGORY_SYMBOL_OPTIONS;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly HGV_TYRE_USE_CODE_OPTIONS = HGV_TYRE_USE_CODE_OPTIONS;
	protected readonly TRL_TYRE_USE_CODE_OPTIONS = TRL_TYRE_USE_CODE_OPTIONS;
}
