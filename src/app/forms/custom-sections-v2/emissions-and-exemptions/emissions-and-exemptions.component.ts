import { DecimalOnlyDirective } from '@/src/app/directives/app-decimal-only/app-decimal-only.directive';
import { FilterByTagsDirective } from '@/src/app/directives/filter-by-tags/filter-by-tags.directive';
import { Modes } from '@/src/app/models/modes.enum';
import { EMISSION_STANDARD_OPTIONS, EXEMPT_OR_NOT_OPTIONS } from '@/src/app/models/options.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';

@Component({
	selector: 'app-emissions-and-exemptions',
	templateUrl: './emissions-and-exemptions.component.html',
	styleUrls: ['./emissions-and-exemptions.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		FilterByTagsDirective,
		DecimalOnlyDirective,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsAndExemptionsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	tcs = inject(TechnicalRecordChangesService);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({});
	filters = input<string[]>([]);
	mode = input.required<Modes>();

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			default:
				return {};
		}
	}

	get hgvFields() {
		return {
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99,
					'Emission limit (smoke absorption coefficient)',
					'',
					'emissions-and-exemptions',
					'techRecord_emissionsLimit'
				),
				this.commonValidators.pattern(
					/^\d*(\.\d{0,5})?$/,
					'Emission limit (smoke absorption coefficient) max 5 decimal places',
					'emissions-and-exemptions',
					'techRecord_emissionsLimit'
				),
			]),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
		};
	}

	get psvFields() {
		return {
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(
					99,
					'Emission limit (smoke absorption coefficient)',
					'',
					'emissions-and-exemptions',
					'techRecord_emissionsLimit'
				),
				this.commonValidators.pattern(
					/^\d*(\.\d{0,5})?$/,
					'Emission limit (smoke absorption coefficient) max 5 decimal places',
					'emissions-and-exemptions',
					'techRecord_emissionsLimit'
				),
			]),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
		};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		if (!this.form.get(formControlName)) return false;
		return this.mode() === Modes.SUMMARY ? this.tcs.hasChanged(formControlName) : true;
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly EXEMPT_OR_NOT_OPTIONS = EXEMPT_OR_NOT_OPTIONS;
	protected readonly EMISSION_STANDARD_OPTIONS = EMISSION_STANDARD_OPTIONS;
	protected readonly Modes = Modes;
}
