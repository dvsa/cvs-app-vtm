import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';
import { GovukFormGroupTextareaComponent } from '../../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-reason-for-creation-section-edit',
	templateUrl: './reason-for-creation-edit.component.html',
	styleUrls: ['./reason-for-creation-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class ReasonForCreationSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({
		techRecord_reasonForCreation: this.fb.control('', [
			this.commonValidators.required('Reason for creation is required'),
			this.commonValidators.maxLength(500, 'Reason for creation must be less than or equal to 500 characters'),
		]),
	});

	ngOnInit(): void {
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

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
}
