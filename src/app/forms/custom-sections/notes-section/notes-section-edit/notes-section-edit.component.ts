import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { GovukFormGroupTextareaComponent } from '../../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-notes-section-edit',
	templateUrl: './notes-section-edit.component.html',
	styleUrls: ['./notes-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class NotesSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

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
