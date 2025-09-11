import { techRecord } from '@/src/app/store/technical-records/technical-record-service.selectors';
import { AsyncPipe, DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukCheckboxGroupComponent } from '@forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { AdrValidatorsService } from '@forms/validators/adr-validators.service';
import { YES_NO_OPTIONS } from '@models/options.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { AdrService } from '@services/adr/adr.service';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { updateScrollPosition } from '@store/technical-records';
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
		RadioComponent,
		DatePipe,
		DefaultNullOrEmpty,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupTextareaComponent,
		PaginationComponent,
	],
})
export class AdrComponent extends EditBaseComponent implements OnInit, OnDestroy {
	adrValidators = inject(AdrValidatorsService);
	adrService = inject(AdrService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);

	// TODO properly type this at some point
	form = this.fb.group<any>({
		techRecord_adrDetails_dangerousGoods: this.fb.control<boolean>(false),

		techRecord_adrDetails_declarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationIssuer: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(500, 'Issuer must be less than or equal to 500 characters'),
		]),
		techRecord_adrDetails_brakeEndurance: this.fb.control<boolean>(false),
		techRecord_adrDetails_weight: this.fb.control<number | null>(null, [
			this.commonValidators.max(99999999, 'Weight (tonnes) must be less than or equal to 99999999'),
			this.adrValidators.requiredWithBrakeEndurance('Weight (tonnes) is required'),
			this.commonValidators.pattern('^\\d*(\\.\\d{0,2})?$', 'Weight (tonnes) Max 2 decimal places'),
		]),
		techRecord_adrDetails_newCertificateRequested: this.fb.control<boolean>(false),
		techRecord_adrDetails_additionalExaminerNotes: this.fb.control<AdditionalExaminerNotes[] | null>(null),
		techRecord_adrDetails_additionalExaminerNotes_note: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1024, 'Additional Examiner Notes must be less than or equal to 1024 characters'),
		]),
		techRecord_adrDetails_adrCertificateNotes: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'ADR Certificate Notes must be less than or equal to 1500 characters'),
		]),
	});

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);
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

	get canDisplayDangerousGoodsWarning() {
		const originalDangerousGoodsValue = (this.store.selectSignal(techRecord)() as TechRecordType<'hgv' | 'lgv' | 'trl'>)
			?.techRecord_adrDetails_dangerousGoods;
		const dangerousGoods = this.form.get('techRecord_adrDetails_dangerousGoods');

		const valueHasChanged = originalDangerousGoodsValue !== dangerousGoods?.value;

		return dangerousGoods?.value === false && dangerousGoods.dirty && valueHasChanged
			? 'By selecting this field it will delete all previous ADR field inputs'
			: null;
	}

	getEditAdditionalExaminerNotePage(examinerNoteIndex: number) {
		const reason = this.route.snapshot.data['reason'];
		const route = `../${reason}/edit-additional-examiner-note/${examinerNoteIndex}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate([route], { relativeTo: this.route, state: this.techRecord });
	}

	getADRExaminerNotes() {
		return this.form.get('techRecord_adrDetails_additionalExaminerNotes') as FormArray;
	}

	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly FormNodeWidth = FormNodeWidth;
}
