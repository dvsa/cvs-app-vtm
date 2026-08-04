import { Modes } from '@/src/app/models/modes.enum';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-purchasers',
	templateUrl: './purchasers.component.html',
	styleUrls: ['./purchasers.component.scss'],
	imports: [GovukFormGroupTextareaComponent, ReactiveFormsModule, GovukFormGroupInputComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasersComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;

	tcs = inject(TechnicalRecordChangesService);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'trl'>>();
	filters = input<string[]>([]);
	mode = input.required<Modes>();

	// TODO properly type this at some point
	form = this.fb.group<Partial<Record<keyof TechRecordType<'trl'>, FormControl>>>({
		techRecord_purchaserDetails_name: this.fb.control(null, [
			this.commonValidators.maxLength(150, 'Name or company', 'purchasers', 'techRecord_purchaserDetails_name'),
		]),
		techRecord_purchaserDetails_address1: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 1', 'purchasers', 'techRecord_purchaserDetails_address1'),
		]),
		techRecord_purchaserDetails_address2: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 2', 'purchasers', 'techRecord_purchaserDetails_address2'),
		]),
		techRecord_purchaserDetails_postTown: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Town or city', 'purchasers', 'techRecord_purchaserDetails_postTown'),
		]),
		techRecord_purchaserDetails_address3: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'County', 'purchasers', 'techRecord_purchaserDetails_address3'),
		]),
		techRecord_purchaserDetails_postCode: this.fb.control(null, [
			this.commonValidators.maxLength(12, 'Postcode', 'purchasers', 'techRecord_purchaserDetails_postCode'),
		]),
		techRecord_purchaserDetails_telephoneNumber: this.fb.control(null, [
			this.commonValidators.maxLength(
				25,
				'Telephone number',
				'purchasers',
				'techRecord_purchaserDetails_telephoneNumber'
			),
		]),
		techRecord_purchaserDetails_emailAddress: this.fb.control(null, [
			this.commonValidators.maxLength(255, 'Email address', 'purchasers', 'techRecord_purchaserDetails_emailAddress'),
			this.commonValidators.pattern(
				"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
				'Enter an email address in the correct format, like name@example.com',
				'purchasers',
				'techRecord_purchaserDetails_emailAddress'
			),
		]),
		techRecord_purchaserDetails_faxNumber: this.fb.control(null),
		techRecord_purchaserDetails_purchaserNotes: this.fb.control(null, [
			this.commonValidators.maxLength(
				1024,
				'Purchaser notes',
				'purchasers',
				'techRecord_purchaserDetails_purchaserNotes'
			),
		]),
	});

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
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
}
