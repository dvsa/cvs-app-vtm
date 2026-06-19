import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { deficiencyCategory } from '@/src/app/models/defects/deficiency-category.enum';
import { Deficiency } from '@/src/app/models/defects/deficiency.model';
import { MultiOptions, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { DeficiencyCategoryEnum } from '@/src/app/models/test-results/test-result-defect.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectByDeficiencyRef, selectByImNumber } from '@/src/app/store/defects';
import { selectRouteDataProperty, selectRouteParam } from '@/src/app/store/router/router.selectors';
import {
	createDefect,
	removeDefect,
	toEditOrNotToEdit,
	updateDefect,
	updateResultOfTest,
} from '@/src/app/store/test-records';
import { KeyValuePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	DefectCategoryReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectDetailsSchema, MediaSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-details';
import { Store } from '@ngrx/store';
import { GovukFormGroupCheckboxComponent } from '../../../components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupRadioComponent } from '../../../components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '../../../components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '../../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '../../../validators/common-validators.service';

@Component({
	selector: 'app-defect-v2',
	templateUrl: './defect-v2.component.html',
	styleUrls: ['./defect-v2.component.scss'],
	imports: [
		TagComponent,
		FormsModule,
		KeyValuePipe,
		ButtonComponent,
		ButtonGroupComponent,
		ReactiveFormsModule,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupCheckboxComponent,
		DefaultNullOrEmpty,
	],
})
export class DefectV2Component {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	cdr = inject(ChangeDetectorRef);
	route = inject(ActivatedRoute);
	http = inject(HttpClient);
	testService = inject(TestService);
	globalErrorService = inject(GlobalErrorService);
	commonValidators = inject(CommonValidatorsService);
	defectMediaService = inject(DefectMediaService, { optional: true });

	defectIndex = this.store.selectSignal(selectRouteParam('defectIndex'));
	deficiencyRef = this.store.selectSignal(selectRouteParam('ref'));
	isEditing = this.store.selectSignal(selectRouteDataProperty('isEditing'));
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	defect = computed(() => this.getDefect());

	loading = false;
	additionalInfoMultiOptions: Record<string, MultiOptions> = {};

	form = this.fb.group({
		deficiencyRef: this.fb.control<string>(''),
		deficiencyCategory: this.fb.control<string>(''),
		imNumber: this.fb.control<number | null>(null),
		imDescription: this.fb.control<string>(''),
		itemNumber: this.fb.control<number | null>(null),
		itemDescription: this.fb.control<string>(''),
		deficiencyId: this.fb.control<string | null>(null),
		deficiencySubId: this.fb.control<string | null>(null),
		deficiencyText: this.fb.control<string | null>(null),
		additionalInformation: this.fb.group({
			location: this.fb.group({
				vertical: this.fb.control<string | null>(null),
				horizontal: this.fb.control<string | null>(null),
				lateral: this.fb.control<string | null>(null),
				longitudinal: this.fb.control<string | null>(null),
				rowNumber: this.fb.control<number | null>(null),
				seatNumber: this.fb.control<number | null>(null),
				axleNumber: this.fb.control<number | null>(null),
			}),
			notes: this.fb.control<string | null>(null, [
				this.commonValidators.applyWhen(() => this.isNotesRequired(), this.commonValidators.required('Notes')),
			]),
		}),
		prs: this.fb.control<boolean | null>(null),
		prohibitionIssued: this.fb.control<boolean | null>(null, [
			this.commonValidators.applyWhen(
				() => this.isProhibitionIssuedRequired(),
				this.commonValidators.required('Prohibition issued')
			),
		]),
		stdForProhibition: this.fb.control<boolean | null>(null),
		// metadata: this.fb.control<DefectMetadataSchema>({ category: {} }),
		media: this.fb.control<MediaSchema[] | undefined>({ value: undefined, disabled: false }),
	});

	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;

	async ngOnInit(): Promise<void> {
		const vehicleType = this.testService.form.controls.vehicleType.value;

		// If we're amending an existing defect, use the existing values
		const index = Number(this.defectIndex());
		const existingDefects = this.testService.form.controls.testTypes.at(0).controls.defects.value;
		const existingDefect = existingDefects[index];
		const deficiencyRef = this.deficiencyRef();
		if (existingDefect) this.form.patchValue(existingDefect);

		// If we're creating a new defect, use the taxonomy to populate the form
		if (!existingDefect && deficiencyRef) {
			const [defect, item, deficiency] = this.store.selectSignal(selectByDeficiencyRef(deficiencyRef, vehicleType))();
			this.populateDefectFromTaxonomy(defect, item, deficiency);
		}

		// Initialise the additonal information for the defect using the taxonomy
		const imNumber = this.form.controls.imNumber.value;
		const defectCategory = this.store.selectSignal(selectByImNumber(imNumber || Number.NaN, vehicleType))();
		if (defectCategory) this.populateAdditionalInfoFromTaxonomy(defectCategory);

		// Load images (if applicable)
		await this.loadMediaItems();
	}

	async loadMediaItems() {
		const defect = this.defect();
		const testResult = this.testResult();
		if (!testResult || !defect || !this.defectMediaService) return;

		this.loading = true;

		if (this.defectMediaService.canDownloadAdasMediaItems(defect)) {
			await this.defectMediaService.getAdasZip(testResult.testResultId);
		}

		if (this.defectMediaService.canDownloadDefectMediaItems(defect)) {
			await this.defectMediaService.getDefectZip(testResult.testResultId);
		}

		if (Array.isArray(defect.media)) {
			for (const media of defect.media) {
				await this.defectMediaService.loadMediaItemAsBase64(testResult, defect, media);
			}
		}

		this.loading = false;
		this.cdr.detectChanges();
	}

	populateDefectFromTaxonomy(
		defect: DefectCategoryReferenceDataSchema | undefined,
		item: DefectItemReferenceDataSchema | undefined,
		deficiency: Deficiency | undefined
	) {
		const initialValues: Partial<DefectDetailsSchema> = {
			imDescription: defect?.imDescription,
			imNumber: defect?.imNumber,
			itemDescription: item?.itemDescription,
			itemNumber: item?.itemNumber,
			deficiencyCategory: DeficiencyCategoryEnum.Advisory,
			deficiencyRef: `${defect?.imNumber}.${item?.itemNumber}`,
			prohibitionIssued: false,
			stdForProhibition: false,
		};

		// Use deficiency values if they exist
		if (deficiency) {
			initialValues.deficiencyCategory = deficiency.deficiencyCategory;
			initialValues.deficiencyId = deficiency.deficiencyId;
			initialValues.deficiencySubId = deficiency.deficiencySubId;
			initialValues.deficiencyText = deficiency.deficiencyText;
			initialValues.deficiencyRef = deficiency.ref;
			initialValues.stdForProhibition = deficiency.stdForProhibition;
		}

		// Remove trailing colon from item description if it exists
		if (!deficiency && item?.itemDescription?.endsWith(':')) {
			initialValues.itemDescription = item.itemDescription.slice(0, -1);
		}

		// For dangerous defects, ensure that media array is populated
		if (initialValues.deficiencyCategory === deficiencyCategory.Dangerous) {
			initialValues.media = [{ type: 'failReason', reason: 'Contingency test', path: ' ' }];
		}

		this.form.patchValue(initialValues);
	}

	populateAdditionalInfoFromTaxonomy(defectCategory: DefectCategoryReferenceDataSchema) {
		const vehicleType = this.testService.form.controls.vehicleType.value;
		if (vehicleType !== 'psv' && vehicleType !== 'trl' && vehicleType !== 'hgv') return;

		const additionalInfo = defectCategory.additionalInfo;
		const vehicleInfo = additionalInfo[vehicleType];
		if (!vehicleInfo || !vehicleInfo.location) return;

		// Use defect taxonomy to pre-calculate multi-options for each additional information field
		for (const [key, value] of Object.entries(vehicleInfo.location)) {
			if (Array.isArray(value)) {
				this.additionalInfoMultiOptions[key] = value.map((option) => ({
					value: option,
					label: this.toPascalCase(String(option)),
				}));
			}
		}
	}

	toPascalCase(s: string): string {
		return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
	}

	getCategoryColor(category: string | null = 'major') {
		if (category === 'major') return 'orange';
		if (category === 'minor') return 'yellow';
		if (category === 'dangerous') return 'red';
		if (category === 'advisory') return 'blue';

		return 'orange';
	}

	getDefect(): DefectDetailsSchema | undefined {
		const defectIndex = Number(this.defectIndex());
		return this.testResult()?.testTypes[0].defects[defectIndex];
	}

	isEditingDefect(): boolean {
		const index = Number(this.defectIndex());
		return !Number.isNaN(index);
	}

	isDangerous(): boolean {
		return this.form.getRawValue().deficiencyCategory === 'dangerous';
	}

	isDangerousAsterisk(): boolean {
		return this.form.getRawValue().stdForProhibition === true;
	}

	isAdvisory(): boolean {
		return this.form.getRawValue().deficiencyCategory === 'advisory';
	}

	isNotesRequired(): boolean {
		const defect = this.form.getRawValue();
		const imNumber = defect.imNumber ? `${defect.imNumber}.` : '';
		const itemNumber = defect.itemNumber ? `${defect.itemNumber}.` : '';
		const deficiencyId = defect.deficiencyId ? `${defect.deficiencyId}.` : '';
		const deficiencySubId = defect.deficiencySubId ?? '';
		const defectType = `${imNumber}${itemNumber}${deficiencyId}${deficiencySubId}`;

		// Allow notes to be optional for certain defect types
		const optionalDefectNotes = ['43.1.a.ii', '41.1.a.ii', '10.1.iii'];
		if (optionalDefectNotes.includes(defectType)) return false;

		const isAdvisory = defect.deficiencyCategory === deficiencyCategory.Advisory;
		const isDangerous = defect.deficiencyCategory === deficiencyCategory.Dangerous;

		return isAdvisory || (isDangerous && !!defect.stdForProhibition && !defect.prohibitionIssued);
	}

	isProhibitionIssuedRequired(): boolean {
		const defect = this.form.getRawValue();
		const isDangerous = defect.deficiencyCategory === deficiencyCategory.Dangerous;

		// Prohibition issued is required for all dangerous defects with no standard for prohibition
		return isDangerous && !defect.stdForProhibition;
	}

	onConfirm(): void {
		this.form.markAllAsTouched();

		// Collect and display all form errors in a global summary
		if (this.form.invalid) {
			const errors = this.globalErrorService.extractGlobalErrors(this.form);
			this.globalErrorService.setErrors(errors);
			return;
		}

		// Add or update the defect
		const index = Number(this.defectIndex());
		const defect = this.form.getRawValue() as DefectDetailsSchema;
		if (Number.isNaN(index)) {
			this.store.dispatch(createDefect({ defect }));
		} else {
			this.store.dispatch(updateDefect({ defect, index }));
		}

		this.navigateBack();
	}

	onCancel(): void {
		this.navigateBack();
	}

	onRemove(): void {
		const index = Number(this.defectIndex());
		this.store.dispatch(removeDefect({ index }));
		this.navigateBack();
	}

	navigateBack(): void {
		// Update test result, add return to main form
		this.store.dispatch(updateResultOfTest());
		this.router.navigate(['../..'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
	}

	getFailureToCaptureDefectMediaReason(): string {
		const defect = this.defect();

		if (!defect?.media) {
			return 'No media available';
		}

		for (const reason of defect.media) {
			if (reason.type === 'failReason') {
				const formattedReason = this.defectMediaService?.formatMediaFailureReason(reason.reason) ?? reason.reason;
				return `No media available - ${formattedReason}`;
			}
		}

		return 'No media available';
	}
}
