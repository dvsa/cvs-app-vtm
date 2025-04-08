import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, input, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TyreUseCode as HgvTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeHgv.enum.js';
import { TyreUseCode as TrlTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeTrl.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { getOptionsFromEnum, getOptionsFromEnumOneChar } from '@forms/utils/enum-map';
import { MultiOptions } from '@models/options.model';
import { ReferenceDataResourceType, ReferenceDataTyre, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import {
	Axle,
	FitmentCode,
	ReasonForEditing,
	SpeedCategorySymbol,
	Tyre,
	Tyres,
	VehicleTypes,
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormArray,
	CustomFormGroup,
	FormNode,
	FormNodeEditTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import { addAxle, removeAxle, updateScrollPosition } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Observable, ReplaySubject, filter, takeUntil } from 'rxjs';
import { TagComponent } from '../../../components/tag/tag.component';
import { FieldWarningMessageComponent } from '../../components/field-warning-message/field-warning-message.component';
import { SwitchableInputComponent } from '../../components/switchable-input/switchable-input.component';

@Component({
	selector: 'app-tyres',
	templateUrl: './tyres.component.html',
	styleUrls: ['./tyres.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgIf,
		SwitchableInputComponent,
		NgSwitch,
		NgSwitchCase,
		TagComponent,
		FieldWarningMessageComponent,
		NgFor,
		NgTemplateOutlet,
	],
})
export class TyresComponent implements OnInit, OnDestroy, OnChanges {
	readonly vehicleTechRecord = model.required<TechRecordType<'hgv' | 'psv' | 'trl'>>();
	readonly isEditing = input(false);

	readonly formChange = output<any[] | Record<string, any>>();

	private destroy$ = new ReplaySubject<boolean>(1);

	public isError = false;
	public errorMessage?: string;
	public form!: CustomFormGroup;
	private editingReason?: ReasonForEditing;
	private loadIndexValues: ReferenceDataTyreLoadIndex[] | null = [];

	tyresReferenceData: ReferenceDataTyre[] = [];
	invalidAxles: Array<number> = [];

	constructor(
		private dynamicFormsService: DynamicFormService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<TechnicalRecordServiceState>,
		private viewportScroller: ViewportScroller,
		private referenceDataService: ReferenceDataService,
		private technicalRecordService: TechnicalRecordService
	) {
		this.editingReason = this.route.snapshot.data['reason'];
	}

	ngOnInit(): void {
		this.form = this.dynamicFormsService.createForm(
			this.template as FormNode,
			this.vehicleTechRecord()
		) as CustomFormGroup;
		this.form.cleanValueChanges.pipe(takeUntil(this.destroy$)).subscribe((event) => {
			if (event && !Array.isArray(event) && event['axles']) {
				event['axles'] = (event['axles'] as Axle[]).filter((axle) => !!axle?.axleNumber);
			}
			this.formChange.emit(event);
		});

		this.store
			.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.Tyres))
			.pipe(takeUntil(this.destroy$), filter(Boolean))
			.subscribe((data) => {
				this.tyresReferenceData = data as ReferenceDataTyre[];
			});

		this.loadIndex$.pipe(takeUntil(this.destroy$)).subscribe((value): void => {
			this.loadIndexValues = value;
		});
	}

	ngOnChanges(simpleChanges: SimpleChanges): void {
		const fitmentUpdated = this.checkFitmentCodeHasChanged(simpleChanges);
		this.checkAxleWeights(simpleChanges);
		if (!fitmentUpdated) {
			this.form?.patchValue(this.vehicleTechRecord(), { emitEvent: false });
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	get template(): FormNode | undefined {
		switch (this.vehicleTechRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return PsvTyresTemplate;
			case VehicleTypes.HGV:
				return tyresTemplateHgv;
			case VehicleTypes.TRL:
				return tyresTemplateTrl;
			default:
				return undefined;
		}
	}

	get isPsv(): boolean {
		return this.vehicleTechRecord().techRecord_vehicleType === VehicleTypes.PSV;
	}

	get isTrl(): boolean {
		return this.vehicleTechRecord().techRecord_vehicleType === VehicleTypes.TRL;
	}

	get types(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	get speedCategorySymbol(): MultiOptions {
		return getOptionsFromEnum(SpeedCategorySymbol);
	}

	get fitmentCode(): MultiOptions {
		return getOptionsFromEnumOneChar(FitmentCode);
	}

	get axles(): CustomFormArray {
		return this.form.get(['techRecord_axles']) as CustomFormArray;
	}

	get requiredPlates(): boolean {
		return this.vehicleTechRecord().techRecord_vehicleType !== VehicleTypes.PSV && this.isEditing() === true;
	}

	getAxleTyres(i: number): CustomFormGroup {
		return this.axles.get([i]) as CustomFormGroup;
	}

	get loadIndex$(): Observable<ReferenceDataTyreLoadIndex[] | null> {
		return this.referenceDataService.getAll$(ReferenceDataResourceType.TyreLoadIndex) as Observable<
			ReferenceDataTyreLoadIndex[]
		>;
	}

	checkAxleWeights(simpleChanges: SimpleChanges) {
		const { vehicleTechRecord } = simpleChanges;
		this.invalidAxles = [];
		if (
			!this.isEditing() ||
			!vehicleTechRecord.currentValue.techRecord_axles ||
			(vehicleTechRecord.previousValue &&
				!vehicleTechRecord.previousValue.techRecord_axles &&
				vehicleTechRecord.currentValue.techRecord_axles === vehicleTechRecord.previousValue.techRecord_axles)
		) {
			return;
		}
		vehicleTechRecord.currentValue.techRecord_axles.forEach((axle: Axle) => {
			if (axle.tyres_dataTrAxles && axle.weights_gbWeight && axle.axleNumber) {
				const weightValue = this.technicalRecordService.getAxleFittingWeightValueFromLoadIndex(
					axle.tyres_dataTrAxles.toString(),
					axle.tyres_fitmentCode,
					this.loadIndexValues
				);
				if (weightValue && axle.weights_gbWeight > weightValue) {
					this.invalidAxles.push(axle.axleNumber);
				}
			}
		});
	}

	checkFitmentCodeHasChanged(simpleChanges: SimpleChanges): boolean {
		const { vehicleTechRecord } = simpleChanges;
		if (vehicleTechRecord.firstChange !== undefined && vehicleTechRecord.firstChange === false) {
			const currentAxles = vehicleTechRecord.currentValue.techRecord_axles;
			const previousAxles = vehicleTechRecord.previousValue.techRecord_axles;

			if (!currentAxles) return false;
			if (!previousAxles) return false;

			// eslint-disable-next-line no-restricted-syntax
			for (const [index, axle] of currentAxles.entries()) {
				if (
					axle?.tyres_fitmentCode !== undefined &&
					previousAxles[`${index}`] &&
					previousAxles[`${index}`].tyres_fitmentCode !== undefined &&
					axle.tyres_fitmentCode !== previousAxles[`${index}`].tyres_fitmentCode &&
					axle.tyres_tyreCode === previousAxles[`${index}`].tyres_tyreCode
				) {
					this.getTyresRefData(axle.axleNumber);
					return true;
				}
			}
		}

		return false;
	}

	handleNoAxleInfo(axleNumber: number) {
		this.errorMessage = `Cannot find data of this tyre on axle ${axleNumber}`;
		this.isError = true;
		const newTyre = new Tyre({
			tyreCode: null,
			tyreSize: null,
			plyRating: null,
			dataTrAxles: null,
		});

		this.addTyreToTechRecord(newTyre, axleNumber);
	}

	getTyresRefData(axleNumber: number): void {
		this.errorMessage = undefined;

		const { techRecord_axles: axles } = this.vehicleTechRecord();
		if (axles == null) return;

		const axle = axles[axleNumber - 1];
		if (axle) {
			const { tyres_tyreCode: code } = axle;
			const tyreReferenceData = this.tyresReferenceData.find((tyre) => tyre.code === String(code));
			if (tyreReferenceData) {
				const { tyres_fitmentCode: fit } = axle;
				const indexLoad =
					fit === FitmentCode.SINGLE
						? Number.parseInt(String(tyreReferenceData.loadIndexSingleLoad), 10)
						: Number.parseInt(String(tyreReferenceData.loadIndexTwinLoad), 10);

				const newTyre = new Tyre({
					tyreCode: code,
					tyreSize: tyreReferenceData.tyreSize,
					plyRating: tyreReferenceData.plyRating,
					dataTrAxles: indexLoad,
				});

				this.addTyreToTechRecord(newTyre, axleNumber);

				return;
			}
		}

		this.handleNoAxleInfo(axleNumber);
	}

	getTyreSearchPage(axleNumber: number) {
		const route = this.editingReason
			? `../${this.editingReason}/tyre-search/${axleNumber}`
			: `./tyre-search/${axleNumber}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));

		void this.router.navigate([route], { relativeTo: this.route, state: this.vehicleTechRecord() });
	}

	addTyreToTechRecord(tyre: Tyres, axleNumber: number): void {
		this.vehicleTechRecord.set(cloneDeep(this.vehicleTechRecord()));
		const vehicleTechRecord = this.vehicleTechRecord();
		const axleIndex = vehicleTechRecord.techRecord_axles?.findIndex((ax) => ax.axleNumber === axleNumber);

		if (axleIndex === undefined || axleIndex === -1) {
			return;
		}
		const axle = vehicleTechRecord.techRecord_axles?.[`${axleIndex}`];
		if (axle) {
			axle.tyres_tyreCode = tyre.tyreCode;
			axle.tyres_tyreSize = tyre.tyreSize;
			axle.tyres_plyRating = tyre.plyRating;
			axle.tyres_dataTrAxles = tyre.dataTrAxles;
			this.form.patchValue(vehicleTechRecord);
		}
	}

	addAxle(): void {
		const vehicleTechRecord = this.vehicleTechRecord();
		if (!vehicleTechRecord.techRecord_axles || vehicleTechRecord.techRecord_axles.length < 10) {
			this.isError = false;
			this.store.dispatch(addAxle());
		} else {
			this.isError = true;
			this.errorMessage = `Cannot have more than ${10} axles`;
		}
	}

	removeAxle(index: number): void {
		const minLength = this.isTrl ? 1 : 2;
		const axles = this.vehicleTechRecord().techRecord_axles;

		if (axles && axles.length > minLength) {
			this.isError = false;
			this.store.dispatch(removeAxle({ index }));
		} else {
			this.isError = true;
			this.errorMessage = `Cannot have less than ${minLength} axles`;
		}
	}

	protected readonly getOptionsFromEnum = getOptionsFromEnum;

	get tyreUseCode() {
		return getOptionsFromEnum(
			this.vehicleTechRecord().techRecord_vehicleType === 'hgv' ? HgvTyreUseCode : TrlTyreUseCode
		);
	}
}
