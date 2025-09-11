import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukCheckboxGroupComponent } from '@forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-adr',
	templateUrl: './adr.component.html',
	styleUrls: ['./adr.component.scss'],
	imports: [
		GovukFormGroupDateComponent,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		AsyncPipe,
		GovukFormGroupSelectComponent,
		GovukFormGroupRadioComponent,
		ToUppercaseDirective,
		GovukCheckboxGroupComponent,
		GovukFormGroupAutocompleteComponent,
	],
})
export class AdrComponent extends EditBaseComponent implements OnInit, OnDestroy {
	// TODO properly type this at some point
	form = this.fb.group<any>({});
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			// case VehicleTypes.PSV:
			//   return this.psvFields;
			// case VehicleTypes.TRL:
			//   return this.trlFields;
			// case VehicleTypes.SMALL_TRL:
			//   return this.smallTrlFields;
			// case VehicleTypes.LGV:
			//   return this.lgvFields;
			// case VehicleTypes.CAR:
			//   return this.carFields;
			// case VehicleTypes.MOTORCYCLE:
			//   return this.motorcycleFields;
			default:
				return {};
		}
	}

	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
