import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import {
	ControlContainer,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-authorisation-into-service-section-edit',
	templateUrl: './authorisation-into-service-section-edit.component.html',
	styleUrls: ['./authorisation-into-service-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule],
})
export class AuthorisationIntoServiceSectionEditComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;

	fb = inject(FormBuilder);
	store = inject(Store);
	actions = inject(Actions);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	referenceDataService = inject(ReferenceDataService);
	optionsService = inject(MultiOptionsService);
	cdr = inject(ChangeDetectorRef);
	techRecord = input.required<V3TechRecordModel>();

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
		const vehicleControls = this.trailerFields;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	get trailerFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {};
	}
}
