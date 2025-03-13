import { FormNodeWidth, TagTypeLabels } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-trl-purchasers-section-edit',
	templateUrl: './trl-purchasers-section-edit.component.html',
	styleUrls: ['./trl-purchasers-section-edit.component.scss'],
})
export class TRLPurchasersSectionEditComponent implements OnInit, OnDestroy {
	private readonly fb = inject(FormBuilder);
	private readonly controlContainer = inject(ControlContainer);
	private readonly technicalRecordService = inject(TechnicalRecordService);

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;

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

	private addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;

		for (const [key, control] of Object.entries(vehicleControls ?? {})) {
			this.form?.addControl(key, control, { emitEvent: false });
		}
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	get vehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		if (this.vehicleType === VehicleTypes.TRL) {
			return this.trlOnlyFields;
		}
		return null;
	}

	private get trlOnlyFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			// techRecord_coifSerialNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			//   this.commonValidators.maxLength(8, 'COIF Serial number must be less than or equal to 8 characters'),
			// ]),
			// techRecord_coifCertifierName: this.fb.control<string | null>({ value: null, disabled: false }, [
			//   this.commonValidators.maxLength(20, 'COIF Certifier name must be less than or equal to 20 characters'),
			// ]),
			// techRecord_coifDate: this.fb.control<string | null>({ value: null, disabled: false }, [
			//   this.commonValidators.date('COIF Certifier date'),
			//   this.commonValidators.pastDate('COIF Certifier date must be in the past'),
			// ]),
		};
	}
}
