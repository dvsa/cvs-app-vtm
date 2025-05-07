import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { DOCUMENT_TYPES } from '@forms/templates/general/document-types';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, of } from 'rxjs';

@Component({
	selector: 'app-documents-section-edit',
	templateUrl: './documents-section-edit.component.html',
	styleUrls: ['./documents-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupAutocompleteComponent, GovukFormGroupInputComponent],
})
export class DocumentsSectionEditComponent implements OnInit, OnDestroy {
	commonValidators = inject(CommonValidatorsService);
	controlContainer = inject(ControlContainer);
	fb = inject(FormBuilder);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.addControls();
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

	addControls() {
		const vehicleControls = this.controls;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	documentTypes$() {
		return of(DOCUMENT_TYPES.map((doc) => doc.value));
	}

	get controls() {
		return {
			techRecord_microfilm_microfilmDocumentType: this.fb.control<string | null>(null, []),
			techRecord_microfilm_microfilmRollNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(5, 'Microfilm roll number must be less than or equal to 5 characters'),
			]),
			techRecord_microfilm_microfilmSerialNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(4, 'Microfilm serial number must be less than or equal to 4 characters'),
			]),
		};
	}

	protected readonly VehicleTypes = VehicleTypes;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly FormNodeWidth = FormNodeWidth;
}
