import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import {
	MultiOptions,
	PASS_FAIL_ABANDONED_OPTIONS,
	PASS_FAIL_OPTIONS,
	PASS_FAIL_PRS_OPTIONS,
	RESULT_OPTIONS,
	YES_NO_OPTIONS,
} from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ApprovalMediaDownloadComponent } from '@components/approval-media-download/approval-media-download.component';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { DocumentType } from '@models/document-type.enum';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { GenerateAdrCertificateComponent } from './generate-adr-certificate/generate-adr-certificate.component';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [
		DatePipe,
		NgTemplateOutlet,
		FormField,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
		RadioComponent,
		GovukCheckboxGroupComponent,
		ApprovalMediaDownloadComponent,
		GenerateAdrCertificateComponent,
	],
	styleUrls: ['./test.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	testTypeService = inject(TestTypeService);
	techRecordService = inject(TechnicalRecordService);
	optionsService = inject(MultiOptionsService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	techRecord = this.store.selectSignal(techRecord);
	abandonReasons = computed(() => this.getAbandonReasonsList());

	readonly FormNodeWidth = FormNodeWidth;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);
	readonly resultOptions = computed(() => {
		if (this.testService.mode() === Modes.AMEND) {
			return this.testService.isGroup3And4And8() ? PASS_FAIL_ABANDONED_OPTIONS : RESULT_OPTIONS;
		}
		if (this.testService.isSpecialistGroup1()) {
			return PASS_FAIL_PRS_OPTIONS;
		}
		return PASS_FAIL_OPTIONS;
	});

	ngOnInit(): void {
		this.prepopulateVTG15Required();
		this.loadOptions();
	}

	prepopulateVTG15Required(): void {
		if (this.testService.initialMode() !== Modes.EDIT && this.testService.initialMode() !== Modes.CREATE) return;

		const vtg15Required = this.form.vtg15.vtg15Required();
		if (vtg15Required.value() != null) return;

		const techRecord = this.techRecord();
		if (
			techRecord?.techRecord_vehicleType === 'hgv' ||
			techRecord?.techRecord_vehicleType === 'lgv' ||
			techRecord?.techRecord_vehicleType === 'trl'
		) {
			vtg15Required.value.set(techRecord.techRecord_adrDetails_dangerousGoods ? null : false);
		}
	}

	getAbandonReasonsList(): MultiOptions {
		const testResult = this.testResult();
		if (!testResult) return [];

		const resourceType = this.testTypeService.getAbandonReasonsResourceType(testResult);
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({
			label: `${reason.description}`,
			value: `${reason.description}`,
		}));
	}

	loadOptions(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		this.optionsService.loadOptions(this.testTypeService.getAbandonReasonsResourceType(testResult));
	}

	readonly shouldShowGenerateADRCertificate = computed(() => {
		if (this.testService.mode() === Modes.AMEND) {
			return false;
		}
		return this.testService.isGroup7() && this.testResult()?.testTypes[0].testResult === 'pass';
	});

	readonly shouldShowApprovalsMedia = computed(
		() =>
			this.testService.isSpecialistGroup1() &&
			(this.testService.mode() === Modes.VIEW ||
				(this.testService.initialMode() === Modes.AMEND && this.testService.mode() === Modes.SUMMARY))
	);

	getReasonsList(reasons: string | string[] | null): string[] {
		return Array.isArray(reasons) ? reasons : (reasons?.split(this.ABANDON_REASONS_REGEX) ?? []);
	}

	protected readonly Modes = Modes;
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	protected readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	protected readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	protected readonly getOptionsFromEnum = getOptionsFromEnum;
	protected readonly PASS_FAIL_OPTIONS = PASS_FAIL_OPTIONS;
	protected readonly DocumentType = DocumentType;
}
