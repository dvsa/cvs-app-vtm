import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { DOCUMENT_TYPES } from '@forms/templates/general/document-types';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, of } from 'rxjs';

@Component({
	selector: 'app-documents',
	templateUrl: './documents.component.html',
	styleUrls: ['./documents.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		FieldWarningMessageComponent,
		GovukFormGroupAutocompleteComponent,
	],
})
export class DocumentsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	readonly VehicleTypes = VehicleTypes;
	readonly Widths = FormNodeWidth;
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controls, this.form);

		// Attach all form controls to parent
		this.init(this.form);
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

	documentTypes$() {
		return of(DOCUMENT_TYPES.map((doc) => doc.value));
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);
	}

	protected readonly FormNodeWidth = FormNodeWidth;
}
