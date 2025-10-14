import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss'],
	imports: [GovukFormGroupTextareaComponent, ReactiveFormsModule],
})
export class NotesComponent extends EditBaseComponent implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.PSV:
				return this.psvFields;
			default:
				return this.defaultFields;
		}
	}

	get defaultFields() {
		return {
			techRecord_notes: this.fb.control<string | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.maxLength(1024, 'Notes must be less than or equal to 1024 characters'),
			]),
		};
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

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	protected readonly VehicleTypes = VehicleTypes;
}
