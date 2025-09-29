import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { AxlesService } from '@services/axles/axles.service';
import { ReplaySubject } from 'rxjs';

type WeightsForm = Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-weights',
	templateUrl: './weights.component.html',
	styleUrls: ['./weights.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		FieldWarningMessageComponent,
		FieldErrorMessageComponent,
	],
})
export class WeightsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly VehicleTypes = VehicleTypes;
	showDimensionsWarning = false;

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	axlesService = inject(AxlesService);

	// TODO properly type this at some point
	form = this.fb.group<WeightsForm>({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.init(this.form);
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

	get hgvControls() {
		return {
			techRecord_grossGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_grossDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Gross GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_trainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainGbWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainEecWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
			techRecord_maxTrainDesignWeight: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max train GB, EEC, Design Weight must be less than or equal to 99999kg'),
			]),
		};
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return this.hgvControls;
			// case VehicleTypes.TRL:
			// return this.trlControls;
			// case VehicleTypes.PSV:
			// return this.psvControls;
			default:
				return {};
		}
	}

	get techRecordAxles() {
		return this.parent.get('techRecord_axles') as FormArray;
	}

	showAddAxleButton() {
		return (this.techRecord()?.techRecord_noOfAxles ?? 0) < 10;
	}

	removeAxle(index: number) {
		this.axlesService.removeAxle(this.parent, this.techRecord().techRecord_vehicleType, index);
		this.showDimensionsWarning = true;
	}
}
