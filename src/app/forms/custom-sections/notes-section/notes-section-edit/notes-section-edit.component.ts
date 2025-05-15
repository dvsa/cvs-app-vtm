import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

import { GovukFormGroupTextareaComponent } from '../../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-notes-section-edit',
	templateUrl: './notes-section-edit.component.html',
	styleUrls: ['./notes-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class NotesSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
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

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.PSV:
				return this.psvFields;
			default:
				return this.defaultFields;
		}
	}

	get psvFields() {
		return {
			techRecord_remarks: this.fb.control<string | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.maxLength(1024, 'Notes must be less than or equal to 1024 characters'),
			]),
			techRecord_dispensations: this.fb.control<string | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.maxLength(160, 'Dispensations must be less than or equal to 160 characters'),
			]),
		};
	}

	get defaultFields() {
		return {
			techRecord_notes: this.fb.control<string | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.maxLength(1024, 'Notes must be less than or equal to 1024 characters'),
			]),
		};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
}
