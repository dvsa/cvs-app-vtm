import { ButtonComponent } from '@/src/app/components/button/button.component';
import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { RetrieveDocumentDirective } from '@/src/app/directives/retrieve-document/retrieve-document.directive';
import { FieldErrorMessageComponent } from '@/src/app/forms/components/field-error-message/field-error-message.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@/src/app/forms/utils/enum-map';
import { PASS_FAIL_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { TEST_TYPES_GROUP7, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@/src/app/models/testTypeId.enum';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestService } from '@/src/app/services/test/test.service';
import { generateADRCertificateSuccess } from '@/src/app/store/technical-records';
import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import {
	TechRecordGETHGV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DocumentType } from '@models/document-type.enum';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
	selector: 'app-test-create',
	templateUrl: './test-create.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupDateComponent,
		ButtonComponent,
		FieldErrorMessageComponent,
		RetrieveDocumentDirective,
		RadioComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
	],
})
export class TestCreateComponent implements OnInit {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly techRecordService = inject(TechnicalRecordService);
	readonly actions$ = inject(Actions);
	readonly destroyRef = inject(DestroyRef);
	readonly loadStatusService = inject(LoadStatusService);

	readonly testResult = input<TestResultSchema>();

	readonly form = this.testService.form;

	readonly DocumentType = DocumentType;
	readonly FormNodeWidth = FormNodeWidth;
	readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	readonly PASS_FAIL_OPTIONS = PASS_FAIL_OPTIONS;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	readonly adrCertificateFileName = signal<string | undefined>(undefined);
	readonly adrCertificateError = signal<string | null | undefined>(undefined);

	ngOnInit(): void {
		this.actions$
			.pipe(ofType(generateADRCertificateSuccess), takeUntilDestroyed(this.destroyRef))
			.subscribe(({ id }) => {
				this.adrCertificateFileName.set(id);
			});
	}

	isTestTypeGroup7(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowResult(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowCentralDocs(): boolean {
		return (
			[...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
				this.testResult()?.testTypes[0].testTypeId ?? ''
			) && this.testResult()?.testTypes[0].testResult !== 'fail'
		);
	}

	shouldShowDescription(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowGenerateADRCertificate(): boolean {
		return (
			TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '') &&
			this.testResult()?.testTypes[0].testResult === 'pass'
		);
	}

	handleGenerateADRCertificateSubmit(): void {
		// @TODO: create a new action
		/*
		this.store.dispatch(
			generateADRCertificate({
				systemNumber: this.systemNumber ?? '',
				createdTimestamp: this.createdTimestamp ?? '',
				certificateType: 'PASS',
			})
		);
    */
	}

	// TODO: move into a ngrx selector
	get lastCertificateDate() {
		let sortedTests: ADRCertificateDetails[] | undefined;
		this.techRecordService.techRecord$.pipe(take(1)).subscribe((record) => {
			sortedTests = (record as TechRecordGETHGV | TechRecordGETTRL).techRecord_adrPassCertificateDetails?.sort(
				(a, b) =>
					a.generatedTimestamp && b.generatedTimestamp
						? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime()
						: 0
			);
		});
		return sortedTests && sortedTests?.length > 0
			? `An ADR certificate was last generated on ${new Date(sortedTests[0].generatedTimestamp).toLocaleDateString('en-UK')}`
			: 'There are no previous ADR certificates for this vehicle';
	}

	documentParams(certificate: string): Map<string, string> {
		return new Map([['fileName', certificate]]);
	}

	shouldShowCertificateNumber(): boolean {
		if (!this.isTestTypeGroup7()) return false;
		if (this.testResult()?.testTypes[0].testResult == 'fail') {
			return false;
		}
		return !(
			this.testResult()?.testTypes[0].testResult == 'pass' && this.testResult()?.testTypes[0].centralDocs?.issueRequired
		);
	}

	shouldShowExpiryDate(): boolean {
		const isGroup7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED) return false;
		if (!isGroup7) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	}

	shouldShowProhibitionIssued(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowLoadStatus(): boolean {
		return this.loadStatusService.isLoadStatusApplicable(this.testResult());
	}
}
