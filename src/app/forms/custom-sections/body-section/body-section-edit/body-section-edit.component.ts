import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { CustomTag, FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, ReplaySubject, combineLatest, map, skipWhile, take } from 'rxjs';

@Component({
	selector: 'app-body-section-edit',
	templateUrl: './body-section-edit.component.html',
	styleUrls: ['./body-section-edit.component.scss'],
})
export class BodySectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	referenceDataService = inject(ReferenceDataService);
	optionsService = inject(MultiOptionsService);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();
		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}
		this.loadOptions();
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

	get dtpNumbers$(): Observable<(string | number)[]> {
		return combineLatest([
			this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
			this.referenceDataService.getReferencePsvMakeDataLoading$(),
		]).pipe(
			skipWhile(([, loading]) => loading),
			take(1),
			map(([data]) => data?.map((option) => option.resourceKey) ?? [])
		);
	}

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	loadOptions(): void {
		if (this.techRecord().techRecord_vehicleType === VehicleTypes.HGV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.HgvMake);
		} else if (this.techRecord().techRecord_vehicleType === VehicleTypes.PSV) {
			this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
		} else {
			this.optionsService.loadOptions(ReferenceDataResourceType.TrlMake);
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case 'hgv':
				return this.hgvAndTrailerFields;
			case 'psv':
				return this.psvFields;
			case 'trl':
				return this.hgvAndTrailerFields;
			default:
				return {};
		}
	}

	getTags(formControlName: string): CustomTag[] {
		switch (true) {
			// case this.techRecord().techRecord_vehicleType === 'hgv' && formControlName === 'techRecord_chassisMake':
			// 	return [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }];
			// case this.techRecord().techRecord_vehicleType === 'trl' && formControlName === 'techRecord_chassisMake':
			// 	return [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }];
			default:
				return [];
		}
	}

	get hgvAndTrailerFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_chassisMake: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(30, 'Chassis make must be less than or equal to 30'),
			]),
			techRecord_chassisModel: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(20, 'Chassis model must be less than or equal to 20'),
			]),
			techRecord_bodyMake: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.maxLength(20, 'Body make must be less than or equal to 20'),
			]),
			techRecord_bodyModel: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(20, 'Body model must be less than or equal to 20'),
			]),
			techRecord_bodyType_description: this.fb.control<string | null>({ value: null, disabled: true }, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_modelLiteral: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Model literal must be less than or equal to 30'),
			]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.required('DTp Number is required'),
			]),
		};
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
}
