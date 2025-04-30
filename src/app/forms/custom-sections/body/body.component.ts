import { AsyncPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, input, output } from '@angular/core';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import {
	BodyTypeCode,
	BodyTypeDescription,
	vehicleBodyTypeCodeMap,
	vehicleBodyTypeDescriptionMap,
} from '@models/body-type-enum';
import { MultiOptions } from '@models/options.model';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormGroup,
	FormNode,
	FormNodeEditTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/index';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { updateBody, updateEditingTechRecord } from '@store/technical-records';
import {
	Observable,
	Subject,
	asapScheduler,
	combineLatest,
	debounceTime,
	map,
	mergeMap,
	skipWhile,
	take,
	takeUntil,
} from 'rxjs';
import { TrimWhitespaceDirective } from '../../../directives/app-trim-whitespace/app-trim-whitespace.directive';
import { SwitchableInputComponent } from '../../components/switchable-input/switchable-input.component';

@Component({
	selector: 'app-body',
	templateUrl: './body.component.html',
	styleUrls: ['./body.component.scss'],
	imports: [SwitchableInputComponent, TrimWhitespaceDirective, AsyncPipe],
})
export class BodyComponent implements OnInit, OnChanges, OnDestroy {
	readonly techRecord = input.required<V3TechRecordModel>();
	readonly isEditing = input(false);
	readonly disableLoadOptions = input(false);

	readonly formChange = output();

	public form!: CustomFormGroup;
	private template!: FormNode;
	private destroy$ = new Subject<void>();

	constructor(
		private dfs: DynamicFormService,
		private optionsService: MultiOptionsService,
		private referenceDataService: ReferenceDataService,
		private store: Store<State>
	) {}

	ngOnInit(): void {
		this.template =
			this.techRecord().techRecord_vehicleType === VehicleTypes.PSV ? PsvBodyTemplate : HgvAndTrlBodyTemplate;
		this.form = this.dfs.createForm(this.template, this.techRecord()) as CustomFormGroup;
		this.form.cleanValueChanges
			.pipe(
				debounceTime(400),
				takeUntil(this.destroy$),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mergeMap((event: any) =>
					this.store.pipe(
						select(
							selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, event.techRecord_brakes_dtpNumber)
						),
						take(1),
						map((referenceData) => [event, referenceData as PsvMake])
					)
				)
			)
			.subscribe(([event, psvMake]) => {
				// Set the body type code automatically based selection
				if (event?.techRecord_bodyType_description) {
					// body type codes are specific to the vehicle type
					const techRecord = this.techRecord();
					const vehicleType =
						techRecord.techRecord_vehicleType === 'hgv'
							? `${techRecord.techRecord_vehicleConfiguration}Hgv`
							: techRecord.techRecord_vehicleType;
					const bodyTypes = vehicleBodyTypeDescriptionMap.get(vehicleType as VehicleTypes) as Map<
						BodyTypeDescription,
						BodyTypeCode
					>;
					event.techRecord_bodyType_code = bodyTypes.get(event?.techRecord_bodyType_description);
				}

				this.formChange.emit(event);

				if (
					this.techRecord().techRecord_vehicleType === VehicleTypes.PSV &&
					event?.techRecord_brakes_dtpNumber &&
					event.techRecord_brakes_dtpNumber.length >= 4 &&
					psvMake
				) {
					this.store.dispatch(updateBody({ psvMake }));
				}
			});

		this.loadOptions();
	}

	ngOnChanges(changes: SimpleChanges): void {
		const { techRecord } = changes;

		if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
			this.form.patchValue(techRecord.currentValue, { emitEvent: false });
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get editTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	get bodyTypes(): MultiOptions {
		let vehicleType: string = this.techRecord().techRecord_vehicleType;

		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === 'hgv') {
			vehicleType = `${techRecord.techRecord_vehicleConfiguration}Hgv`;
			this.updateHgvVehicleBodyType(techRecord);
		}
		const optionsMap = vehicleBodyTypeCodeMap.get(vehicleType) ?? [];
		const values = [...optionsMap.values()];
		return getOptionsFromEnum(values.sort());
	}

	get bodyMakes$(): Observable<MultiOptions | undefined> {
		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
			return this.optionsService.getOptions(ReferenceDataResourceType.HgvMake);
		}
		if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) {
			return this.optionsService.getOptions(ReferenceDataResourceType.PsvMake);
		}
		return this.optionsService.getOptions(ReferenceDataResourceType.TrlMake);
	}

	get dtpNumbers$(): Observable<MultiOptions> {
		return combineLatest([
			this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
			this.referenceDataService.getReferencePsvMakeDataLoading$(),
		]).pipe(
			skipWhile(([, loading]) => loading),
			take(1),
			map(([data]) => {
				return data?.map((option) => ({ value: option.resourceKey, label: option.resourceKey })) as MultiOptions;
			})
		);
	}

	loadOptions(): void {
		if (this.disableLoadOptions()) return;

		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.HgvMake);
		} else if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
		} else {
			this.optionsService.loadOptions(ReferenceDataResourceType.TrlMake);
		}
	}

	updateHgvVehicleBodyType(record: TechRecordVehicleType<'hgv'>) {
		if (record.techRecord_vehicleConfiguration === 'articulated') {
			asapScheduler.schedule(() =>
				this.store.dispatch(
					updateEditingTechRecord({
						vehicleTechRecord: {
							...this.techRecord(),
							techRecord_bodyType_description: 'articulated',
							techRecord_bodyType_code: 'a',
						} as TechRecordType<'put'>,
					})
				)
			);
		}
	}
}
